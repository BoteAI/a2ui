/* eslint-disable camelcase */
import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { loadLitRuntime, normalizeProtocolVersion, type A2UIProtocolVersion, type A2UILitRuntime } from '../../compat/litRuntime';
import type { A2UIComponent, A2UICustomComponentRegistry, A2UIMessage } from './types';
import { useResponsive } from '../../utils/responsive';
import { componentsToProtocolMessages, normalizeSurfaceId, normalizeToLitProtocolMessages } from '../../utils/toProtocolMessages';
import { computeMessagesDigest, isMessagesAppendOnly } from '../../utils/messagesDigest';
import { mergeLitActionPayload } from '../../utils/litActionMapping';
import './index.less';
import type { A2UIThemePreset } from './a2uiThemePresets';
import { resolveA2UIThemePresetContainerClass, resolveA2UIThemePresetShadowCss } from './a2uiThemePresets';
import { mergeLitSurfaceStyleVars, applyCssVars, toCssVarStyle } from './litStyleVars';
import { syncAntdSheetToShadowTree } from './antdConstructableSheet';
import { syncEditorSelectionHighlight } from './editorSelectionHighlight';
import { syncThemePresetSheetToShadowTree } from './themePresetShadowSheet';
import { loadRemoteA2UICustomRegistry, loadRemoteA2UICustomRegistries } from '../../remote/loadRemoteA2UICustomRegistry';

/** @a2ui/lit Icon 使用 Material Symbols Outlined 字体显示 ligature 文本，未加载时只能看到空白或方框 */
function ensureMaterialSymbolsOutlinedFont(): void {
  if (typeof document === 'undefined') return;
  const id = 'a2ui-material-symbols-outlined-font';
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap';
  document.head.appendChild(link);
}

export type A2UIParseErrorInfo = {
  title?: string
  message: string
  detail?: string
  debugMessages?: unknown
};

export function formatA2UIParseError(err: unknown): A2UIParseErrorInfo {
  if (err instanceof Error) {
    return { message: err.message, detail: err.stack };
  }
  return { message: String(err) };
}

/** 解析或渲染失败时的可见提示，避免页面空白 */
export function A2UIParseErrorPanel(props: {
  title: string
  message: string
  detail?: string
  debugMessages?: unknown
}) {
  const { title, message, detail, debugMessages } = props;
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const debugMessagesText = useMemo(
    () => (debugMessages == null ? '' : safeStableStringify(debugMessages, 2)),
    [debugMessages],
  );

  const handleCopyDebugMessages = useCallback(async () => {
    if (!debugMessagesText) {
      return;
    }
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
        throw new Error('Clipboard API is unavailable');
      }
      await navigator.clipboard.writeText(debugMessagesText);
      setCopyStatus('success');
    } catch (e) {
      setCopyStatus('error');
    }
    window.setTimeout(() => setCopyStatus('idle'), 2000);
  }, [debugMessagesText]);

  let copyButtonLabel = '复制当前 messages';
  if (copyStatus === 'success') {
    copyButtonLabel = '已复制';
  } else if (copyStatus === 'error') {
    copyButtonLabel = '复制失败';
  }

  let detailSectionNode: React.ReactNode = null;
  if (detail) {
    detailSectionNode = (
      <details className="a2ui-parse-error__details">
        <summary className="a2ui-parse-error__summary">
          查看详情
          {debugMessagesText ? (
            <button
              type="button"
              className="a2ui-parse-error__copy-link"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCopyDebugMessages();
              }}
              title={copyButtonLabel}
              aria-label={copyButtonLabel}
              data-status={copyStatus}
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                aria-hidden="true"
                focusable="false"
                className="a2ui-parse-error__copy-icon"
              >
                <path
                  d="M16 1H6C4.9 1 4 1.9 4 3V17H6V3H16V1ZM19 5H10C8.9 5 8 5.9 8 7V21C8 22.1 8.9 23 10 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H10V7H19V21Z"
                  fill="currentColor"
                />
              </svg>
              <span className="a2ui-parse-error__copy-text">复制数据</span>
            </button>
          ) : null}
        </summary>
        <pre className="a2ui-parse-error__pre">{detail}</pre>
      </details>
    );
  } else if (debugMessagesText) {
    detailSectionNode = (
      <div className="a2ui-parse-error__details">
        <button
          type="button"
          className="a2ui-parse-error__copy-link"
          onClick={handleCopyDebugMessages}
          title={copyButtonLabel}
          aria-label={copyButtonLabel}
          data-status={copyStatus}
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            aria-hidden="true"
            focusable="false"
            className="a2ui-parse-error__copy-icon"
          >
            <path
              d="M16 1H6C4.9 1 4 1.9 4 3V17H6V3H16V1ZM19 5H10C8.9 5 8 5.9 8 7V21C8 22.1 8.9 23 10 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H10V7H19V21Z"
              fill="currentColor"
            />
          </svg>
          <span className="a2ui-parse-error__copy-text">复制数据</span>
        </button>
      </div>
    );
  }

  return (
    <div className="a2ui-parse-error" role="alert">
      <div className="a2ui-parse-error__title">{title}</div>
      <div className="a2ui-parse-error__message">{message}</div>
      {detailSectionNode}
    </div>
  );
}

