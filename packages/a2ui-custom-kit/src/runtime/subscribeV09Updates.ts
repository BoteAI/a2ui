import type { A2UICustomElementHost } from './elementHost';

/**
 * 订阅 v0.9 componentModel.onUpdated，在 props 归一化后触发回调。
 * 返回取消订阅函数，在 disconnectedCallback 中调用。
 */
export function subscribeV09ComponentUpdates(
  host: A2UICustomElementHost,
  onUpdate: () => void,
): () => void {
  const onUpdated = host.context?.componentModel?.onUpdated;
  if (!onUpdated || typeof onUpdated.subscribe !== 'function') {
    return () => undefined;
  }
  const sub = onUpdated.subscribe(() => {
    queueMicrotask(onUpdate);
  });
  return () => sub.unsubscribe();
}

/**
 * 标准生命周期辅助：connected 时立即执行 + microtask 再执行一次（等待引擎写入 componentProps）。
 */
export function runAfterPropsReady(run: () => void): void {
  run();
  queueMicrotask(run);
}
