import { z } from 'zod';
import { defineComponentApi, DynString } from '@bote/a2ui-custom-kit';
import { ComponentIdSchema } from '@bote/a2ui-custom-kit';

export const PresetDashboardCardApi = defineComponentApi({
  name: 'PresetDashboardCard',
  shape: {
    /** 卡片标题 */
    title: DynString,
    /** 卡片副标题 */
    subtitle: DynString.optional(),
    /** 卡片内容组件 ID */
    child: ComponentIdSchema.optional(),
  },
});
