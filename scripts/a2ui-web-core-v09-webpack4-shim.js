/**
 * Umi3 所用 Webpack4 无法解析 @a2ui/web_core v0_9 主入口中的
 * import … json with type json 语法。
 * 本文件与官方 src/v0_9/index.js 的 export 组合对齐，但不包含 Schemas 的 JSON 内联导入。
 * 当前仓库 A2UI 链路仅依赖 Catalog、MessageProcessor、DynamicStringSchema 与类型等，不依赖 Schemas。
 */
export * from '../node_modules/@a2ui/web_core/src/v0_9/catalog/function_invoker.js';
export * from '../node_modules/@a2ui/web_core/src/v0_9/catalog/types.js';
export * from '../node_modules/@a2ui/web_core/src/v0_9/common/events.js';
export * from '../node_modules/@a2ui/web_core/src/v0_9/processing/message-processor.js';
export * from '../node_modules/@a2ui/web_core/src/v0_9/rendering/component-context.js';
export * from '../node_modules/@a2ui/web_core/src/v0_9/rendering/data-context.js';
export * from '../node_modules/@a2ui/web_core/src/v0_9/rendering/generic-binder.js';
export * from '../node_modules/@a2ui/web_core/src/v0_9/schema/index.js';
export * from '../node_modules/@a2ui/web_core/src/v0_9/state/component-model.js';
export * from '../node_modules/@a2ui/web_core/src/v0_9/state/data-model.js';
export * from '../node_modules/@a2ui/web_core/src/v0_9/state/surface-components-model.js';
export * from '../node_modules/@a2ui/web_core/src/v0_9/state/surface-group-model.js';
export * from '../node_modules/@a2ui/web_core/src/v0_9/state/surface-model.js';
export * from '../node_modules/@a2ui/web_core/src/v0_9/errors.js';
export { effect, Signal, signal, computed } from '@preact/signals-core';
