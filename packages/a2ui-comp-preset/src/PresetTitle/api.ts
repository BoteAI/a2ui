import { z } from 'zod';
import { defineComponentApi, DynString } from '@boteai/a2ui-custom-kit';

export const PresetTitleApi = defineComponentApi({
  name: 'PresetTitle',
  shape: {
    /** 标题文本，支持 path 绑定 */
    text: DynString,
    /** 标题级别 */
    level: z.enum(['h1', 'h2', 'h3']).optional(),
  },
});