const normalizedCustomElementCtorCache = new WeakMap<CustomElementConstructor, CustomElementConstructor>();

const LIT_SHADOW_TAG = {
  textfield: 'a2ui-textfield, a2ui-basic-textfield',
  multipleChoice: 'a2ui-multiplechoice, a2ui-choicepicker',
} as const;

class A2UIRenderErrorBoundary extends React.Component<
  React.PropsWithChildren<{ silentOnError?: boolean }>,
  { hasError: boolean; error: Error | null }
> {
  state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown) {
    const e = error instanceof Error ? error : new Error(String(error));
    return { hasError: true, error: e };
  }

  componentDidCatch(error: unknown) {
    if (this.props.silentOnError) {
      // eslint-disable-next-line no-console
      console.warn('[A2UI Lit 渲染跳过]', error);
      return;
    }
    // eslint-disable-next-line no-console
    console.error('[A2UI Lit 渲染失败]', error);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.silentOnError) {
        return null;
      }
      const e = this.state.error;
      return (
        <A2UIParseErrorPanel
          title="A2UI 渲染失败"
          message={e.message}
          detail={e.stack}
        />
      );
    }
    return this.props.children;
  }
}

export interface LitSurfaceHostProps {
  components?: A2UIComponent[]
  messages?: A2UIMessage[]
  dataModel?: Record<string, any>
  protocolVersion?: A2UIProtocolVersion
  rootId?: string
  surfaceId?: string
  className?: string

  /**
   * 内置主题预设，在 DEFAULT_A2UI_LIT_STYLE_VARS 之上合并预设 token，再与 styleVars 合并。
   * 可选：default | conversation | compact | dark
   */
  themePreset?: A2UIThemePreset

  /**
   * 追加到 themePreset 对应 shadowCss 之后的自定义 CSS，注入各 A2UI 组件 ShadowRoot。
   * 可与 themePreset 同时使用；优先级低于同选择器下组件 adopted 样式，高于仅变量覆盖。
   */
  themePresetCss?: string

  /**
   * 主题 CSS 变量，写入渲染根与 a2ui-surface 宿主，继承进 @a2ui/lit adopted stylesheet。
   * 未传的项使用 DEFAULT_A2UI_LIT_STYLE_VARS；key 可为 token 或 --token。
   */
  styleVars?: Record<string, string | number>
  onAction?: (action: { name: string; context: any }) => void

  /** 业务侧自定义 Lit 组件注册表，key 为协议组件名 */
  customComponents?: A2UICustomComponentRegistry

  /**
   * 远程 ESM 组件 URL 列表。传入后 BaseRenderer 内部自动加载并与 customComponents 合并。
   * 支持单个或多个 URL，内部使用 loadRemoteA2UICustomRegistry/loadRemoteA2UICustomRegistries。
   */
  remoteComponentUrls?: string[]

  /**
   * 为 true 时在 surface 各层 ShadowRoot 挂载共享 antd 样式表（Constructable Stylesheet，CSS 只解析一次）。
   * 远程自定义组件使用 antd 时建议开启，无需在组件 bundle 内重复打包 CSS。
   */
  injectAntdStylesInShadow?: boolean

  /**
   * 编辑器画布当前选中的 A2UI 组件 id；传入后为对应 Lit 宿主添加选中描边样式。
   * 传 undefined 表示不启用；传 null 表示清除高亮。
   */
  selectedComponentId?: string | null

  /**
   * 为 true 时解析或渲染失败不展示错误面板，仅空白占位（适用于 Gallery 多卡片预览）。
   */
  silentOnError?: boolean
}

/**
 * 合并多个注册表，后面的覆盖前面的
 */
function mergeRegistryEntries(
  ...entries: (A2UICustomComponentRegistry | undefined | null)[]
): A2UICustomComponentRegistry {
  const out: A2UICustomComponentRegistry = {};
  for (const entry of entries) {
    if (entry && typeof entry === 'object') {
      Object.assign(out, entry);
    }
  }
  return out;
}

/**
 * 使用官方 @a2ui/lit 在容器内挂载 a2ui-surface，与全局 antd 主题独立，后续可做 CSS 变量桥接
 */
