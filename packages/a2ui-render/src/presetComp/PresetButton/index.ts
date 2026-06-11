/**
 * 远程 ESM 入口：yarn build:a2ui → public/PresetButton.mjs
 */
import { defineRegistryEntry, mergeRegistryEntries } from '@bote/a2ui-custom-kit';
import { PresetButtonApi } from './api';
import { PresetButtonElement } from './element';

export const a2uiRemoteRegistry = mergeRegistryEntries(defineRegistryEntry(PresetButtonApi, PresetButtonElement));
