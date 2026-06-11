import { z } from 'zod';
import { defineComponentApi, DynString } from '@boteai/a2ui-custom-kit';

/** 示例 1：createNativeElement — 仅用原生 DOM 渲染，无 React 运行时 */
export const DemoNativeElementApi = defineComponentApi({
  name: 'DemoNativeElement',
  shape: {
    label: DynString,
    tone: z.enum(['default', 'success', 'warning']).optional(),
  },
});
