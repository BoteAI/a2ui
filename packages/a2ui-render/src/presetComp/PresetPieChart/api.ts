import { z } from 'zod';
import { defineComponentApi } from '@bote/a2ui-custom-kit';
import { DynamicValueSchema } from '@bote/a2ui-custom-kit';

export const PresetPieChartApi = defineComponentApi({
  name: 'PresetPieChart',
  shape: {
    /** 数据：Array<{ label: string, value: number, color?: string }> */
    data: DynamicValueSchema,
    /** 内半径（像素），0 为实心饼图，非 0 为环形图 */
    innerRadius: z.number().optional(),
    /** 是否显示图例 */
    showLegend: z.boolean().optional(),
  },
});
