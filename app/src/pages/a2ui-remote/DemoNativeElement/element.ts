/**
 * 示例 1：createNativeElement
 *
 * - 在 render(host) 里用 document.createElement 构建 UI
 * - 用 readComponentProps / readStringProp 读取协议 props
 * - connectedCallback 与 props 更新由 kit 自动订阅，无需手写
 */
import { createNativeElement, readComponentProps, readStringProp } from '@bote/a2ui-custom-kit';
import { DemoNativeElementApi } from './api';

const PREFIX = 'demo-native-element';
const TONE_COLOR: Record<string, string> = {
  default: '#417ffb',
  success: '#02b342',
  warning: '#faaf0c',
};

export const DemoNativeElementElement = createNativeElement('DemoNativeElementHost', {
  render(host) {
    const props = readComponentProps(host);
    const label = readStringProp(props, 'label', 'Native Tag');
    const tone = readStringProp(props, 'tone', 'default');
    const color = TONE_COLOR[tone] ?? TONE_COLOR.default;

    host.replaceChildren();
    host.className = PREFIX;

    const tag = document.createElement('span');
    tag.className = `${PREFIX}__tag`;
    tag.textContent = label;
    tag.style.cssText = [
      'display:inline-block',
      'padding:4px 10px',
      'border-radius:999px',
      'font-size:13px',
      'line-height:1.4',
      'color:#fff',
      `background:${color}`,
    ].join(';');

    host.appendChild(tag);
  },
});
