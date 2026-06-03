/**
 * 与 `@a2ui/web_core` v0.9 `schema/common-types.js` 中公共类型一致。
 *
 * Umi Webpack 4 无法解析 `package.json` 的 `exports` 子路径（如 `@a2ui/web_core/v0_9`），故在本包内联；
 * 升级 `@a2ui/web_core` 时请对照 `src/v0_9/schema/common-types.js` 同步本文件。
 */
import { z, type ZodTypeAny } from 'zod';

const DataBindingSchema = z
  .object({
    path: z.string().describe('A JSON Pointer path to a value in the data model.'),
  })
  .describe('REF:common_types.json#/$defs/DataBinding|A JSON Pointer path to a value in the data model.');

const FunctionCallSchema = z
  .object({
    call: z.string().describe('The name of the function to call.'),
    args: z.record(z.any()).describe('Arguments passed to the function.'),
    returnType: z
      .enum(['string', 'number', 'boolean', 'array', 'object', 'any', 'void'])
      .default('boolean'),
  })
  .describe('REF:common_types.json#/$defs/FunctionCall|Invokes a named function on the client.');

/** 与官方 `DynamicString` 一致 */
export const DynamicStringSchema = z
  .union([
    z.string(),
    DataBindingSchema,
    // FunctionCall returning string（与 web_core 注释一致）
    FunctionCallSchema,
  ])
  .describe('REF:common_types.json#/$defs/DynamicString|Represents a string');

/** 与官方 `DynamicValue` 一致 */
export const DynamicValueSchema = z
  .union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.any()),
    DataBindingSchema,
    FunctionCallSchema,
  ])
  .describe(
    'REF:common_types.json#/$defs/DynamicValue|A value that can be a literal, a path, or a function call returning any type.',
  );

/** 与官方 `ComponentId` 一致 */
export const ComponentIdSchema = z
  .string()
  .describe('REF:common_types.json#/$defs/ComponentId|The unique identifier for a component.');

/** 与官方 `ChildList` 一致 */
export const ChildListSchema = z
  .union([
    z.array(ComponentIdSchema).describe('A static list of child component IDs.'),
    z
      .object({
        componentId: ComponentIdSchema,
        path: z
          .string()
          .describe('The path to the list of component property objects in the data model.'),
      })
      .describe('A template for generating a dynamic list of children.'),
  ])
  .describe('REF:common_types.json#/$defs/ChildList');

/** 与官方 `Action` 一致 */
export const ActionSchema = z
  .union([
    z
      .object({
        event: z.object({
          name: z.string(),
          context: z.record(DynamicValueSchema).optional(),
        }),
      })
      .describe('Triggers a server-side event.'),
    z
      .object({
        functionCall: FunctionCallSchema,
      })
      .describe('Executes a local client-side function.'),
  ])
  .describe('REF:common_types.json#/$defs/Action');

/** 与 `@a2ui/web_core` v0.9 `catalog/types` 中 ComponentApi 一致 */
export interface ComponentApi<Schema extends ZodTypeAny = ZodTypeAny> {
  readonly name: string;
  readonly schema: Schema;
}
