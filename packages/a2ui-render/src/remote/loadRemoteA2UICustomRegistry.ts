import type { A2UICustomComponentRegistry, A2UICustomElementDefinition } from '../types';

const DEFAULT_EXPORT_KEYS = ['a2uiRemoteRegistry', 'a2uiCustomRegistry', 'registry'] as const;

function isCustomElementConstructor(v: unknown): v is CustomElementConstructor {
  return typeof v === 'function' && v.prototype instanceof HTMLElement;
}

function isElementDefinition(v: unknown): v is A2UICustomElementDefinition {
  if (!v || typeof v !== 'object') return false;
  const o = v as { elementCtor?: unknown };
  return typeof o.elementCtor === 'function' && o.elementCtor.prototype instanceof HTMLElement;
}

function normalizeRegistry(raw: Record<string, unknown>): A2UICustomComponentRegistry {
  const out: A2UICustomComponentRegistry = {};
  Object.entries(raw).forEach(([key, val]) => {
    if (!key) return;
    if (isCustomElementConstructor(val) || isElementDefinition(val)) {
      out[key] = val as A2UICustomElementDefinition;
    }
  });
  return out;
}

function mergeRegistryEntries(
  ...entries: Record<string, A2UICustomElementDefinition>[]
): Record<string, A2UICustomElementDefinition> {
  return Object.assign({}, ...entries);
}

/**
 * 从远程 ESM 入口加载 `A2UICustomComponentRegistry`。
 * 与 `RemoteComp` 不同：此处使用浏览器原生 `import()` 加载 **ESM 模块**，模块内需 **命名导出** 注册表对象。
 *
 * Umi Webpack 4 下对完整 URL 使用 `webpackIgnore: true`，避免被打进静态分析。
 */
export async function loadRemoteA2UICustomRegistry(
  moduleUrl: string,
  options?: { exportName?: string },
): Promise<A2UICustomComponentRegistry> {
  const exportName = options?.exportName ?? 'a2uiRemoteRegistry';
  const url = moduleUrl.trim();
  if (!url) {
    throw new Error('loadRemoteA2UICustomRegistry: moduleUrl 为空');
  }

  let mod: Record<string, unknown>;
  try {
    mod = (await import(

      /* webpackIgnore: true */
      url
    )) as Record<string, unknown>;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('require is not defined') || msg.includes('require is not a function')) {
      throw new Error(
        [
          '远程脚本内含 require。',
          'lingxi 的 yarn build:remote 会产出 commonjs 且 @lingxiteam/cli 的 webpack 会强制将 react、react-dom 设为 external，无法用浏览器原生 import 加载。',
          '请在 remote-comp 执行 yarn build:a2ui-esm，使用生成的 public/*.mjs 的 URL（一组件一个文件）。',
          '详见 @bote/a2ui-custom-kit 的 REMOTE_ESM_DEVELOPMENT.md 第 2.5 节。',
          `原始错误：${msg}`,
        ].join(' '),
      );
    }
    throw e;
  }

  const tryKeys = [exportName, ...DEFAULT_EXPORT_KEYS.filter((k) => k !== exportName)];

  for (const k of tryKeys) {
    const candidate = mod[k as string];
    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      const normalized = normalizeRegistry(candidate as Record<string, unknown>);
      if (Object.keys(normalized).length > 0) {
        return normalized;
      }
    }
  }

  throw new Error(
    `远程模块未导出有效的 A2UI 注册表。请在入口文件中命名导出 \`export const ${String(exportName)} = { YourComp: YourElement }\``,
  );
}

/** 并行加载多个远程 ESM，合并为一个注册表（一组件一 .mjs 时使用） */
export async function loadRemoteA2UICustomRegistries(
  moduleUrls: string[],
  options?: { exportName?: string },
): Promise<A2UICustomComponentRegistry> {
  const urls = moduleUrls.map((u) => u.trim()).filter(Boolean);
  if (urls.length === 0) {
    throw new Error('loadRemoteA2UICustomRegistries: moduleUrls 为空');
  }
  const parts = await Promise.all(urls.map((url) => loadRemoteA2UICustomRegistry(url, options)));
  return mergeRegistryEntries(...parts);
}
