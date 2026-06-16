import { defineRegistryEntry, mergeRegistryEntries } from '@boteai/a2ui-custom-kit';
import type { A2UICustomComponentRegistry } from '@boteai/a2ui-custom-kit';
import { a2uiPresetComponentRegistry } from '@boteai/a2ui-comp-preset';
import { DemoNativeElementApi } from '../../a2ui-remote/DemoNativeElement/api';
import { DemoNativeElementElement } from '../../a2ui-remote/DemoNativeElement/element';
import { DemoReactComponentApi } from '../../a2ui-remote/DemoReactComponent/api';
import { DemoReactComponentElement } from '../../a2ui-remote/DemoReactComponent/element';
import { DemoStyledPanelApi } from '../../a2ui-remote/DemoStyledPanel/api';
import { DemoStyledPanelElement } from '../../a2ui-remote/DemoStyledPanel/element';
import { DemoActionDispatchApi } from '../../a2ui-remote/DemoActionDispatch/api';
import { DemoActionDispatchElement } from '../../a2ui-remote/DemoActionDispatch/element';

/** v9 Playground：内置 Preset 组件 + 四个自定义组件 Demo */
export const a2uiV9CustomComponents: A2UICustomComponentRegistry = mergeRegistryEntries(
  a2uiPresetComponentRegistry,
  defineRegistryEntry(DemoNativeElementApi, DemoNativeElementElement),
  defineRegistryEntry(DemoReactComponentApi, DemoReactComponentElement),
  defineRegistryEntry(DemoStyledPanelApi, DemoStyledPanelElement),
  defineRegistryEntry(DemoActionDispatchApi, DemoActionDispatchElement),
);
