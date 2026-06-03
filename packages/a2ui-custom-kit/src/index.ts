export {
  defineComponentApi,
  componentApiToJsonSchema2019,
  DynString,
  type ComponentApi,
} from './schema/defineComponentApi';

export {
  ActionSchema,
  ChildListSchema,
  ComponentIdSchema,
  DynamicValueSchema,
} from './schema/webCoreV09Shim';

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
} from './runtime/elementHost';

export {
  subscribeV09ComponentUpdates,
  runAfterPropsReady,
} from './runtime/subscribeV09Updates';

export type {
  A2UIV09ElementContext,
  A2UIDeclaredAction,
  A2UIActionDetail,
  A2UIActionPayload,
} from './runtime/types';

export {
  defineRegistryEntry,
  defineSimpleRegistryEntry,
  mergeRegistryEntries,
} from './registry/defineRegistryEntry';

export {
  createReactComponent,
  type ReactA2UICustomRenderProps,
} from './adapter/createReactComponent';

export {
  createNativeElement,
  type NativeElementLifecycle,
} from './adapter/createNativeElement';

export { ensureComponentStyles } from './runtime/ensureComponentStyles';

export type { A2UICustomElementDefinition, A2UICustomComponentRegistry } from './types/customRegistry';
