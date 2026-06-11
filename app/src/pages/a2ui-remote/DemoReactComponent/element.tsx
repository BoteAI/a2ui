/**
 * 示例 2：createReactComponent
 *
 * - 第一个参数传入 ComponentApi，props 自动按 schema 推断
 * - render 回调返回 JSX；kit 负责 mount / unmount / props 更新
 * - 注意：render 不是 React 函数组件，回调内不可直接使用 Hooks
 */
import React from 'react';
import { createReactComponent, ensureComponentStyles } from '@boteai/a2ui-custom-kit';
import { DemoReactComponentApi } from './api';
import styles from './index.less';

const STYLE_KEY = 'demo-react-component';
const PREFIX = 'demo-react-component';

export const DemoReactComponentElement = createReactComponent(DemoReactComponentApi, ({ props, host }) => {
  ensureComponentStyles(host, STYLE_KEY, styles);

  const title = String(props.title ?? 'React 组件');
  const subtitle = props.subtitle != null ? String(props.subtitle) : '';
  const align = props.align === 'center' ? 'center' : 'left';

  return (
    <div className={PREFIX} style={{ textAlign: align }}>
      <strong className={`${PREFIX}__title`}>{title}</strong>
      {subtitle ? <p className={`${PREFIX}__subtitle`}>{subtitle}</p> : null}
    </div>
  );
});
