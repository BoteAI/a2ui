/**
 * 远程 ESM 入口：yarn build:a2ui → public/PresetRow.mjs
 */
import { defineRegistryEntry, mergeRegistryEntries } from '@bote/a2ui-custom-kit';
import { PresetRowApi } from './api';
import { PresetRowElement } from './element';

/**
 * PresetRow 与原生 Row 结构一致（children + gap + align + justify），
 * 使用原生 Row 的 LitElement tagName（a2ui-basic-row）接管渲染，
 * 原生 LitElement 的 renderNode() 可正确递归渲染子组件；
 * createReactComponent 产出的是无 Shadow DOM 的 HTMLElement，<slot/> 无法投射子组件。
 */
export const a2uiRemoteRegistry = mergeRegistryEntries(defineRegistryEntry(PresetRowApi, PresetRowElement, { tagName: 'a2ui-basic-row' }));
