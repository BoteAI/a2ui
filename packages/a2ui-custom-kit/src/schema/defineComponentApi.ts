import { z } from 'zod';
import { DynamicStringSchema, type ComponentApi } from './webCoreV09Shim';
import { zodToJsonSchema } from 'zod-to-json-schema';

const zodToJsonSchema2019 = zodToJsonSchema as unknown as (
  schema: z.ZodTypeAny,
  options: { target: 'jsonSchema2019-09'; $refStrategy?: 'none' | 'root' | 'relative' | 'seen' },
) => Record<string, unknown>;

/** 支持 literalString 或 path 绑定的动态字符串，与官方 Catalog 一致 */
export const DynString = DynamicStringSchema;

export type DefineComponentApiOptions = {
  name: string;
  shape: z.ZodRawShape;
};

/** 声明自定义组件 API，产出 ComponentApi 供 schema 与类型推断使用 */
export function defineComponentApi<S extends z.ZodRawShape>(
  options: DefineComponentApiOptions & { shape: S },
): ComponentApi<z.ZodObject<S, 'strict'>> {
  return {
    name: options.name,
    schema: z.object(options.shape).strict(),
  };
}

export function componentApiToJsonSchema2019(api: ComponentApi): Record<string, unknown> {
  return zodToJsonSchema2019(api.schema, {
    target: 'jsonSchema2019-09',
    // 多个字段共用 DynString 等单例 Zod schema 时，默认 root 策略会生成 #/properties/xxx 内部引用，
    // 下游 Agent catalog 与 PageConfigA2ui 无法识别；改为 none 让每个字段独立内联后再 rewrite 为外部 $ref。
    $refStrategy: 'none',
  });
}

export type { ComponentApi };
