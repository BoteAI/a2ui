import { z } from 'zod';
import { ActionSchema, defineComponentApi, DynString } from '@bote/a2ui-custom-kit';

/**
 * 示例 4：dispatchDeclaredAction vs dispatchA2UIAction
 *
 * - action：由 Agent / 协议声明，点击「协议 action」按钮时通过 dispatchDeclaredAction 派发
 * - 第二个按钮在代码里写死 action 名称，用 dispatchA2UIAction 直接派发
 */
export const DemoActionDispatchApi = defineComponentApi({
  name: 'DemoActionDispatch',
  shape: {
    label: DynString,
    action: ActionSchema.optional(),
  },
});
