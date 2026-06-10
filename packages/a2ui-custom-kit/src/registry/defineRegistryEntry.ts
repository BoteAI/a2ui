import type { ComponentApi } from '../schema/webCoreV09Shim';
import type { A2UICustomElementDefinition } from '../types/customRegistry';
import { componentApiToJsonSchema2019 } from '../schema/defineComponentApi';

export type DefineRegistryEntryOptions = {
  tagName?: string;
};

/**
 * 将 ComponentApi + 自定义元素构造器 转为 BaseRenderer customComponents 的一项。
 * key 与 api.name 一致，schema 由 Zod 自动转 JSON Schema。
 */
export function defineRegistryEntry(
  api: ComponentApi,
  elementCtor: CustomElementConstructor,
  options?: DefineRegistryEntryOptions,
): Record<string, A2UICustomElementDefinition> {
  return {
    [api.name]: {
      elementCtor,
      tagName: options?.tagName,
      schema: componentApiToJsonSchema2019(api),
    },
  };
}

/** 无 schema 的简易注册，适合内部 Demo 或 props 结构尚未稳定时 */
export function defineSimpleRegistryEntry(
  name: string,
  elementCtor: CustomElementConstructor,
  options?: DefineRegistryEntryOptions & { schema?: unknown },
): Record<string, A2UICustomElementDefinition> {
  if (options?.schema !== undefined || options?.tagName) {
    return {
      [name]: {
        elementCtor,
        tagName: options?.tagName,
        schema: options?.schema,
      },
    };
  }
  return { [name]: elementCtor };
}

export function mergeRegistryEntries(
  ...entries: Record<string, A2UICustomElementDefinition>[]
): Record<string, A2UICustomElementDefinition> {
  return Object.assign({}, ...entries);
}
