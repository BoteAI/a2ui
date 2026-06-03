import type { A2UICustomElementHost } from '../runtime/elementHost';
import { runAfterPropsReady, subscribeV09ComponentUpdates } from '../runtime/subscribeV09Updates';

export type NativeElementLifecycle = {
  onConnect?: (host: A2UICustomElementHost) => void;
  onDisconnect?: (host: A2UICustomElementHost) => void;
  render: (host: A2UICustomElementHost) => void;
};

/**
 * 原生 HTMLElement 自定义组件工厂：统一 connected 双次渲染与 v0.9 onUpdated 订阅。
 */
export function createNativeElement(
  displayName: string,
  lifecycle: NativeElementLifecycle,
): CustomElementConstructor {
  class NativeA2UICustomElement extends HTMLElement {
    componentProps?: Record<string, unknown>;

    context?: A2UICustomElementHost['context'];

    private unsubscribe?: () => void;

    connectedCallback() {
      lifecycle.onConnect?.(this);
      runAfterPropsReady(() => lifecycle.render(this));
      this.unsubscribe = subscribeV09ComponentUpdates(this, () => lifecycle.render(this));
    }

    disconnectedCallback() {
      this.unsubscribe?.();
      this.unsubscribe = undefined;
      lifecycle.onDisconnect?.(this);
    }
  }

  Object.defineProperty(NativeA2UICustomElement, 'name', { value: displayName, configurable: true });

  return NativeA2UICustomElement;
}
