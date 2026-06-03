import type { A2UIActionDetail, A2UIDeclaredAction, A2UIV09ElementContext } from './types';

export type A2UICustomElementHost = HTMLElement & {
  componentProps?: Record<string, unknown>;
  context?: A2UIV09ElementContext;
};

/** 读取引擎归一化后的 props；优先 componentProps */
export function readComponentProps(host: A2UICustomElementHost): Record<string, unknown> {
  return host.componentProps ?? {};
}

export function readStringProp(props: Record<string, unknown>, key: string, fallback = ''): string {
  const v = props[key];
  if (v == null) return fallback;
  return String(v);
}

export function readNumberProp(props: Record<string, unknown>, key: string, fallback = 0): number {
  const v = props[key];
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** 从 DynamicString 绑定对象中取出 path，供 dataContext.set 使用 */
export function readBoundPath(raw: unknown): string | undefined {
  if (!raw || typeof raw !== 'object' || !('path' in raw)) return undefined;
  const p = (raw as { path?: unknown }).path;
  if (typeof p !== 'string' || !p.trim()) return undefined;
  return p.startsWith('/') ? p : `/${p}`;
}

export function resolveBoundValue(host: A2UICustomElementHost, raw: unknown): string {
  const dc = host.context?.dataContext;
  if (!dc || typeof dc.resolveDynamicValue !== 'function' || raw == null) return '';
  try {
    const resolved = dc.resolveDynamicValue(raw);
    if (resolved == null) return '';
    if (typeof resolved === 'object') return '';
    return String(resolved);
  } catch {
    return '';
  }
}

export function writeBoundValue(host: A2UICustomElementHost, raw: unknown, value: unknown): void {
  const path = readBoundPath(raw);
  const dc = host.context?.dataContext;
  if (!path || !dc || typeof dc.set !== 'function') return;
  try {
    dc.set(path, value);
  } catch {
    // 路径未就绪时忽略
  }
}

function normalizeDeclaredAction(raw: unknown): { name: string; context: Record<string, unknown> } | null {
  if (!raw || typeof raw !== 'object') return null;
  const a = raw as A2UIDeclaredAction;
  if (a.event && typeof a.event.name === 'string') {
    return {
      name: a.event.name,
      context:
        a.event.context != null && typeof a.event.context === 'object' && !Array.isArray(a.event.context)
          ? (a.event.context as Record<string, unknown>)
          : {},
    };
  }
  if (typeof a.name === 'string') {
    return {
      name: a.name,
      context:
        a.context != null && typeof a.context === 'object' && !Array.isArray(a.context)
          ? (a.context as Record<string, unknown>)
          : {},
    };
  }
  return null;
}

function resolveActionContextMap(
  dataContext: A2UIV09ElementContext['dataContext'],
  context: Record<string, unknown>,
): Record<string, unknown> {
  const resolveOne = (value: unknown): unknown => {
    if (typeof dataContext?.resolveDynamicValue === 'function') {
      try {
        const resolved = dataContext.resolveDynamicValue(value);
        if (resolved != null && typeof resolved === 'object' && 'value' in (resolved as object)) {
          return (resolved as { value: unknown }).value;
        }
        return resolved;
      } catch {
        return value;
      }
    }
    return value;
  };

  const out: Record<string, unknown> = {};
  Object.entries(context).forEach(([key, value]) => {
    out[key] = resolveOne(value);
  });
  return out;
}

/**
 * 按组件 props.action 分发点击事件（与官方 Button 的 action 语义一致）。
 * 优先走 v0.9 context.dispatchAction；否则回退 a2uiaction + mergeLitActionPayload。
 */
export function dispatchDeclaredAction(host: A2UICustomElementHost): void {
  const declared = normalizeDeclaredAction(readComponentProps(host).action);
  if (!declared) return;

  const ctx = host.context as A2UIV09ElementContext | undefined;
  const resolvedContext = resolveActionContextMap(ctx?.dataContext, declared.context);
  const envelope = { event: { name: declared.name, context: resolvedContext } };

  if (typeof ctx?.dispatchAction === 'function') {
    ctx.dispatchAction(envelope);
    return;
  }

  dispatchA2UIAction(host, {
    name: declared.name,
    context: resolvedContext,
  });
}

/** 向 Lit 宿主派发动作，统一进入 BaseRenderer onAction */
export function dispatchA2UIAction(
  host: A2UICustomElementHost,
  detail: A2UIActionDetail,
): void {
  host.dispatchEvent(
    new CustomEvent('a2uiaction', {
      detail: {
        name: detail.name,
        context: detail.context ?? {},
      },
      bubbles: true,
      composed: true,
    }),
  );
}
