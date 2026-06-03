/**
 * 将 themePreset 的 shadowCss 注入 a2ui-surface 子树内各 ShadowRoot（adoptedStyleSheets）。
 * 与 antd 注入分离：主题 CSS 始终挂到所有 A2UI 组件 shadow，供 :host / .a2ui-* 选择器使用。
 */

const sheetCache = new Map<string, CSSStyleSheet>();
const appliedSheetByRoot = new WeakMap<ShadowRoot, CSSStyleSheet>();

function supportsConstructableStyleSheet(): boolean {
  try {
    return (
      typeof CSSStyleSheet !== 'undefined'
      && 'adoptedStyleSheets' in ShadowRoot.prototype
      && typeof new CSSStyleSheet().replaceSync === 'function'
    );
  } catch {
    return false;
  }
}

const LEGACY_THEME_STYLE_ID = 'a2ui-theme-preset-shadow-styles';

function getOrCreateThemePresetSheet(css: string): CSSStyleSheet | null {
  const trimmed = css.trim();
  if (!trimmed) return null;
  let sheet = sheetCache.get(trimmed);
  if (sheet) return sheet;
  if (!supportsConstructableStyleSheet()) return null;
  try {
    sheet = new CSSStyleSheet();
    sheet.replaceSync(trimmed);
    sheetCache.set(trimmed, sheet);
    return sheet;
  } catch {
    return null;
  }
}

function removeLegacyThemeStyleTag(root: ShadowRoot) {
  root.getElementById(LEGACY_THEME_STYLE_ID)?.remove();
}

function syncThemePresetSheetOnShadowRoot(root: ShadowRoot, sheet: CSSStyleSheet | null) {
  const prev = appliedSheetByRoot.get(root);

  if (sheet) {
    removeLegacyThemeStyleTag(root);
    const current = [...(root.adoptedStyleSheets ?? [])];
    const without = current.filter((s) => s !== prev);
    root.adoptedStyleSheets = [...without, sheet];
    appliedSheetByRoot.set(root, sheet);
    return;
  }

  if (prev) {
    const current = [...(root.adoptedStyleSheets ?? [])];
    root.adoptedStyleSheets = current.filter((s) => s !== prev);
    appliedSheetByRoot.delete(root);
  }
  removeLegacyThemeStyleTag(root);
}

function injectLegacyThemeStyleTag(root: ShadowRoot, css: string) {
  removeLegacyThemeStyleTag(root);
  const style = document.createElement('style');
  style.id = LEGACY_THEME_STYLE_ID;
  style.setAttribute('data-a2ui-shadow-layer', 'theme-preset');
  style.textContent = css;
  root.appendChild(style);
}

/** 遍历 surface 下全部 ShadowRoot 并挂载或移除主题样式表 */
export function syncThemePresetSheetToShadowTree(
  surfaceElement: HTMLElement,
  css: string,
) {
  const trimmed = css.trim();
  const sheet = trimmed ? getOrCreateThemePresetSheet(trimmed) : null;
  const synced = new WeakSet<ShadowRoot>();

  const syncOnce = (root: ShadowRoot) => {
    if (synced.has(root)) return;
    synced.add(root);
    if (sheet) {
      syncThemePresetSheetOnShadowRoot(root, sheet);
    } else if (trimmed) {
      injectLegacyThemeStyleTag(root, trimmed);
    } else {
      syncThemePresetSheetOnShadowRoot(root, null);
    }
  };

  const visitElement = (el: Element) => {
    if (el.shadowRoot) {
      syncOnce(el.shadowRoot);
      Array.from(el.shadowRoot.children).forEach((child) => visitElement(child));
    }
    Array.from(el.children).forEach((child) => visitElement(child));
  };

  visitElement(surfaceElement);

  if (trimmed) {
    requestAnimationFrame(() => {
      visitElement(surfaceElement);
      requestAnimationFrame(() => visitElement(surfaceElement));
    });
  }
}
