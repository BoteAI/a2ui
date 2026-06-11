/**
 * 远程 ESM 入口：yarn build:a2ui → public/PresetBarChart.mjs
 */
import { defineRegistryEntry, mergeRegistryEntries } from '@bote/a2ui-custom-kit';
import { PresetBarChartApi } from './api';
import { PresetBarChartElement } from './element';

export const a2uiRemoteRegistry = mergeRegistryEntries(defineRegistryEntry(PresetBarChartApi, PresetBarChartElement));
