import { z } from 'zod';
import { defineComponentApi, DynamicValueSchema } from '@boteai/a2ui-custom-kit';

export const PresetDataTableApi = defineComponentApi({
  name: 'PresetDataTable',
  shape: {
    /** 列定义：Array<{ key: string, label: string }> */
    columns: z.array(z.object({ key: z.string(), label: z.string() }).strict()),
    /** 行数据：Array<Record<string, any>> 或 {"path":"/data/path"} 数据绑定 */
    rows: DynamicValueSchema,
  },
});
