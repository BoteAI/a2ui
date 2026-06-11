/**
 * 远程 ESM 入口：yarn build:a2ui → public/PresetMetric.mjs
 */
import { defineRegistryEntry, mergeRegistryEntries } from '@bote/a2ui-custom-kit';
import { PresetMetricApi } from './api';
import { PresetMetricElement } from './element';

export const a2uiRemoteRegistry = mergeRegistryEntries(defineRegistryEntry(PresetMetricApi, PresetMetricElement));
