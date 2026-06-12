import { z } from 'zod';
import { defineComponentApi } from '@boteai/a2ui-custom-kit';
import { DynamicValueSchema } from '@boteai/a2ui-custom-kit';

export const PresetBarChartApi = defineComponentApi({
  name: 'PresetBarChart',
  shape: {
    /** 数据：Array<{ label: string, value: number }> */
    data: DynamicValueSchema,
    /** 柱体填充色 */
    color: z.string().optional(),
    /** Y 轴数值前缀（如 "$"） */
    valuePrefix: z.string().optional(),
    /** Y 轴数值后缀（如 "K"） */
    valueSuffix: z.string().optional(),
  },
});
