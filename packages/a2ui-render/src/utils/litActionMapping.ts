/* eslint-disable no-continue */
/**
 * 将 Lit 侧 a2uiaction 的 detail 与 surface dataModel 合并为与旧版 BaseRenderer 接近的 onAction 载荷
 */
function mapEntriesToPlain(entries: Iterable<[unknown, unknown]>): unknown {
  const list = Array.from(entries, ([key, value]) => [String(key), toPlainValue(value)] as const);
  const isNumericKeys = list.every(([key]) => /^\d+$/.test(key));
  if (isNumericKeys) {
    return list
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([, value]) => value);
  }
  const o: Record<string, unknown> = {};
  for (const [key, value] of list) {
    o[key] = value;
  }
  return o;
}

function toPlainValue(value: unknown): unknown {
  if (value == null) {
    return value;
  }
  if (value instanceof Map) {
    return mapEntriesToPlain(value.entries());
  }
  if (Array.isArray(value)) {
    return value.map((item) => toPlainValue(item));
  }
  if (typeof value === 'object') {
    // SignalMap 的底层数据在 vals: Map 中，优先转换该字段，避免暴露 collection/storages 内部结构
    const maybeVals = (value as { vals?: unknown }).vals;
    if (maybeVals instanceof Map) {
      return mapEntriesToPlain(maybeVals.entries());
    }
    const o: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      o[k] = toPlainValue(v);
    }
    return o;
  }
  return value;
}

export function dataModelMapToPlain(value: unknown): Record<string, unknown> {
  const plain = toPlainValue(value);
  if (plain && typeof plain === 'object' && !Array.isArray(plain)) {
    return plain as Record<string, unknown>;
  }
  return {};
}

function resolvePathValue(
  value: unknown,
  surfaceDataModel: unknown,
  getByPath?: (path: string) => unknown,
): unknown {
  if (value == null || typeof value !== 'object') {
    return value;
  }
  const maybePath = (value as { path?: unknown }).path;
  if (typeof maybePath !== 'string') {
    return value;
  }
  const normalizedPath = `/${maybePath}`.replace(/\/+/g, '/');
  const pathSegments = normalizedPath.split('/').filter(Boolean);
  const readByPath = () => {
    let current = surfaceDataModel;
    for (const segment of pathSegments) {
      if (current == null) {
        return undefined;
      }
      if (typeof (current as { get?: unknown }).get === 'function') {
        current = (current as { get: (key: string) => unknown }).get(segment);
        continue;
      }
      if (Array.isArray(current) && /^\d+$/.test(segment)) {
        current = current[Number(segment)];
        continue;
      }
      if (typeof current === 'object') {
        current = (current as Record<string, unknown>)[segment];
        continue;
      }
      return undefined;
    }
    return current;
  };
  const resolved = getByPath?.(maybePath) ?? readByPath();
  return resolved === undefined ? value : toPlainValue(resolved);
}

export function mergeLitActionPayload(
  detail: {
    action?: { name?: string; context?: unknown };
    name?: unknown;
    context?: unknown;
    [key: string]: unknown;
  },
  surfaceDataModel: unknown,
  getByPath?: (path: string) => unknown,
): { name: string; context: Record<string, unknown> } {
  const action = detail?.action;
  const nameFromWrapped = typeof action?.name === 'string' ? action.name : undefined;
  const nameFromFlat = typeof detail?.name === 'string' ? detail.name : undefined;
  const name = nameFromWrapped || nameFromFlat || 'action';

  // 自定义原生组件 README 约定：detail 为 { name, context }，无 v0.9 官方的 detail.action 包裹
  const flatCtx = detail?.context;
  if (
    !action
    && flatCtx != null
    && typeof flatCtx === 'object'
    && !Array.isArray(flatCtx)
  ) {
    return {
      name,
      context: dataModelMapToPlain(flatCtx) as Record<string, unknown>,
    };
  }

  const contextFromAction: Record<string, unknown> = {};
  const ctx = action?.context;
  if (Array.isArray(ctx)) {
    for (const row of ctx) {
      if (row && typeof row === 'object' && 'key' in row) {
        const { key } = row as { key: string };
        const vk = Object.keys(row as object).find((k) => k.startsWith('value') && k !== 'valueMap');
        if (vk) {
          contextFromAction[key] = resolvePathValue(
            (row as Record<string, unknown>)[vk],
            surfaceDataModel,
            getByPath,
          );
        }
      }
    }
  }

  const normalizedContextFromAction = dataModelMapToPlain(contextFromAction);
  if (Object.keys(normalizedContextFromAction).length > 0) {
    return {
      name,
      context: normalizedContextFromAction,
    };
  }

  const plain = dataModelMapToPlain(surfaceDataModel) as Record<string, unknown>;
  const { form } = plain;
  const fallbackContext = (
    form && typeof form === 'object'
      ? dataModelMapToPlain(form)
      : plain
  );

  return {
    name,
    context: fallbackContext,
  };
}
