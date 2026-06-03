/**
 * 远程 ESM + React 桥：含 createReactComponent，不含 loadRemote，避免主应用能力被打进远程包。
 * 会依赖 react / react-dom，体积显著大于 remote-runtime。
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

export {
  createReactComponent,
  type ReactA2UICustomRenderProps,
} from '../adapter/createReactComponent';

export { ensureComponentStyles } from '../runtime/ensureComponentStyles';
