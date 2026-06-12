import { A2UI_ANTD_SHADOW_CSS } from './generated/antdShadowCss.generated';

/** 旧版 style 标签注入的 id，迁移到 adoptedStyleSheets 时清理 */
const LEGACY_ANTD_STYLE_ID = 'a2ui-antd-shadow-styles';

let sharedAntdSheet: CSSStyleSheet | null = null;
let sharedAntdSheetFailed = false;

export function supportsAntdConstructableStyleSheet(): boolean {
  try {
    return (
      Boolean(A2UI_ANTD_SHADOW_CSS)
      && typeof CSSStyleSheet !== 'undefined'
      && 'adoptedStyleSheets' in ShadowRoot.prototype
      && typeof new CSSStyleSheet().replaceSync === 'function'
    );
  } catch {
    return false;
  }
}

/** 全应用只解析一次 antd.min.css */
export function getSharedAntdStyleSheet(): CSSStyleSheet | null {
  if (sharedAntdSheetFailed || !A2UI_ANTD_SHADOW_CSS) return null;
  if (sharedAntdSheet) return sharedAntdSheet;
  if (!supportsAntdConstructableStyleSheet()) {
    sharedAntdSheetFailed = true;
    return null;
  }
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(A2UI_ANTD_SHADOW_CSS);
    sharedAntdSheet = sheet;
    return sheet;
  } catch {
    sharedAntdSheetFailed = true;
    return null;
  }
}

function removeLegacyAntdStyleTag(root: ShadowRoot) {
  root.getElementById(LEGACY_ANTD_STYLE_ID)?.remove();
}

function elementUsesAntdClass(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;
  for (let i = 0; i < el.classList.length; i += 1) {
    const token = el.classList.item(i);
    if (!token) {
      // skip
    } else if (token === 'anticon' || token.startsWith('anticon-') || token.startsWith('ant-')) {
      return true;
    }
  }
  return false;
}

/**
 * 当前 Shadow 自身是否用到 antd（仅看本层 DOM，不进入子组件的 shadow）。
 * 避免 a2ui-surface 因内部 Remote* 的 ant 类名误挂整包 antd.css。
 */
export function shadowRootUsesAntd(root: ShadowRoot): boolean {
  const visit = (parent: ParentNode): boolean => {
    const children = parent instanceof ShadowRoot
      ? Array.from(parent.children)
      : Array.from((parent as Element).children);

    for (let i = 0; i < children.length; i += 1) {
      const el = children[i];
      if (!(el instanceof Element)) {
        // skip
      } else if (elementUsesAntdClass(el)) {
        return true;
      } else if (el.shadowRoot) {
        // 子组件自有 shadow，antd 在对应层单独注入
      } else if (visit(el)) {
        return true;
      }
    }
    return false;
  };

  return visit(root);
}

/** 在单个 ShadowRoot 上挂载或移除共享 antd 样式表（幂等：同一 Shadow 最多保留一份引用） */
export function syncAntdSheetOnShadowRoot(root: ShadowRoot, enabled: boolean) {
  const sheet = getSharedAntdStyleSheet();
  if (sheet) {
    removeLegacyAntdStyleTag(root);
    const current = [...(root.adoptedStyleSheets ?? [])];
    const withoutAntd = current.filter((s) => s !== sheet);
    root.adoptedStyleSheets = enabled ? [...withoutAntd, sheet] : withoutAntd;
    return;
  }

  // 降级：不支持 Constructable Stylesheets 时仍用 style 标签
  const existed = root.getElementById(LEGACY_ANTD_STYLE_ID);
  if (!enabled) {
    existed?.remove();
    return;
  }
  if (existed || !A2UI_ANTD_SHADOW_CSS) return;
  const style = document.createElement('style');
  style.id = LEGACY_ANTD_STYLE_ID;
  style.setAttribute('data-a2ui-shadow-layer', 'antd');
  style.textContent = A2UI_ANTD_SHADOW_CSS;
  root.appendChild(style);
}

const antdObserverBySurface = new WeakMap<HTMLElement, MutationObserver>();

function visitShadowRootsForAntd(surfaceElement: HTMLElement, enabled: boolean) {
  const visit = (el: Element) => {
    if (el.shadowRoot) {
      const shouldAttach = enabled && shadowRootUsesAntd(el.shadowRoot);
      syncAntdSheetOnShadowRoot(el.shadowRoot, shouldAttach);
      Array.from(el.shadowRoot.children).forEach((child) => visit(child));
    }
    Array.from(el.children).forEach((child) => visit(child));
  };

  visit(surfaceElement);
}

function stopAntdStyleObserver(surfaceElement: HTMLElement) {
  const observer = antdObserverBySurface.get(surfaceElement);
  observer?.disconnect();
  antdObserverBySurface.delete(surfaceElement);
}

function startAntdStyleObserver(surfaceElement: HTMLElement) {
  stopAntdStyleObserver(surfaceElement);

  let scheduled = false;
  const scheduleResync = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      visitShadowRootsForAntd(surfaceElement, true);
    });
  };

  const observer = new MutationObserver(scheduleResync);
  observer.observe(surfaceElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class'],
  });
  antdObserverBySurface.set(surfaceElement, observer);
}

/**
 * 遍历 surface 下全部 ShadowRoot 并挂载 antd 样式表。
 *
 * @a2ui/lit v0.8 的 a2ui-root 用 render(..., { host: this }) 把子树画在 **Light DOM**，
 * 子组件 a2ui-button 等与 root 的 shadow 是兄弟关系，仅在 root.shadow 内 querySelector 会漏掉深层 shadow。
 */
export function syncAntdSheetToShadowTree(surfaceElement: HTMLElement, enabled: boolean) {
  visitShadowRootsForAntd(surfaceElement, enabled);

  if (!enabled) {
    stopAntdStyleObserver(surfaceElement);
    return;
  }

  startAntdStyleObserver(surfaceElement);

  // React 桥接自定义组件常在首帧之后才挂上 ant 类名
  requestAnimationFrame(() => {
    visitShadowRootsForAntd(surfaceElement, true);
    requestAnimationFrame(() => visitShadowRootsForAntd(surfaceElement, true));
  });
  window.setTimeout(() => visitShadowRootsForAntd(surfaceElement, true), 0);
  window.setTimeout(() => visitShadowRootsForAntd(surfaceElement, true), 120);
}
