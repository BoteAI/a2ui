import { z } from 'zod';
import { defineComponentApi, DynString } from '@boteteam/a2ui-custom-kit';

/** 替换 YourComponent 为实际组件名，与协议 JSON component 字段一致 */
export const YourComponentApi = defineComponentApi({
  name: 'YourComponent',
  shape: {
    title: DynString,
    subtitle: DynString.optional(),
    actionName: z.string().optional(),
  },
});
