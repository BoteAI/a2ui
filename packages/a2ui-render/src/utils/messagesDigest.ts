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
