import { useEffect, useState } from 'react';
import type { A2UICustomComponentRegistry } from '../types';
import {
  loadRemoteA2UICustomRegistry,
  loadRemoteA2UICustomRegistries,
} from './loadRemoteA2UICustomRegistry';

export type RemoteA2UIRegistryState = {
  loading: boolean;
  err: Error | null;
  registry: A2UICustomComponentRegistry | null;
};

/**
 * 与 `RemoteComp` + `useRemoteComponent` 用法类似：传入远程 ESM 的 **绝对 URL**，得到加载态与合并用注册表。
 * 鉴权与 CORS：若需与 RemoteComp 相同的 Token 头，请让静态资源走网关或由 CDN 带 Cookie；或改为先 fetch 文本再 blob URL 方案自行封装。
 */
export function useRemoteA2UICustomRegistry(
  moduleUrl: string | undefined,
  exportName?: string,
): readonly [boolean, Error | null, A2UICustomComponentRegistry | null] {
  const [state, setState] = useState<RemoteA2UIRegistryState>({
    loading: false,
    err: null,
    registry: null,
  });

  useEffect(() => {
    const raw = moduleUrl?.trim();
    if (!raw) {
      setState({ loading: false, err: null, registry: null });
      return undefined;
    }

    const urls = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const load =
      urls.length > 1
        ? () => loadRemoteA2UICustomRegistries(urls, { exportName })
        : () => loadRemoteA2UICustomRegistry(urls[0], { exportName });

    let cancelled = false;
    setState({ loading: true, err: null, registry: null });

    load()
      .then((registry) => {
        if (!cancelled) {
          setState({ loading: false, err: null, registry });
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setState({
            loading: false,
            err: e instanceof Error ? e : new Error(String(e)),
            registry: null,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [moduleUrl, exportName]);

  return [state.loading, state.err, state.registry] as const;
}
