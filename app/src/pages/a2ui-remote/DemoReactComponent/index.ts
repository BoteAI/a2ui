import { defineRegistryEntry, mergeRegistryEntries } from '@bote/a2ui-custom-kit';
import { DemoReactComponentApi } from './api';
import { DemoReactComponentElement } from './element';

export const a2uiRemoteRegistry = mergeRegistryEntries(
  defineRegistryEntry(DemoReactComponentApi, DemoReactComponentElement),
);
