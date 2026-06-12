/**
 * 远程 ESM 入口：yarn build:a2ui → public/PresetTitle.mjs
 */
import { defineRegistryEntry, mergeRegistryEntries } from '@boteai/a2ui-custom-kit';
import { PresetTitleApi } from './api';
import { PresetTitleElement } from './element';

export const a2uiRemoteRegistry = mergeRegistryEntries(defineRegistryEntry(PresetTitleApi, PresetTitleElement));
