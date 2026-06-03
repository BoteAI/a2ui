/**
 * 编辑器画布：按 A2UI 组件 id 高亮当前选中节点（遍历 surface 子树内各 ShadowRoot）。
 */

import {
  syncThemePresetSheetToShadowTree,
} from './themePresetShadowSheet';

export const A2UI_EDITOR_SELECTED_CLASS = 'a2ui-component--editor-selected';

const A2UI_EDITOR_SELECTION_OUTLINE = '1px solid var(--a2ui-editor-selection-color, #1677ff)';

export const A2UI_EDITOR_SELECTION_SHADOW_CSS = `
:host(.a2ui-component--editor-selected),
.a2ui-component--editor-selected {
  outline: ${A2UI_EDITOR_SELECTION_OUTLINE};
  outline-offset: 1px;
  position: relative;
  z-index: 1;
}
`;

type A2uiLitHostElement = HTMLElement & {
  context?: { componentModel?: { id?: string } };
  component?: { id?: string };
};

function readComponentId(el: Element): string | null {
  const host = el as A2uiLitHostElement;
  const fromV09 = host.context?.componentModel?.id;
  if (typeof fromV09 === 'string' && fromV09) return fromV09;
  const fromV08 = host.component?.id;
  if (typeof fromV08 === 'string' && fromV08) return fromV08;
  return null;
}

function applyLightDomSelectionOutline(host: HTMLElement, selected: boolean) {
  // 自定义组件多为无 Shadow 的 HTMLElement，:host 选择器不生效，需直接写 outline
  if (host.shadowRoot) return;
  if (selected) {
    host.style.setProperty('outline', A2UI_EDITOR_SELECTION_OUTLINE);
    host.style.setProperty('outline-offset', '1px');
  } else {
    host.style.removeProperty('outline');
    host.style.removeProperty('outline-offset');
  }
}

function applySelectionClasses(surfaceElement: HTMLElement, selectedComponentId: string | null) {
  const visitElement = (el: Element) => {
    const compId = readComponentId(el);
    if (compId != null) {
      const host = el as HTMLElement;
      const isSelected = Boolean(selectedComponentId && compId === selectedComponentId);
      if (isSelected) {
        host.classList.add(A2UI_EDITOR_SELECTED_CLASS);
      } else {
        host.classList.remove(A2UI_EDITOR_SELECTED_CLASS);
      }
      applyLightDomSelectionOutline(host, isSelected);
    }
    if (el.shadowRoot) {
      Array.from(el.shadowRoot.children).forEach((child) => visitElement(child));
    }
    Array.from(el.children).forEach((child) => visitElement(child));
  };

  visitElement(surfaceElement);
}

/**
 * @param selectedComponentId 为 undefined 时不处理；为 null 时清除高亮；为 string 时高亮对应组件
 */
export function syncEditorSelectionHighlight(
  surfaceElement: HTMLElement,
  selectedComponentId: string | null | undefined,
) {
  if (selectedComponentId === undefined) return;

  const run = () => {
    syncThemePresetSheetToShadowTree(surfaceElement, A2UI_EDITOR_SELECTION_SHADOW_CSS);
    applySelectionClasses(surfaceElement, selectedComponentId);
  };

  run();
  requestAnimationFrame(() => {
    run();
    requestAnimationFrame(run);
  });
}
