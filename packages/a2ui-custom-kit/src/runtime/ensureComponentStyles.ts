const STYLE_ATTR = 'data-a2ui-remote-component-styles';

/**
 * 在 A2UI Surface 的 ShadowRoot 内注入组件样式（同 Shadow 只注入一次）。
 * 非 Shadow 环境则挂在 host 上，便于本地调试。
 */
export function ensureComponentStyles(host: Element, styleKey: string, css: string): void {
  const root = host.getRootNode();
  const container = root instanceof ShadowRoot ? root : host;
  const selector = `style[${STYLE_ATTR}="${styleKey}"]`;
  if (container.querySelector(selector)) return;

  const style = document.createElement('style');
  style.setAttribute(STYLE_ATTR, styleKey);
  style.textContent = css;
  container.prepend(style);
}
