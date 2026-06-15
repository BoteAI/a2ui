import { z } from 'zod';
import { defineComponentApi } from '@boteai/a2ui-custom-kit';
import { ChildListSchema } from '@boteai/a2ui-custom-kit';

export const PresetRowApi = defineComponentApi({
  name: 'PresetRow',
  shape: {
    /** 子组件 ID 列表或模板 */
    children: ChildListSchema, /** 卡片内容组件 ID */
    /** 子元素间距（像素） */
    gap: z.number().optional(),
    /** 交叉轴（垂直）对齐 */
    align: z.enum(['start', 'center', 'end', 'stretch']).optional(),
    /** 主轴（水平）分布 */
    justify: z.enum(['start', 'center', 'end', 'spaceBetween', 'spaceAround', 'spaceEvenly', 'stretch']).optional(),
  },
});
