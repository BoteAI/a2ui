import { z } from 'zod';
import { defineComponentApi } from '@boteai/a2ui-custom-kit';
import { ComponentIdSchema, ActionSchema } from '@boteai/a2ui-custom-kit';

export const PresetButtonApi = defineComponentApi({
  name: 'PresetButton',
  shape: {
    /** 按钮标签组件 ID */
    child: ComponentIdSchema,
    /** 视觉变体 */
    variant: z.enum(['primary', 'secondary', 'ghost']).optional(),
    /** v0.9 action 事件 */
    action: ActionSchema.optional(),
  },
});
