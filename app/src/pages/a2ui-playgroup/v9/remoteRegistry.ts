import { defineRegistryEntry, mergeRegistryEntries } from '@bote/a2ui-custom-kit';
import type { A2UICustomComponentRegistry } from '@bote/a2ui-custom-kit';
import { DemoNativeElementApi } from '../../a2ui-remote/DemoNativeElement/api';
import { DemoNativeElementElement } from '../../a2ui-remote/DemoNativeElement/element';
import { DemoReactComponentApi } from '../../a2ui-remote/DemoReactComponent/api';
import { DemoReactComponentElement } from '../../a2ui-remote/DemoReactComponent/element';
import { DemoStyledPanelApi } from '../../a2ui-remote/DemoStyledPanel/api';
import { DemoStyledPanelElement } from '../../a2ui-remote/DemoStyledPanel/element';
import { DemoActionDispatchApi } from '../../a2ui-remote/DemoActionDispatch/api';
import { DemoActionDispatchElement } from '../../a2ui-remote/DemoActionDispatch/element';

/** v9 Playground：四个自定义组件 Demo */
export const a2uiV9CustomComponents: A2UICustomComponentRegistry = mergeRegistryEntries(
  defineRegistryEntry(DemoNativeElementApi, DemoNativeElementElement),
  defineRegistryEntry(DemoReactComponentApi, DemoReactComponentElement),
  defineRegistryEntry(DemoStyledPanelApi, DemoStyledPanelElement),
  defineRegistryEntry(DemoActionDispatchApi, DemoActionDispatchElement),
);