const LitSurfaceHost: React.FC<LitSurfaceHostProps> = ({
  components = [],
  messages,
  dataModel,
  protocolVersion = '0.9',
  rootId,
  surfaceId: surfaceIdProp,
  className,
  themePreset,
  themePresetCss,
  styleVars,
  onAction,
  customComponents,
  remoteComponentUrls,
  injectAntdStylesInShadow = false,
  selectedComponentId,
  silentOnError = false,
}) => {
  const silentOnErrorRef = useRef(silentOnError);
  silentOnErrorRef.current = silentOnError;
  const mergedStyleVars = useMemo(
    () => mergeLitSurfaceStyleVars(styleVars, protocolVersion, themePreset),
    [styleVars, protocolVersion, themePreset],
  );
  const mergedThemePresetCss = useMemo(
    () => resolveA2UIThemePresetShadowCss(themePreset, themePresetCss),
    [themePreset, themePresetCss],
  );
  const themePresetContainerClass = useMemo(
    () => resolveA2UIThemePresetContainerClass(themePreset),
    [themePreset],
  );
  const mergedThemePresetCssRef = useRef(mergedThemePresetCss);
  mergedThemePresetCssRef.current = mergedThemePresetCss;
  const [litRuntime, setLitRuntime] = useState<A2UILitRuntime | null>(null);
  const [litRuntimeError, setLitRuntimeError] = useState<string | null>(null);
  const responsive = useResponsive();
  const hostRef = useRef<HTMLDivElement>(null);
  const processorRef = useRef<any>(null);
  const lastFailedInputKeyRef = useRef<string | null>(null);
  const builtMessagesRef = useRef<unknown[] | null>(null);
  const lastProcessedCountRef = useRef(0);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const selectedComponentIdRef = useRef(selectedComponentId);
  selectedComponentIdRef.current = selectedComponentId;
  const [litParseError, setLitParseError] = useState<A2UIParseErrorInfo | null>(null);

  // 远程组件加载状态
  const [remoteRegistry, setRemoteRegistry] = useState<A2UICustomComponentRegistry | null>(null);
  const [remoteRegistryLoading, setRemoteRegistryLoading] = useState(false);
  const [remoteRegistryError, setRemoteRegistryError] = useState<string | null>(null);

  const pendingRemoteUrls = useMemo(
    () => (remoteComponentUrls ?? []).map((url) => url.trim()).filter(Boolean),
    [remoteComponentUrls],
  );

  // 加载远程组件
  useEffect(() => {
    if (pendingRemoteUrls.length === 0) {
      setRemoteRegistry(null);
      setRemoteRegistryLoading(false);
      setRemoteRegistryError(null);
      return undefined;
    }

    let cancelled = false;
    setRemoteRegistry(null);
    setRemoteRegistryLoading(true);
    setRemoteRegistryError(null);

    const load = pendingRemoteUrls.length > 1
      ? () => loadRemoteA2UICustomRegistries(pendingRemoteUrls)
      : () => loadRemoteA2UICustomRegistry(pendingRemoteUrls[0]);

    load()
      .then((registry) => {
        if (cancelled) return;
        const keys = Object.keys(registry);
        setRemoteRegistry(registry);
        setRemoteRegistryLoading(false);
        if (keys.length === 0) {
          const msg = '远程模块加载成功，但未包含任何有效的 A2UI 自定义组件注册项。';
          setRemoteRegistryError(msg);
          // eslint-disable-next-line no-console
          console.warn('[A2UI Lit] remote custom registry is empty', pendingRemoteUrls);
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : String(e);
        setRemoteRegistry(null);
        setRemoteRegistryLoading(false);
        setRemoteRegistryError(msg);
        // eslint-disable-next-line no-console
        console.error('[A2UI Lit] failed to load remote custom registry', {
          urls: pendingRemoteUrls,
          error: e,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [pendingRemoteUrls]);

  // 合并静态和远程组件注册表
  const mergedCustomComponents = useMemo(
    () => mergeRegistryEntries(customComponents, remoteRegistry),
    [customComponents, remoteRegistry],
  );

  const rootComponentId = rootId || (components.find((c) => c.id === 'root')?.id) || components[0]?.id;
  const surfaceId = normalizeSurfaceId(surfaceIdProp || inferSurfaceId(messages));

  const onActionRef = useRef(onAction);
  onActionRef.current = onAction;

  useEffect(() => {
    let cancelled = false;
    setLitRuntimeError(null);
    loadLitRuntime(protocolVersion)
      .then((runtime) => {
        if (cancelled) return;
        setLitRuntime(runtime);
      })
      .catch((err) => {
        if (cancelled) return;
        setLitRuntime(null);
        setLitRuntimeError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, [protocolVersion]);

  const componentsDigest = useMemo(() => {
    if (!Array.isArray(components) || components.length === 0) return 'c:0';
    const ids = components.map((c) => c?.id).filter(Boolean).join(',');
    return `c:${components.length}:${ids.length}:${ids.slice(0, 64)}`;
  }, [components]);

  const dataModelDigest = useMemo(() => {
    if (!dataModel || typeof dataModel !== 'object') return 'd:0';
    const keys = Object.keys(dataModel);
    return `d:${keys.length}:${keys.sort().join(',').slice(0, 128)}`;
  }, [dataModel]);

  const messagesDigest = useMemo(
    () => computeMessagesDigest(messages),
    [messages],
  );

  const renderInputKey = [
    messagesDigest,
    componentsDigest,
    dataModelDigest,
    String(rootComponentId || ''),
    String(surfaceIdProp || ''),
    String(surfaceId || ''),
    String(protocolVersion || '0.8'),
    (mergedCustomComponents ? Object.keys(mergedCustomComponents).sort() : []).join(','),
    String(injectAntdStylesInShadow),
  ].join('|');

  /** @a2ui/lit Icon 在 Shadow 内使用 font-family: Material Symbols Outlined + 文本 ligature，需加载对应字体才能显示图标 */
  useEffect(() => {
    ensureMaterialSymbolsOutlinedFont();
  }, []);

  const handleA2UIAction = useCallback((ev: Event) => {
    const e = ev as CustomEvent;
    const detail = e.detail ?? {};
    const proc = processorRef.current;
    const surface = proc?.getSurfaces()?.get(surfaceId);
    const dm = surface?.dataModel;
    const getByPath = (
      typeof (proc as { getDataByPath?: unknown })?.getDataByPath === 'function' && dm
    )
      ? (path: string) => (proc as { getDataByPath: (root: unknown, path: string) => unknown }).getDataByPath(dm, path)
      : undefined;
    const payload = mergeLitActionPayload(detail, dm, getByPath);
    onActionRef.current?.(payload);
  }, [surfaceId]);

  useEffect(() => {
    if (lastFailedInputKeyRef.current === renderInputKey) {
      return undefined;
    }

    const host = hostRef.current;
    if (!host || !litRuntime) {
      return undefined;
    }

    // 有远程 URL 时须等 import 完成后再渲染，避免 custom catalog 尚未注册就报 Component implementation not found
    if (pendingRemoteUrls.length > 0 && remoteRegistryLoading) {
      return undefined;
    }

    setLitParseError(null);

    let cancelled = false;
    let renderMessages: A2UIMessage[] = [];
    if (Array.isArray(messages) && messages.length > 0) {
      try {
        renderMessages = normalizeToLitProtocolMessages(
          messages,
          normalizeProtocolVersion(protocolVersion),
        ) as A2UIMessage[];
      } catch (err) {
        lastFailedInputKeyRef.current = renderInputKey;
        const f = formatA2UIParseError(err);
        setLitParseError({
          title: 'A2UI 消息协议不匹配',
          message: f.message,
          detail: f.detail,
          debugMessages: messages,
        });
        processorRef.current = null;
        return undefined;
      }
    } else if (rootComponentId) {
      renderMessages = componentsToProtocolMessages(
        components,
        rootComponentId,
        surfaceIdProp ?? '',
        dataModel,
      ) as A2UIMessage[];
      renderMessages = normalizeToLitProtocolMessages(renderMessages, '0.8') as A2UIMessage[];
    }
    if (renderMessages.length === 0) {
      lastFailedInputKeyRef.current = renderInputKey;
      setLitParseError({
        title: 'A2UI 解析失败',
        message: '没有可渲染的消息：请检查 messages 或 components 是否为空。',
        debugMessages: {
          messages,
          components,
          dataModel,
          rootComponentId,
          surfaceId: surfaceIdProp,
        },
      });
      return undefined;
    }

    let sanitized: A2UIMessage[];
    try {
      sanitized = sanitizeMessagesForLit(renderMessages);
    } catch (err) {
      lastFailedInputKeyRef.current = renderInputKey;
      const f = formatA2UIParseError(err);
      setLitParseError({
        title: 'A2UI 解析失败',
        message: f.message,
        detail: f.detail,
        debugMessages: renderMessages,
      });
      processorRef.current = null;
      return undefined;
    }

    const rawMessagesSnapshot = Array.isArray(messages) && messages.length > 0 ? messages : null;
    const existingSurfaceEl = host.querySelector('a2ui-surface') as HTMLElement | null;
    const tryIncremental =
      rawMessagesSnapshot != null
      && isMessagesAppendOnly(builtMessagesRef.current, rawMessagesSnapshot)
      && processorRef.current != null
      && existingSurfaceEl != null
      && lastProcessedCountRef.current > 0
      && lastProcessedCountRef.current < sanitized.length;

    if (tryIncremental) {
      try {
        registerA2UICustomComponents(mergedCustomComponents, litRuntime.componentRegistry);
        const processor = processorRef.current;
        const delta = sanitized.slice(lastProcessedCountRef.current);
        processor.processMessages(delta as Parameters<typeof processor.processMessages>[0]);
        if (cancelled) {
          return undefined;
        }
        const surface = processor.getSurfaces().get(surfaceId);
        if (surface) {
          (existingSurfaceEl as any).surface = surface;
          if (protocolVersion !== '0.9') {
            (existingSurfaceEl as any).processor = processor;
          }
          applyCssVars(existingSurfaceEl, mergedStyleVars);
          applySurfaceRuntimeExtras(
            existingSurfaceEl,
            injectAntdStylesInShadow,
            mergedThemePresetCssRef.current,
          );
          if (selectedComponentIdRef.current !== undefined) {
            syncEditorSelectionHighlight(existingSurfaceEl, selectedComponentIdRef.current);
          }
          builtMessagesRef.current = rawMessagesSnapshot;
          lastProcessedCountRef.current = sanitized.length;
          lastFailedInputKeyRef.current = null;
          return () => {
            cancelled = true;
            const next = messagesRef.current;
            const keepAlive =
              Array.isArray(next)
              && isMessagesAppendOnly(builtMessagesRef.current, next)
              && processorRef.current
              && hostRef.current?.querySelector('a2ui-surface');
            if (!keepAlive) {
              processorRef.current?.clearSurfaces();
              processorRef.current = null;
              builtMessagesRef.current = null;
              lastProcessedCountRef.current = 0;
            }
          };
        }
      } catch (incrErr) {
        // eslint-disable-next-line no-console
        console.warn('[A2UI Lit] incremental processMessages failed, full rebuild', incrErr);
      }
    }

    try {
      registerA2UICustomComponents(mergedCustomComponents, litRuntime.componentRegistry);
      const processor = litRuntime.createSignalA2uiMessageProcessor();
      processorRef.current = processor;
      processor.processMessages(sanitized as Parameters<typeof processor.processMessages>[0]);
      if (cancelled) {
        return undefined;
      }

      const surface = processor.getSurfaces().get(surfaceId);
      if (!surface) {
        // eslint-disable-next-line no-console
        console.warn('[A2UI Lit] surface not found after processMessages', surfaceId);
        lastFailedInputKeyRef.current = renderInputKey;
        builtMessagesRef.current = null;
        lastProcessedCountRef.current = 0;
        if (!silentOnErrorRef.current) {
          setLitParseError({
            title: 'A2UI 解析失败',
            message: `处理消息后未找到 surface「${surfaceId}」。请确认各条消息中的 surfaceId 一致（0.8：beginRendering、surfaceUpdate、dataModelUpdate；0.9：createSurface、updateComponents、updateDataModel）。`,
            debugMessages: sanitized,
          });
        } else {
          setLitParseError(null);
        }
        processorRef.current = null;
        return undefined;
      }

      host.innerHTML = '';
      const el = document.createElement('a2ui-surface');
      host.appendChild(el);
      if (protocolVersion === '0.9') {
        (el as any).surface = surface;
      } else {
        (el as any).surfaceId = surfaceId;
        (el as any).processor = processor;
        (el as any).surface = surface;
      }
      // 仅在传入 customComponents 或远程组件加载完成时开启自定义元素渲染分支
      (el as any).enableCustomElements = Boolean(
        mergedCustomComponents && Object.keys(mergedCustomComponents).length > 0,
      );
      applyCssVars(el, mergedStyleVars);
      let removeActionSub: (() => void) | null = null;
      // v0.9：动作由 SurfaceModel.dispatchAction 发到 surface.onAction；直接订阅当前 surface，避免仅依赖 processor 适配层时漏订
      const surfaceOnAction = (surface as { onAction?: { subscribe: (fn: (p: unknown) => void) => { unsubscribe: () => void } } })
        .onAction;
      if (protocolVersion === '0.9' && surfaceOnAction && typeof surfaceOnAction.subscribe === 'function') {
        removeActionSub = surfaceOnAction.subscribe((payload: unknown) => {
          const p = payload as { name?: string; context?: Record<string, unknown> };
          onActionRef.current?.({
            name: p?.name || 'action',
            context: p?.context || {},
          });
        }).unsubscribe;
      }
      el.addEventListener('a2uiaction', handleA2UIAction);
      applySurfaceRuntimeExtras(
        el,
        injectAntdStylesInShadow,
        mergedThemePresetCssRef.current,
      );
      if (selectedComponentIdRef.current !== undefined) {
        syncEditorSelectionHighlight(el, selectedComponentIdRef.current);
      }
      const removeMcDismiss = attachMultipleChoiceDropdownDismiss(el);
      builtMessagesRef.current = rawMessagesSnapshot;
      lastProcessedCountRef.current = sanitized.length;
      lastFailedInputKeyRef.current = null;

      return () => {
        cancelled = true;
        const next = messagesRef.current;
        const keepAlive =
          Array.isArray(next)
          && isMessagesAppendOnly(builtMessagesRef.current, next)
          && processorRef.current
          && hostRef.current?.querySelector('a2ui-surface');
        if (!keepAlive) {
          removeMcDismiss();
          removeActionSub?.();
          el.removeEventListener('a2uiaction', handleA2UIAction);
          syncAntdSheetToShadowTree(el, false);
          processor.clearSurfaces();
          processorRef.current = null;
          builtMessagesRef.current = null;
          lastProcessedCountRef.current = 0;
          host.innerHTML = '';
        }
      };
    } catch (err) {
      lastFailedInputKeyRef.current = renderInputKey;
      if (silentOnErrorRef.current) {
        // eslint-disable-next-line no-console
        console.warn('[A2UI Lit] processMessages skipped', err);
        setLitParseError(null);
      } else {
        // eslint-disable-next-line no-console
        console.error('[A2UI Lit] processMessages failed', err);
        const f = formatA2UIParseError(err);
        setLitParseError({
          title: 'A2UI 解析失败',
          message: f.message,
          detail: f.detail,
          debugMessages: sanitized,
        });
      }
      processorRef.current = null;
      builtMessagesRef.current = null;
      lastProcessedCountRef.current = 0;
      return undefined;
    }
    // 仅依赖 renderInputKey，勿再依赖 messages、components、dataModel 的引用。
    // 否则父组件每次重渲染传入新数组引用时，会重复 processMessages，覆盖用户在表单里已编辑的数据模型。
  }, [
    renderInputKey,
    litRuntime,
    protocolVersion,
    handleA2UIAction,
    mergedCustomComponents,
    injectAntdStylesInShadow,
    pendingRemoteUrls,
    remoteRegistryLoading,
  ]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const surfaceEl = host.querySelector('a2ui-surface') as HTMLElement | null;
    if (!surfaceEl) return;
    applyCssVars(surfaceEl, mergedStyleVars);
    syncThemePresetSheetToShadowTree(surfaceEl, mergedThemePresetCss);
    syncAntdSheetToShadowTree(surfaceEl, injectAntdStylesInShadow);
    return () => {
      syncAntdSheetToShadowTree(surfaceEl, false);
    };
  }, [mergedStyleVars, mergedThemePresetCss, injectAntdStylesInShadow, renderInputKey]);

  useEffect(() => {
    if (selectedComponentId === undefined) return;
    const host = hostRef.current;
    if (!host) return;
    const surfaceEl = host.querySelector('a2ui-surface') as HTMLElement | null;
    if (!surfaceEl) return;
    syncEditorSelectionHighlight(surfaceEl, selectedComponentId);
  }, [selectedComponentId, messagesDigest, renderInputKey]);

  const containerClassName = [
    'a2ui-renderer-container',
    'a2ui-renderer-container--lit',
    responsive.isMobile ? 'a2ui-renderer-container--mobile' : '',
    !responsive.isMobile && responsive.isTablet ? 'a2ui-renderer-container--tablet' : '',
    themePresetContainerClass || '',
    className || '',
  ].filter(Boolean).join(' ');

  if ((!messages || messages.length === 0) && (!Array.isArray(components) || components.length === 0 || !rootComponentId)) {
    if (silentOnError) {
      return <div className={containerClassName} style={toCssVarStyle(mergedStyleVars)} />;
    }
    return (
      <div className={containerClassName} style={toCssVarStyle(mergedStyleVars)}>
        <A2UIParseErrorPanel
          title="A2UI 数据无效"
          message="缺少 messages 或 components，或无法推断 root 组件 id。"
        />
      </div>
    );
  }

  if (litRuntimeError) {
    if (silentOnError) {
      return <div className={containerClassName} style={toCssVarStyle(mergedStyleVars)} />;
    }
    return (
      <div className={containerClassName} style={toCssVarStyle(mergedStyleVars)}>
        <A2UIParseErrorPanel
          title="A2UI 运行时加载失败"
          message={litRuntimeError}
        />
      </div>
    );
  }

  if (remoteRegistryError) {
    if (silentOnError) {
      return <div className={containerClassName} style={toCssVarStyle(mergedStyleVars)} />;
    }
    return (
      <div className={containerClassName} style={toCssVarStyle(mergedStyleVars)}>
        <A2UIParseErrorPanel
          title="A2UI 远程组件加载失败"
          message={remoteRegistryError}
          detail={pendingRemoteUrls.join('\n')}
        />
      </div>
    );
  }

  return (
    <div className={containerClassName} style={toCssVarStyle(mergedStyleVars)}>
      <A2UIRenderErrorBoundary silentOnError={silentOnError}>
        {litParseError && !silentOnError ? (
          <A2UIParseErrorPanel
            title={litParseError.title || 'A2UI 解析失败'}
            message={litParseError.message}
            detail={litParseError.detail}
            debugMessages={litParseError.debugMessages}
          />
        ) : null}
        <div
          ref={hostRef}
          className="a2ui-lit-host"
          style={{ display: litParseError ? 'none' : undefined }}
          aria-hidden={litParseError ? true : undefined}
        />
      </A2UIRenderErrorBoundary>
    </div>
  );
};

export default LitSurfaceHost;

function registerA2UICustomComponents(
  customComponents: A2UICustomComponentRegistry | undefined,
  componentRegistry: unknown,
) {
  const registry = componentRegistry as {
    clearPendingV09CustomApis?: () => void
    register?: (
      typeName: string,
      constructor: CustomElementConstructor,
      tagName?: string,
      schema?: unknown
    ) => unknown
  };
  if (typeof registry.clearPendingV09CustomApis === 'function') {
    registry.clearPendingV09CustomApis();
  }

  if (!customComponents) return;

  const register = typeof registry?.register === 'function'
    ? registry.register.bind(registry)
    : undefined;
  if (!register) {
    throw new Error('当前 @a2ui/lit 版本不支持 customComponents 注册。');
  }

  Object.entries(customComponents).forEach(([typeName, definition]) => {
    if (!typeName) return;
    let elementCtor: CustomElementConstructor | undefined;
    let tagName: string | undefined;
    let schema: unknown;
    if (typeof definition === 'function') {
      elementCtor = definition;
    } else if (definition && typeof definition === 'object') {
      const {
        elementCtor: entryCtor,
        tagName: entryTagName,
        schema: entrySchema,
      } = definition;
      elementCtor = entryCtor;
      tagName = entryTagName;
      schema = entrySchema;
    }

    if (typeof elementCtor !== 'function') {
      throw new Error(`customComponents.${typeName} 缺少有效的 elementCtor。`);
    }
    register(typeName, getNormalizedCustomElementCtor(elementCtor), tagName, schema);
  });
}

/** 在引擎层统一做 custom component 参数归一化，避免业务组件各自重复转换 */
function getNormalizedCustomElementCtor(ctor: CustomElementConstructor): CustomElementConstructor {
  const cached = normalizedCustomElementCtorCache.get(ctor);
  if (cached) {
    return cached;
  }

  class NormalizedCustomElement extends (ctor as any) {
    private __a2uiPropsUnsub?: { unsubscribe: () => void };

    set context(value: unknown) {
      (this as any).__a2uiContextValue = value;
      normalizeCustomElementProps(this as Record<string, any>);
      if ((this as unknown as HTMLElement).isConnected) {
        this.attachV09PropsSubscription();
      }
    }

    get context() {
      return (this as any).__a2uiContextValue;
    }

    private attachV09PropsSubscription() {
      this.__a2uiPropsUnsub?.unsubscribe();
      this.__a2uiPropsUnsub = undefined;
      const m = (this as any).context?.componentModel;
      if (m?.onUpdated?.subscribe) {
        this.__a2uiPropsUnsub = m.onUpdated.subscribe(() => {
          normalizeCustomElementProps(this as Record<string, any>);
        });
      }
    }

    connectedCallback() {
      normalizeCustomElementProps(this as Record<string, any>);
      if (typeof super.connectedCallback === 'function') {
        super.connectedCallback();
      }
      this.attachV09PropsSubscription();
    }

    disconnectedCallback() {
      this.__a2uiPropsUnsub?.unsubscribe();
      this.__a2uiPropsUnsub = undefined;
      if (typeof super.disconnectedCallback === 'function') {
        super.disconnectedCallback();
      }
    }
  }

  normalizedCustomElementCtorCache.set(ctor, NormalizedCustomElement as unknown as CustomElementConstructor);
  return NormalizedCustomElement as unknown as CustomElementConstructor;
}

function normalizeCustomElementProps(instance: Record<string, any>) {
  const rawProps = getRawCustomElementProps(instance);
  const normalizedProps: Record<string, any> = {};
  Object.entries(rawProps).forEach(([key, value]) => {
    normalizedProps[key] = normalizeA2UIValueForCustomElement(value);
  });

  // 提供统一归一化后的参数访问入口，规避 title 等保留属性名冲突
  instance.componentProps = normalizedProps;

  Object.entries(normalizedProps).forEach(([key, value]) => {
    if (typeof value === 'function') return;
    if (!shouldAssignDirectlyToElement(instance, key, value)) return;
    try {
      instance[key] = value;
    } catch (e) {
      // 忽略只读属性，业务可通过 componentProps 读取
    }
  });
}

function getRawCustomElementProps(instance: Record<string, any>): Record<string, any> {
  const raw = instance?.component?.properties;
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as Record<string, any>;
  }
  const v09 = instance?.context?.componentModel?.properties;
  if (v09 && typeof v09 === 'object' && !Array.isArray(v09)) {
    return v09 as Record<string, any>;
  }
  return {};
}

function shouldAssignDirectlyToElement(instance: Record<string, any>, key: string, value: any): boolean {
  if (typeof value !== 'object' || value == null) return true;
  if (Object.prototype.hasOwnProperty.call(instance, key)) return true;
  return !(key in HTMLElement.prototype);
}

function normalizeA2UIValueForCustomElement(value: any): any {
  if (value == null) return value;
  if (Array.isArray(value)) {
    return value.map((item) => normalizeA2UIValueForCustomElement(item));
  }
  if (typeof value !== 'object') {
    return value;
  }

  const keys = Object.keys(value);
  if (keys.length === 1) {
    if (Object.prototype.hasOwnProperty.call(value, 'literalString')) {
      return normalizeA2UIValueForCustomElement(value.literalString);
    }
    if (Object.prototype.hasOwnProperty.call(value, 'valueString')) {
      return normalizeA2UIValueForCustomElement(value.valueString);
    }
    if (Object.prototype.hasOwnProperty.call(value, 'valueNumber')) {
      return normalizeA2UIValueForCustomElement(value.valueNumber);
    }
    if (Object.prototype.hasOwnProperty.call(value, 'valueBoolean')) {
      return normalizeA2UIValueForCustomElement(value.valueBoolean);
    }
  }

  const out: Record<string, any> = {};
  keys.forEach((k) => {
    out[k] = normalizeA2UIValueForCustomElement(value[k]);
  });
  return out;
}

function inferSurfaceId(messages?: A2UIMessage[]): string | undefined {
  if (!Array.isArray(messages)) return undefined;
  for (const msg of messages) {
    const m = msg as Record<string, any>;
    if (m?.surfaceUpdate?.surfaceId) return m.surfaceUpdate.surfaceId;
    if (m?.beginRendering?.surfaceId) return m.beginRendering.surfaceId;
    if (m?.dataModelUpdate?.surfaceId) return m.dataModelUpdate.surfaceId;
    if (m?.deleteSurface?.surfaceId) return m.deleteSurface.surfaceId;
    if (m?.createSurface?.surfaceId) return m.createSurface.surfaceId;
    if (m?.updateComponents?.surfaceId) return m.updateComponents.surfaceId;
    if (m?.updateDataModel?.surfaceId) return m.updateDataModel.surfaceId;
  }
  return undefined;
}

function safeStableStringify(input: unknown, space?: number): string {
  try {
    return JSON.stringify(input, null, space);
  } catch (err) {
    return String(input);
  }
}

function sanitizeMessagesForLit(messages: A2UIMessage[]): A2UIMessage[] {
  return messages.map((msg) => deepSanitize(msg) as A2UIMessage);
}

function deepSanitize(value: any): any {
  if (value == null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => deepSanitize(item))
      .filter((item) => item !== undefined);
  }
  if (typeof value === 'object') {
    const out: Record<string, any> = {};
    Object.entries(value).forEach(([k, v]) => {
      const sv = deepSanitize(v);
      if (sv !== undefined) {
        out[k] = sv;
      }
    });
    return out;
  }
  return value;
}

/** @a2ui/lit MultipleChoice 下拉模式仅点击头切换 isOpen，无失焦与点击外部关闭；在此补齐 */
type A2uiMultipleChoiceElement = HTMLElement & { isOpen?: boolean };

function collectA2uiMultipleChoiceHosts(surfaceEl: HTMLElement): HTMLElement[] {
  const out: HTMLElement[] = [];
  const visit = (root: ParentNode | null) => {
    if (!root) return;
    root.querySelectorAll(LIT_SHADOW_TAG.multipleChoice).forEach((n) => out.push(n as HTMLElement));
    root.querySelectorAll('*').forEach((el) => {
      if (el instanceof Element && el.shadowRoot) visit(el.shadowRoot);
    });
  };
  visit(surfaceEl.shadowRoot ?? surfaceEl);
  return out;
}

function isPointerInsideHost(host: HTMLElement, e: PointerEvent): boolean {
  if (typeof e.composedPath === 'function') {
    const path = e.composedPath();
    if (path.includes(host)) return true;
    if (host.shadowRoot && path.includes(host.shadowRoot)) return true;
  }
  const t = e.target;
  if (!(t instanceof Node)) return false;
  if (host.contains(t)) return true;
  const sr = host.shadowRoot;
  return Boolean(sr && sr.contains(t));
}

function attachMultipleChoiceDropdownDismiss(surfaceEl: HTMLElement): () => void {
  let mcHostsCache: HTMLElement[] | null = null;
  const getMcHosts = () => {
    if (!mcHostsCache) {
      mcHostsCache = collectA2uiMultipleChoiceHosts(surfaceEl);
    }
    return mcHostsCache;
  };
  const invalidateMcHostsCache = () => {
    mcHostsCache = null;
  };

  const onDocPointerDown = (e: PointerEvent) => {
    const hosts = getMcHosts();
    let anyOpen = false;
    hosts.forEach((node) => {
      const mc = node as A2uiMultipleChoiceElement;
      if (!mc.isOpen) return;
      anyOpen = true;
      if (!isPointerInsideHost(node, e)) {
        mc.isOpen = false;
      }
    });
    if (anyOpen) {
      invalidateMcHostsCache();
    }
  };
  const onDocKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    getMcHosts().forEach((node) => {
      const mc = node as A2uiMultipleChoiceElement;
      if (mc.isOpen) {
        mc.isOpen = false;
      }
    });
    invalidateMcHostsCache();
  };
  document.addEventListener('pointerdown', onDocPointerDown, true);
  document.addEventListener('keydown', onDocKeyDown, true);
  return () => {
    document.removeEventListener('pointerdown', onDocPointerDown, true);
    document.removeEventListener('keydown', onDocKeyDown, true);
  };
}

/** Lit a2ui-textfield 内单行 input 在 Win 等环境按 Enter 会冒泡到 document，触发页面级快捷键或隐式提交，表现为值被还原 */
const a2uiTextfieldEnterGuardInputs = new WeakSet<Element>();

function onA2uiTextfieldEnterKeydown(e: KeyboardEvent) {
  if (e.key !== 'Enter') return;
  const t = e.target;
  if (!(t instanceof HTMLInputElement)) return;
  e.preventDefault();
  e.stopPropagation();
}

function attachA2uiTextfieldEnterGuardsInTree(surfaceEl: HTMLElement) {
  const visit = (parent: ParentNode) => {
    parent.querySelectorAll(LIT_SHADOW_TAG.textfield).forEach((node) => {
      const sr = (node as HTMLElement).shadowRoot;
      if (!sr) return;
      sr.querySelectorAll('input').forEach((input) => {
        if (a2uiTextfieldEnterGuardInputs.has(input)) return;
        a2uiTextfieldEnterGuardInputs.add(input);
        input.addEventListener('keydown', onA2uiTextfieldEnterKeydown);
      });
    });
    parent.querySelectorAll('*').forEach((el) => {
      if (el instanceof Element && el.shadowRoot) visit(el.shadowRoot);
    });
  };
  const sr = surfaceEl.shadowRoot;
  if (sr) visit(sr);
}

function applySurfaceRuntimeExtras(
  surfaceEl: HTMLElement,
  injectAntdStyles: boolean,
  themePresetCss: string,
) {
  syncThemePresetSheetToShadowTree(surfaceEl, themePresetCss);
  syncAntdSheetToShadowTree(surfaceEl, injectAntdStyles);
  attachA2uiTextfieldEnterGuardsInTree(surfaceEl);
}
