/**
 * 示例 4：dispatchDeclaredAction vs dispatchA2UIAction
 *
 * dispatchDeclaredAction(host)
 *   - 读取 props.action（Agent 在协议里声明的 ActionSchema）
 *   - 自动解析 action.context 中的 DynamicValue
 *   - 优先走 v0.9 context.dispatchAction，与官方 Button 语义一致
 *   - 适用：交互由 Agent 配置，组件只负责「触发已声明的 action」
 *
 * dispatchA2UIAction(host, { name, context })
 *   - 组件代码里自行决定 action 名称与 context
 *   - 向宿主派发 a2uiaction 自定义事件
 *   - 适用：固定业务逻辑、调试、或未在 props 中声明 action 的场景
 */
import React from 'react';
import {
  createReactComponent,
  dispatchA2UIAction,
  dispatchDeclaredAction,
  ensureComponentStyles,
} from '@bote/a2ui-custom-kit';
import { DemoActionDispatchApi } from './api';
import styles from './index.less';

const STYLE_KEY = 'demo-action-dispatch';
const PREFIX = 'demo-action-dispatch';

export const DemoActionDispatchElement = createReactComponent(DemoActionDispatchApi, ({ props, host }) => {
  ensureComponentStyles(host, STYLE_KEY, styles);

  const label = String(props.label ?? 'Action Demo');
  const hasDeclaredAction = Boolean(props.action);

  return (
    <div className={PREFIX}>
      <p className={`${PREFIX}__label`}>{label}</p>
      <div className={`${PREFIX}__actions`}>
        <button
          type="button"
          className={`${PREFIX}__btn ${PREFIX}__btn--declared`}
          disabled={!hasDeclaredAction}
          onClick={() => dispatchDeclaredAction(host)}
        >
          协议 action（dispatchDeclaredAction）
        </button>
        <button
          type="button"
          className={`${PREFIX}__btn ${PREFIX}__btn--imperative`}
          onClick={() =>
            dispatchA2UIAction(host, {
              name: 'demo_action_imperative',
              context: { source: 'DemoActionDispatch', trigger: 'code' },
            })
          }
        >
          代码 action（dispatchA2UIAction）
        </button>
      </div>
    </div>
  );
});
