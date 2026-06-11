import { z } from 'zod';
import { defineComponentApi, DynString } from '@boteai/a2ui-custom-kit';

/** 示例 2：createReactComponent — 用 JSX 写视图，对外仍是 CustomElement */
export const DemoReactComponentApi = defineComponentApi({
  name: 'DemoReactComponent',
  shape: {
    title: DynString,
    subtitle: DynString.optional(),
    align: z.enum(['left', 'center']).optional(),
  },
});
