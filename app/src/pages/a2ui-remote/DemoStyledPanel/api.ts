import { z } from 'zod';
import { defineComponentApi, DynString } from '@bote/a2ui-custom-kit';

/** 示例 3：ensureComponentStyles — 将 Less 编译 CSS 注入 ShadowRoot */
export const DemoStyledPanelApi = defineComponentApi({
  name: 'DemoStyledPanel',
  shape: {
    title: DynString,
    description: DynString.optional(),
    variant: z.enum(['purple', 'blue']).optional(),
  },
});
