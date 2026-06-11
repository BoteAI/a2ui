import { defineRegistryEntry, mergeRegistryEntries } from '@boteai/a2ui-custom-kit';
import { DemoStyledPanelApi } from './api';
import { DemoStyledPanelElement } from './element';

export const a2uiRemoteRegistry = mergeRegistryEntries(
  defineRegistryEntry(DemoStyledPanelApi, DemoStyledPanelElement),
);
