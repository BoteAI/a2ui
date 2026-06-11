/**
 * 远程 ESM 入口：yarn build:a2ui → public/PresetPieChart.mjs
 */
import { defineRegistryEntry, mergeRegistryEntries } from '@bote/a2ui-custom-kit';
import { PresetPieChartApi } from './api';
import { PresetPieChartElement } from './element';

export const a2uiRemoteRegistry = mergeRegistryEntries(defineRegistryEntry(PresetPieChartApi, PresetPieChartElement));
