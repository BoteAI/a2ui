/**
 * 远程 ESM 打包专用入口：不含 React 桥、不含 loadRemote 等主应用能力。
 * remote-comp 的 build:a2ui-esm 应从此子路径 import，避免把 react-dom 打进 .mjs。
 */
export {
  defineComponentApi,
  componentApiToJsonSchema2019,
  DynString,
  type ComponentApi,
} from '../schema/defineComponentApi';

export {
  ActionSchema,
  ChildListSchema,
  ComponentIdSchema,
  DynamicValueSchema,
} from '../schema/webCoreV09Shim';

export {
  readComponentProps,
  readStringProp,
  readNumberProp,
  readBoundPath,
  resolveBoundValue,
  writeBoundValue,
  dispatchA2UIAction,
  dispatchDeclaredAction,
  type A2UICustomElementHost,
} from '../runtime/elementHost';

export {
  subscribeV09ComponentUpdates,
  runAfterPropsReady,
} from '../runtime/subscribeV09Updates';

export type {
  A2UIV09ElementContext,
  A2UIActionDetail,
  A2UIActionPayload,
} from '../runtime/types';

export {
  defineRegistryEntry,
  defineSimpleRegistryEntry,
  mergeRegistryEntries,
} from '../registry/defineRegistryEntry';

export { createNativeElement, type NativeElementLifecycle } from '../adapter/createNativeElement';

export { ensureComponentStyles } from '../runtime/ensureComponentStyles';
