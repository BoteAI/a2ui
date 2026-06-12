import { z } from 'zod';
import { DynamicStringSchema, type ComponentApi } from './webCoreV09Shim';
import { zodToJsonSchema } from 'zod-to-json-schema';

const zodToJsonSchema2019 = zodToJsonSchema as unknown as (
  schema: z.ZodTypeAny,
  options: { target: 'jsonSchema2019-09' },
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
  });
}

export type { ComponentApi };
