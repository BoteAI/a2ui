import { defineRegistryEntry, mergeRegistryEntries } from '@boteai/a2ui-custom-kit';
import { DemoActionDispatchApi } from './api';
import { DemoActionDispatchElement } from './element';

export const a2uiRemoteRegistry = mergeRegistryEntries(
  defineRegistryEntry(DemoActionDispatchApi, DemoActionDispatchElement),
);
