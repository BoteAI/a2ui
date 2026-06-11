/**
 * 示例 3：ensureComponentStyles
 *
 * - 远程 ESM 在 Shadow DOM 内运行，普通全局 CSS 无法作用到组件
 * - ensureComponentStyles(host, styleKey, css) 将 Less 编译后的 CSS 注入 ShadowRoot
 * - styleKey 保证同一 Shadow 内只注入一次，避免重复 style 标签
 */
import { createNativeElement, ensureComponentStyles, readComponentProps, readStringProp } from '@boteai/a2ui-custom-kit';
import { DemoStyledPanelApi } from './api';
import styles from './index.less';

const STYLE_KEY = 'demo-styled-panel';
const PREFIX = 'demo-styled-panel';

export const DemoStyledPanelElement = createNativeElement('DemoStyledPanelHost', {
  render(host) {
    ensureComponentStyles(host, STYLE_KEY, styles);

    const props = readComponentProps(host);
    const title = readStringProp(props, 'title', 'Styled Panel');
    const description = readStringProp(props, 'description', '');
    const variant = readStringProp(props, 'variant', 'purple');
    const variantClass = variant === 'blue' ? `${PREFIX}--blue` : `${PREFIX}--purple`;

    host.replaceChildren();
    host.className = `${PREFIX} ${variantClass}`;

    const titleEl = document.createElement('p');
    titleEl.className = `${PREFIX}__title`;
    titleEl.textContent = title;
    host.appendChild(titleEl);

    if (description) {
      const descEl = document.createElement('p');
      descEl.className = `${PREFIX}__desc`;
      descEl.textContent = description;
      host.appendChild(descEl);
    }
  },
});
