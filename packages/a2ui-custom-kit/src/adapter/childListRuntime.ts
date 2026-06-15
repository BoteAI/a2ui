import type { A2UICustomElementHost } from '../runtime/elementHost';
import type { A2UIV09ElementContext } from '../runtime/types';

export type ChildSlotDescriptor = {
  childId: string;
  basePath: string;
};

export type NormalizedChildListInput =
  | { kind: 'empty' }
  | { kind: 'static'; ids: string[] }
  | { kind: 'template'; componentId: string; path: string }
  | { kind: 'resolved'; slots: ChildSlotDescriptor[] };

type DataContextLike = NonNullable<A2UIV09ElementContext['dataContext']> & {
  nested?: (relativePath: string) => { path?: string; nested?: (relativePath: string) => unknown };
};

function getDefaultBasePath(host: A2UICustomElementHost, override?: string): string {
  if (override) return override;
  return host.context?.dataContext?.path || '/';
}

function getDataContext(host: A2UICustomElementHost): DataContextLike | undefined {
  return host.context?.dataContext as DataContextLike | undefined;
}

function isResolvedDescriptor(item: unknown): item is { id: string; basePath: string } {
  return (
    !!item
    && typeof item === 'object'
    && typeof (item as { id?: unknown }).id === 'string'
    && typeof (item as { basePath?: unknown }).basePath === 'string'
  );
}

/** 将 ChildListSchema 运行时值归一化为可解析形态 */
export function normalizeChildListInput(raw: unknown): NormalizedChildListInput {
  if (raw == null) {
    return { kind: 'empty' };
  }

  if (Array.isArray(raw)) {
    if (raw.length === 0) {
      return { kind: 'empty' };
    }
    if (raw.every((item) => typeof item === 'string')) {
      return { kind: 'static', ids: raw as string[] };
    }
    if (raw.every(isResolvedDescriptor)) {
      return {
        kind: 'resolved',
        slots: (raw as { id: string; basePath: string }[]).map((item) => ({
          childId: item.id,
          basePath: item.basePath,
        })),
      };
    }
    return { kind: 'empty' };
  }

  if (typeof raw !== 'object') {
    return { kind: 'empty' };
  }

  const obj = raw as Record<string, unknown>;

  if (Array.isArray(obj.explicitList)) {
    const ids = obj.explicitList.filter((id): id is string => typeof id === 'string');
    return ids.length > 0 ? { kind: 'static', ids } : { kind: 'empty' };
  }

  if (typeof obj.componentId === 'string' && typeof obj.path === 'string') {
    return { kind: 'template', componentId: obj.componentId, path: obj.path };
  }

  return { kind: 'empty' };
}

/** 静态子 ID 列表 → 子槽描述符（共用父级 dataContext.path） */
export function resolveStaticChildSlots(
  host: A2UICustomElementHost,
  ids: string[],
  defaultBasePath?: string,
): ChildSlotDescriptor[] {
  const basePath = getDefaultBasePath(host, defaultBasePath);
  return ids.map((childId) => ({ childId, basePath }));
}

/**
 * 动态 template 展开：与 web_core GenericBinder STRUCTURAL 分支一致。
 * 每项 basePath = dataContext.nested(listPath).nested(String(i)).path
 */
export function resolveTemplateChildSlots(
  host: A2UICustomElementHost,
  componentId: string,
  listPath: string,
  listValue?: unknown,
): ChildSlotDescriptor[] {
  const dc = getDataContext(host);
  const arr = Array.isArray(listValue) ? listValue : [];
  if (!dc || typeof dc.nested !== 'function') {
    const basePath = getDefaultBasePath(host);
    return arr.map(() => ({ childId: componentId, basePath }));
  }

  const listContext = dc.nested(listPath) as { nested?: (relativePath: string) => { path?: string } };
  if (!listContext || typeof listContext.nested !== 'function') {
    const basePath = getDefaultBasePath(host);
    return arr.map(() => ({ childId: componentId, basePath }));
  }

  return arr.map((_item, index) => {
    const itemContext = listContext.nested!(String(index));
    const basePath = itemContext?.path ?? getDefaultBasePath(host);
    return { childId: componentId, basePath };
  });
}

/** 根据归一化输入解析最终子槽列表（同步路径，不含 template 订阅） */
export function resolveChildSlotsFromInput(
  host: A2UICustomElementHost,
  input: NormalizedChildListInput,
  defaultBasePath?: string,
): ChildSlotDescriptor[] {
  switch (input.kind) {
    case 'static':
      return resolveStaticChildSlots(host, input.ids, defaultBasePath);
    case 'resolved':
      return input.slots;
    case 'template': {
      const dc = getDataContext(host);
      let listValue: unknown;
      if (dc && typeof dc.resolveDynamicValue === 'function') {
        try {
          listValue = dc.resolveDynamicValue({ path: input.path });
        } catch {
          listValue = [];
        }
      }
      return resolveTemplateChildSlots(host, input.componentId, input.path, listValue);
    }
    default:
      return [];
  }
}
