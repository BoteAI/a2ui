/**
 * 远程 ESM 入口：yarn build:a2ui → public/PresetColumn.mjs
 */
import { defineRegistryEntry, mergeRegistryEntries } from '@boteai/a2ui-custom-kit';
import { PresetColumnApi } from './api';
import { PresetColumnElement } from './element';

/**
 * PresetColumn 与原生 Column 结构一致（children + gap + align），
 * 使用原生 Column 的 LitElement tagName（a2ui-basic-column）接管渲染，
 * 原生 LitElement 的 renderNode() 可正确递归渲染子组件；
 * createReactComponent 产出的是无 Shadow DOM 的 HTMLElement，<slot/> 无法投射子组件。
 */
export const a2uiRemoteRegistry = mergeRegistryEntries(defineRegistryEntry(PresetColumnApi, PresetColumnElement, { tagName: 'a2ui-basic-column' }));
