import {
  defineRegistryEntry,
  mergeRegistryEntries,
} from '@boteteam/a2ui-custom-kit';
import type { A2UICustomComponentRegistry } from '@boteteam/a2ui-custom-kit';

import { BizTagApi, BizTagElement } from './BizTagElement';
import { DemoReactTitleApi, DemoReactTitleElement } from './DemoReactTitleElement';

export { BizTagApi, BizTagElement } from './BizTagElement';
export { DemoReactTitleApi, DemoReactTitleElement } from './DemoReactTitleElement';

/** A2UITest 与业务页共用的自定义组件注册表（defineRegistryEntry 首参须为 defineComponentApi 产物） */
export const a2uiTestCustomComponents: A2UICustomComponentRegistry = mergeRegistryEntries(
  defineRegistryEntry(DemoReactTitleApi, DemoReactTitleElement),
  defineRegistryEntry(BizTagApi, BizTagElement, { tagName: 'biz-tag' }),
);
