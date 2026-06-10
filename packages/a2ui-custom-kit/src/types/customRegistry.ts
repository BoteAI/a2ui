/**
 * A2UI 自定义组件注册表：与 `@bote/a2ui-render` 的 `BaseRenderer` 的 `customComponents` 一致。
 * 由 `@bote/a2ui-custom-kit` 产出合并结果时，类型与此对齐。
 */

/** 自定义 Lit 组件定义：可直接传构造器，或传包含 tagName、schema 的配置对象 */
export type A2UICustomElementDefinition =
  | CustomElementConstructor
  | {
      elementCtor: CustomElementConstructor;
      tagName?: string;
      schema?: unknown;
    };

/** 业务侧自定义组件注册表，key 为 A2UI 协议中的组件名 */
export type A2UICustomComponentRegistry = Record<string, A2UICustomElementDefinition>;
