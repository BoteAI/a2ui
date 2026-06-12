/**
 * 远程 ESM 入口：yarn build:a2ui → public/PresetFlightCard.mjs
 */
import { defineRegistryEntry, mergeRegistryEntries } from '@boteai/a2ui-custom-kit';
import { PresetFlightCardApi } from './api';
import { PresetFlightCardElement } from './element';

export const a2uiRemoteRegistry = mergeRegistryEntries(defineRegistryEntry(PresetFlightCardApi, PresetFlightCardElement));
