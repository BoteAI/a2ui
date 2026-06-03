import { Data } from '@a2ui/lit/0.8';
import * as UI from '@a2ui/lit/ui';
import { renderMarkdown } from '@a2ui/markdown-it';
import { DEFAULT_A2UI_V08_THEME } from '../components/BaseRenderer/defaultA2uiV08Theme.js';

export const { createSignalA2uiMessageProcessor } = Data;
export const { componentRegistry } = UI;
export const { registerCustomComponents } = UI;

function patchCustomElementsDefineGuard() {
  if (typeof window === 'undefined' || !window.customElements) return;
  const ce = window.customElements;
  if (ce.__a2uiPatchedDefine) return;
  const originalDefine = ce.define.bind(ce);
  ce.define = (name, ctor, options) => {
    const existedCtor = ce.get(name);
    if (existedCtor) {
      if (existedCtor !== ctor) {
        // eslint-disable-next-line no-console
        console.warn(`[A2UI Lit] skip redefining custom element "${name}" during HMR`);
      }
      return;
    }
    // eslint-disable-next-line consistent-return
    return originalDefine(name, ctor, options);
  };
  ce.__a2uiPatchedDefine = true;
}

patchCustomElementsDefineGuard();

const fallbackTheme = DEFAULT_A2UI_V08_THEME;

function ensureTheme(theme) {
  const next = theme && typeof theme === 'object' ? theme : {};
  if (!next.components) {
    next.components = DEFAULT_A2UI_V08_THEME.components;
  }
  if (!next.additionalStyles) {
    next.additionalStyles = DEFAULT_A2UI_V08_THEME.additionalStyles ?? {};
  }
  if (!next.elements) {
    next.elements = DEFAULT_A2UI_V08_THEME.elements;
  }
  if (!next.markdown) {
    next.markdown = DEFAULT_A2UI_V08_THEME.markdown;
  }
  return next;
}

function patchThemeGuard(Ctor) {
  if (!Ctor || !Ctor.prototype) return;

  const proto = Ctor.prototype;
  const hasThemeAccessor = Object.prototype.hasOwnProperty.call(proto, 'theme')
    || 'theme' in proto;
  if (!hasThemeAccessor) return;

  const wrap = (methodName) => {
    const original = proto[methodName];
    proto[methodName] = function patchedThemeGuard(...args) {
      this.theme = ensureTheme(this.theme ?? fallbackTheme);
      if ('markdownRenderer' in this && !this.markdownRenderer) {
        this.markdownRenderer = renderMarkdown;
      }
      if (typeof original === 'function') {
        return original.apply(this, args);
      }
      return undefined;
    };
  };

  wrap('connectedCallback');
  wrap('willUpdate');
  wrap('render');
}

Object.values(UI).forEach((maybeCtor) => patchThemeGuard(maybeCtor));
