import { defineRegistryEntry, mergeRegistryEntries } from '@bote/a2ui-custom-kit';
import { DemoNativeElementApi } from './api';
import { DemoNativeElementElement } from './element';

export const a2uiRemoteRegistry = mergeRegistryEntries(
  defineRegistryEntry(DemoNativeElementApi, DemoNativeElementElement),
);
