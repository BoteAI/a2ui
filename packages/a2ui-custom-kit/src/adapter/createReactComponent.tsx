import React, { useEffect, useState, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import type { ComponentApi } from '../schema/webCoreV09Shim';
import type { z } from 'zod';
import type { A2UICustomElementHost } from '../runtime/elementHost';
import { runAfterPropsReady, subscribeV09ComponentUpdates } from '../runtime/subscribeV09Updates';
import {
  normalizeChildListInput,
  resolveChildSlotsFromInput,
  resolveTemplateChildSlots,
  type ChildSlotDescriptor,
} from './childListRuntime';

type SchemaProps<A extends ComponentApi> = z.infer<A['schema']>;

export type ReactA2UICustomRenderProps<A extends ComponentApi> = {
  props: SchemaProps<A>;
  host: A2UICustomElementHost;

  /** 渲染 A2UI 子组件；childId 为组件树中的子节点 ID，basePath 可覆盖数据上下文路径 */
  buildChild: (childId: string, basePath?: string) => React.ReactNode;

  /** 渲染 ChildListSchema 子节点列表（静态 ID 数组或动态 template） */
  buildChildren: (children: unknown, defaultBasePath?: string) => React.ReactNode;
};

// ---------------------------------------------------------------------------
// 内部类型：运行时 SurfaceModel / ComponentModel / Catalog 最小可用子集
// ---------------------------------------------------------------------------

/** @a2ui/web_core SurfaceModel 运行时最小接口 */
interface SurfaceModelLike {
  componentsModel: {
    get(id: string): ComponentModelLike | undefined;
    onCreated: { subscribe(fn: (comp: ComponentModelLike) => void): { unsubscribe: () => void } };
    onDeleted: { subscribe(fn: (id: string) => void): { unsubscribe: () => void } };
  };
  catalog: {
    components: Map<string, CatalogEntryLike>;
  };
  theme?: unknown;
  dispatchAction?: (action: unknown, componentId?: string) => void;
}

/** @a2ui/web_core ComponentModel 运行时最小接口 */
interface ComponentModelLike {
  id: string;
  type: string;
  properties?: Record<string, unknown>;
}

/** catalog 组件条目运行时最小接口 */
interface CatalogEntryLike {
  tagName: string;
}

// ---------------------------------------------------------------------------
// 从 host.context 提取 SurfaceModel（运行时由 ComponentContext 注入）
// ---------------------------------------------------------------------------

function getSurfaceFromHost(host: A2UICustomElementHost): SurfaceModelLike | null {
  const ctx = host.context as Record<string, unknown> | undefined;
  if (!ctx) return null;
  // ComponentContext 直接持有 surface，dataContext 也持有 surface
  const surface = (ctx.surface ?? (ctx.dataContext as Record<string, unknown> | undefined)?.surface) as SurfaceModelLike | undefined;
  return surface ?? null;
}

// ---------------------------------------------------------------------------
// A2uiChildSlot —— 参照 A2UI 源码 DeferredChild + ResolvedChild 实现
// ---------------------------------------------------------------------------

/**
 * 在 React 树中渲染一个 A2UI 子组件。
 *
 * 职责：
 * 1. 订阅 surface.componentsModel 的 onCreated/onDeleted，感知子组件变化
 * 2. 子组件存在时，从 catalog 获取实现及其 tagName，创建 DOM 元素
 * 3. 构造与 ComponentContext 兼容的上下文（复用父级 dataContext.nested）
 * 4. 通过 React ref 将 DOM 元素挂载到容器
 */
const A2uiChildSlot: React.FC<{
  host: A2UICustomElementHost;
  childId: string;
  basePath: string;
}> = ({ host, childId, basePath }) => {
  const surface = getSurfaceFromHost(host);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // 版本号用于感知子组件创建/删除事件，触发重新渲染
  const [version, setVersion] = useState(0);

  // --- 订阅组件存在性变化（参照 DeferredChild） ---
  useEffect(() => {
    if (!surface) return undefined;
    const unsub1 = surface.componentsModel.onCreated.subscribe((comp) => {
      if (comp.id === childId) {
        setVersion((v) => v + 1);
      }
    });
    const unsub2 = surface.componentsModel.onDeleted.subscribe((id) => {
      if (id === childId) {
        setVersion((v) => v + 1);
      }
    });
    return () => {
      unsub1.unsubscribe();
      unsub2.unsubscribe();
    };
  }, [surface, childId]);

  // --- 获取当前 componentModel ---
  const componentModel = surface?.componentsModel.get(childId);

  // --- 挂载子组件 DOM 元素（参照 ResolvedChild + renderA2uiNode） ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !surface || !componentModel) return undefined;

    // 清空旧内容
    container.innerHTML = '';

    // 从 catalog 获取实现及其 tagName
    const impl = surface.catalog.components.get(componentModel.type) as CatalogEntryLike | undefined;
    if (!impl || !impl.tagName) {
      container.innerHTML = `<span style="color:red">Unknown component type: ${componentModel.type}</span>`;
      return undefined;
    }

    // 创建元素（与 v0.9 renderA2uiNode 一致）
    const el = document.createElement(impl.tagName);
    el.id = childId;

    // 构造与 ComponentContext 兼容的上下文对象
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parentDC = (host.context as any)?.dataContext as
      | {
          nested?: (p: string) => unknown;
          path?: string;
          surface?: unknown;
          set?: (p: string, v: unknown) => void;
          resolveDynamicValue?: (v: unknown) => unknown;
        }
      | undefined;

    // 优先使用 dataContext.nested() 创建子 DataContext（复用路径解析逻辑）
    let childDataContext: unknown;
    if (parentDC && typeof parentDC.nested === 'function') {
      childDataContext = parentDC.nested(basePath);
    } else {
      // 回退：手动构造最小兼容对象
      childDataContext = {
        surface,
        path: basePath,
        set: parentDC?.set?.bind(parentDC),
        resolveDynamicValue: parentDC?.resolveDynamicValue?.bind(parentDC),
      };
    }

    const childContext = {
      componentModel,
      surfaceComponents: surface.componentsModel,
      theme: surface.theme,
      dataContext: childDataContext,
      dispatchAction: (action: unknown) =>
        surface.dispatchAction?.(action, componentModel.id),
    };

    // 设置上下文（NormalizedCustomElement 的 context setter 会处理归一化）
    (el as unknown as { context: unknown }).context = childContext;

    container.appendChild(el);

    return () => {
      container.innerHTML = '';
    };
    // version 变化时需重新挂载（组件可能被替换或删除后重建）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surface, childId, basePath, componentModel, host, version]);

  // 子组件尚不存在时显示加载占位
  if (!componentModel) {
    return <div style={{ color: 'gray', padding: '4px' }}>[Loading {childId}...]</div>;
  }

  return <div ref={containerRef} style={{ display: 'contents' }} />;
};

// ---------------------------------------------------------------------------
// A2uiChildListSlot —— 解析 ChildListSchema 并渲染多个 A2uiChildSlot
// ---------------------------------------------------------------------------

const A2uiChildListSlot: React.FC<{
  host: A2UICustomElementHost;
  childrenRaw: unknown;
  defaultBasePath?: string;
}> = ({ host, childrenRaw, defaultBasePath }) => {
  const normalized = useMemo(() => normalizeChildListInput(childrenRaw), [childrenRaw]);
  const [templateSlots, setTemplateSlots] = useState<ChildSlotDescriptor[]>([]);

  useEffect(() => {
    if (normalized.kind !== 'template') {
      setTemplateSlots([]);
      return undefined;
    }

    const dc = host.context?.dataContext;
    const { componentId, path } = normalized;

    const applyListValue = (listValue: unknown) => {
      setTemplateSlots(resolveTemplateChildSlots(host, componentId, path, listValue));
    };

    if (dc && typeof dc.subscribeDynamicValue === 'function') {
      const bound = dc.subscribeDynamicValue({ path }, applyListValue);
      applyListValue(bound.value);
      return () => bound.unsubscribe();
    }

    if (dc && typeof dc.resolveDynamicValue === 'function') {
      try {
        applyListValue(dc.resolveDynamicValue({ path }));
      } catch {
        applyListValue([]);
      }
    } else {
      applyListValue([]);
    }

    return undefined;
  }, [host, normalized]);

  const slots = useMemo(() => {
    if (normalized.kind === 'template') {
      return templateSlots;
    }
    return resolveChildSlotsFromInput(host, normalized, defaultBasePath);
  }, [host, normalized, templateSlots, defaultBasePath]);

  if (slots.length === 0) {
    return null;
  }

  return (
    <>
      {slots.map((slot, index) => (
        <A2uiChildSlot
          key={`${slot.childId}-${slot.basePath}-${index}`}
          host={host}
          childId={slot.childId}
          basePath={slot.basePath}
        />
      ))}
    </>
  );
};

// ---------------------------------------------------------------------------
// createReactComponent 工厂
// ---------------------------------------------------------------------------

/**
 * 用 React 写视图，对外仍产出 CustomElementConstructor，供 LitSurfaceHost customComponents 注册。
 * props 来自引擎归一化后的 componentProps；复杂双向绑定请使用 host.context.dataContext。
 * buildChild(childId, basePath?) 可渲染单个 A2UI 子组件。
 * buildChildren(children, defaultBasePath?) 可渲染 ChildListSchema 子节点列表。
 */
export function createReactComponent<A extends ComponentApi>(
  api: A,
  render: (args: ReactA2UICustomRenderProps<A>) => React.ReactElement | null,
): CustomElementConstructor {
  const displayName = `${api.name}ReactHost`;

  class ReactBridgedCustomElement extends HTMLElement {
    componentProps?: Record<string, unknown>;

    context?: A2UICustomElementHost['context'];

    private mountRoot: HTMLDivElement | null = null;

    private unsubscribe?: () => void;

    connectedCallback() {
      if (!this.mountRoot) {
        this.mountRoot = document.createElement('div');
        this.appendChild(this.mountRoot);
      }
      runAfterPropsReady(() => this.paint());
      this.unsubscribe = subscribeV09ComponentUpdates(this, () => this.paint());
    }

    disconnectedCallback() {
      this.unsubscribe?.();
      this.unsubscribe = undefined;
      if (this.mountRoot) {
        ReactDOM.unmountComponentAtNode(this.mountRoot);
        this.mountRoot.remove();
      }
      this.mountRoot = null;
    }

    /** 渲染指定子组件为 React 节点 */
    private buildChild(childId: string, basePath?: string): React.ReactNode {
      const path = basePath || this.context?.dataContext?.path || '/';
      return React.createElement(A2uiChildSlot, {
        key: `${childId}-${path}`,
        host: this,
        childId,
        basePath: path,
      });
    }

    /** 渲染 ChildListSchema 子节点列表为 React 节点 */
    private buildChildren(childrenRaw: unknown, defaultBasePath?: string): React.ReactNode {
      return React.createElement(A2uiChildListSlot, {
        key: `children-${JSON.stringify(childrenRaw)}`,
        host: this,
        childrenRaw,
        defaultBasePath,
      });
    }

    private paint() {
      if (!this.mountRoot) return;
      const props = (this.componentProps ?? {}) as SchemaProps<A>;
      const tree = render({
        props,
        host: this,
        buildChild: (id, path) => this.buildChild(id, path),
        buildChildren: (children, path) => this.buildChildren(children, path),
      });
      ReactDOM.render(<>{tree}</>, this.mountRoot);
    }
  }

  Object.defineProperty(ReactBridgedCustomElement, 'name', { value: displayName, configurable: true });

  return ReactBridgedCustomElement;
}
