/**
 * 远程 ESM 入口：yarn build:a2ui → public/PresetBadge.mjs
 */
import { defineRegistryEntry, mergeRegistryEntries } from '@boteai/a2ui-custom-kit';
import { PresetBadgeApi } from './api';
import { PresetBadgeElement } from './element';

export const a2uiRemoteRegistry = mergeRegistryEntries(defineRegistryEntry(PresetBadgeApi, PresetBadgeElement));
