import React from 'react';
import ReactDOM from 'react-dom';
import type { ComponentApi } from '../schema/webCoreV09Shim';
import type { z } from 'zod';
import type { A2UICustomElementHost } from '../runtime/elementHost';
import { runAfterPropsReady, subscribeV09ComponentUpdates } from '../runtime/subscribeV09Updates';

type SchemaProps<A extends ComponentApi> = z.infer<A['schema']>;

export type ReactA2UICustomRenderProps<A extends ComponentApi> = {
  props: SchemaProps<A>;
  host: A2UICustomElementHost;
};

/**
 * 用 React 写视图，对外仍产出 CustomElementConstructor，供 LitSurfaceHost customComponents 注册。
 * props 来自引擎归一化后的 componentProps；复杂双向绑定请使用 host.context.dataContext。
 */
export function createReactComponent<A extends ComponentApi>(
  api: A,
  render: (args: ReactA2UICustomRenderProps<A>) => React.ReactElement | null,
): CustomElementConstructor {
  const displayName = `${api.name}ReactHost`;

  class ReactBridgedCustomElement extends HTMLElement {
    componentProps?: Record<string, unknown>;

    context?: A2UICustomElementHost['context'];

    private mountRoot: HTMLDivElement | null = null;

    private unsubscribe?: () => void;

    connectedCallback() {
      if (!this.mountRoot) {
        this.mountRoot = document.createElement('div');
        this.appendChild(this.mountRoot);
      }
      runAfterPropsReady(() => this.paint());
      this.unsubscribe = subscribeV09ComponentUpdates(this, () => this.paint());
    }

    disconnectedCallback() {
      this.unsubscribe?.();
      this.unsubscribe = undefined;
      if (this.mountRoot) {
        ReactDOM.unmountComponentAtNode(this.mountRoot);
        this.mountRoot.remove();
      }
      this.mountRoot = null;
    }

    private paint() {
      if (!this.mountRoot) return;
      const props = (this.componentProps ?? {}) as SchemaProps<A>;
      const tree = render({ props, host: this });
      ReactDOM.render(<>{tree}</>, this.mountRoot);
    }
  }

  Object.defineProperty(ReactBridgedCustomElement, 'name', { value: displayName, configurable: true });

  return ReactBridgedCustomElement;
}
