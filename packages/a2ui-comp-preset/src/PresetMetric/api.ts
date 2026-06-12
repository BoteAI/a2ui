import { z } from 'zod';
import { defineComponentApi, DynString } from '@boteai/a2ui-custom-kit';

export const PresetMetricApi = defineComponentApi({
  name: 'PresetMetric',
  shape: {
    /** 上方小标签 */
    label: DynString,
    /** 主数值/文本 */
    value: DynString.optional(),
    /** 趋势方向 */
    trend: z.enum(['up', 'down', 'neutral']).optional(),
    /** 趋势幅度文本（如 "+8.2%"） */
    trendValue: DynString.optional(),
  },
});
