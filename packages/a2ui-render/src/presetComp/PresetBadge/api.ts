import { z } from 'zod';
import { defineComponentApi, DynString } from '@bote/a2ui-custom-kit';

export const PresetBadgeApi = defineComponentApi({
  name: 'PresetBadge',
  shape: {
    /** 标签文本 */
    text: DynString,
    /** 颜色变体 */
    variant: z.enum(['success', 'warning', 'error', 'info', 'neutral']).optional(),
  },
});
