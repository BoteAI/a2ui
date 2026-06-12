/**
 * 远程 ESM 入口：yarn build:a2ui → public/PresetDataTable.mjs
 */
import { defineRegistryEntry, mergeRegistryEntries } from '@boteai/a2ui-custom-kit';
import { PresetDataTableApi } from './api';
import { PresetDataTableElement } from './element';

export const a2uiRemoteRegistry = mergeRegistryEntries(defineRegistryEntry(PresetDataTableApi, PresetDataTableElement));
