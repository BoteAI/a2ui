export type A2UIProtocolVersion = '0.8' | '0.9';

export const DEFAULT_A2UI_PROTOCOL_VERSION: A2UIProtocolVersion = '0.8';

export type A2UILitRuntime = {
  createSignalA2uiMessageProcessor: () => any
  componentRegistry: any
  registerCustomComponents: (...args: any[]) => any
};

export function normalizeProtocolVersion(version?: A2UIProtocolVersion): A2UIProtocolVersion {
  if (version === '0.9') {
    return '0.9';
  }
  return DEFAULT_A2UI_PROTOCOL_VERSION;
}

let loadedProtocolVersion: A2UIProtocolVersion | null = null;
const runtimeCache = new Map<A2UIProtocolVersion, Promise<A2UILitRuntime>>();

export async function loadLitRuntime(version?: A2UIProtocolVersion): Promise<A2UILitRuntime> {
  const protocolVersion = normalizeProtocolVersion(version);
  if (loadedProtocolVersion && loadedProtocolVersion !== protocolVersion) {
    runtimeCache.clear();
  }
  loadedProtocolVersion = protocolVersion;

  const cached = runtimeCache.get(protocolVersion);
  if (cached) return cached;

  const next = (protocolVersion === '0.9'
    ? import('./litCompat09.generated')
    : import('./litCompat08.generated')) as Promise<A2UILitRuntime>;
  runtimeCache.set(protocolVersion, next);
  return next;
}

export function getLoadedProtocolVersion(): A2UIProtocolVersion | null {
  return loadedProtocolVersion;
}

export async function getLitRuntime(version?: A2UIProtocolVersion): Promise<A2UILitRuntime> {
  return loadLitRuntime(version);
}
