import { z } from 'zod';
import { defineComponentApi, DynString, ActionSchema } from '@boteai/a2ui-custom-kit';

export const PresetSelectApi = defineComponentApi({
  name: 'PresetSelect',
  shape: {
    /** 选中值，单选为 string，多选为逗号分隔字符串；支持 path 绑定 */
    value: DynString.optional(),
    /** 下拉选项，JSON 数组字符串，如 '[{"label":"A","value":"a"}]' */
    options: DynString.optional(),
    /** 模式：single 单选 | multiple 多选 */
    mode: z.enum(['single', 'multiple']).optional(),
    /** 占位文本 */
    placeholder: DynString.optional(),
    /** 是否禁用 */
    disabled: z.boolean().optional(),
    /** 是否可搜索 */
    showSearch: z.boolean().optional(),
    /** 是否可清除 */
    allowClear: z.boolean().optional(),
    /** 点击/变更动作，由 Agent 在协议里配置 */
    action: ActionSchema.optional(),
  },
});
