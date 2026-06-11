/**
 * 远程 ESM 入口：yarn build:a2ui → public/PresetSelect.mjs
 */
import { defineRegistryEntry, mergeRegistryEntries } from '@bote/a2ui-custom-kit';
import { PresetSelectApi } from './api';
import { PresetSelectElement } from './element';

export const a2uiRemoteRegistry = mergeRegistryEntries(defineRegistryEntry(PresetSelectApi, PresetSelectElement));
