/**
 * 轻量消息指纹，用于 Lit 路径判断是否需要全量重建。
 * 须能区分同长度下的内容变更（如编辑器内改 variant、Tabs 调序），不能只比首尾字符。
 */

/** djb2 风格字符串哈希（纯算术，避免 no-bitwise） */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 33 + s.charCodeAt(i)) % 2147483647;
  }
  return h;
}

function stableMessageFingerprint(msg: unknown): string {
  if (msg == null) return '';
  if (typeof msg !== 'object') return String(msg);
  const m = msg as Record<string, unknown>;
  const typeKey = [
    'createSurface',
    'beginRendering',
    'updateComponents',
    'surfaceUpdate',
    'updateDataModel',
    'dataModelUpdate',
    'deleteSurface',
  ].find((k) => m[k] != null);
  if (!typeKey) return `keys:${Object.keys(m).length}`;
  try {
    const body = m[typeKey];
    const s = JSON.stringify(body);
    return `${typeKey}:${s.length}:${hashString(s)}`;
  } catch {
    return typeKey;
  }
}

/** 流式场景下用于检测「仅尾部追加」 */
export function computeMessagesDigest(messages: unknown[] | undefined | null): string {
  if (!Array.isArray(messages) || messages.length === 0) return 'len:0';
  const len = messages.length;
  if (len === 1) return `len:1:${stableMessageFingerprint(messages[0])}`;
  return [
    `len:${len}`,
    stableMessageFingerprint(messages[0]),
    stableMessageFingerprint(messages[len - 1]),
    stableMessageFingerprint(messages[Math.max(0, len - 2)]),
  ].join('|');
}

export function isMessagesAppendOnly(prev: unknown[] | undefined | null, next: unknown[]): boolean {
  if (!Array.isArray(prev) || prev.length === 0) return false;
  if (next.length <= prev.length) return false;
  for (let i = 0; i < prev.length; i += 1) {
    if (stableMessageFingerprint(prev[i]) !== stableMessageFingerprint(next[i])) {
      return false;
    }
  }
  return true;
}

const IN_PLACE_PATCH_MESSAGE_TYPES = new Set([
  'updateComponents',
  'surfaceUpdate',
  'updateDataModel',
  'dataModelUpdate',
]);

function getMessageTypeKey(msg: unknown): string | null {
  if (msg == null || typeof msg !== 'object') return null;
  const m = msg as Record<string, unknown>;
  return [
    'createSurface',
    'beginRendering',
    'updateComponents',
    'surfaceUpdate',
    'updateDataModel',
    'dataModelUpdate',
    'deleteSurface',
  ].find((k) => m[k] != null) ?? null;
}

function isInPlacePatchMessageType(msg: unknown): boolean {
  const typeKey = getMessageTypeKey(msg);
  return typeKey != null && IN_PLACE_PATCH_MESSAGE_TYPES.has(typeKey);
}

/** 同长度 messages 下返回 fingerprint 变化的 index；长度不同返回 null */
export function findChangedMessageIndices(
  prev: unknown[] | undefined | null,
  next: unknown[] | undefined | null,
): number[] | null {
  if (!Array.isArray(prev) || !Array.isArray(next)) return null;
  if (prev.length === 0 || prev.length !== next.length) return null;
  const indices: number[] = [];
  for (let i = 0; i < prev.length; i += 1) {
    if (stableMessageFingerprint(prev[i]) !== stableMessageFingerprint(next[i])) {
      indices.push(i);
    }
  }
  return indices;
}

/** 编辑器 in-place 改属性：同长度、createSurface 不变、仅 patch 类 message 变更 */
export function isMessagesInPlacePatchable(
  prev: unknown[] | undefined | null,
  next: unknown[] | undefined | null,
): boolean {
  const changed = findChangedMessageIndices(prev, next);
  if (!changed || changed.length === 0) return false;
  if (changed.includes(0)) return false;
  if (!Array.isArray(next)) return false;
  return changed.every((i) => isInPlacePatchMessageType(next[i]));
}

/** patchable 时返回变更 index，否则 [] */
export function getInPlacePatchIndices(
  prev: unknown[] | undefined | null,
  next: unknown[] | undefined | null,
): number[] {
  if (!isMessagesInPlacePatchable(prev, next)) return [];
  return findChangedMessageIndices(prev, next) ?? [];
}

/** 增量更新后是否应保留 processor / DOM（append-only 或 in-place patch） */
export function shouldKeepProcessorAlive(
  built: unknown[] | undefined | null,
  next: unknown[] | undefined | null,
): boolean {
  if (!Array.isArray(built) || !Array.isArray(next)) return false;
  return isMessagesAppendOnly(built, next) || isMessagesInPlacePatchable(built, next);
}
