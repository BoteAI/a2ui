/**
 * 远程 ESM 入口：yarn build:a2ui → public/PresetDashboardCard.mjs
 */
import { defineRegistryEntry, mergeRegistryEntries } from '@boteai/a2ui-custom-kit';
import { PresetDashboardCardApi } from './api';
import { PresetDashboardCardElement } from './element';

export const a2uiRemoteRegistry = mergeRegistryEntries(defineRegistryEntry(PresetDashboardCardApi, PresetDashboardCardElement));
