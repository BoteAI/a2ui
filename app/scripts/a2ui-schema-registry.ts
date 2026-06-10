/**
 * 在此登记需要导出 JSON Schema 的 ComponentApi。
 * 新增远程组件时：在对应目录 export Api 后在此追加一项。
 */
import { componentApiToJsonSchema2019 } from '@bote/a2ui-custom-kit';
import { DemoNativeElementApi } from '../src/pages/a2ui-remote/DemoNativeElement/api';
import { DemoReactComponentApi } from '../src/pages/a2ui-remote/DemoReactComponent/api';
import { DemoStyledPanelApi } from '../src/pages/a2ui-remote/DemoStyledPanel/api';
import { DemoActionDispatchApi } from '../src/pages/a2ui-remote/DemoActionDispatch/api';

export const schemaRegistry = [
  { name: 'DemoNativeElement', api: DemoNativeElementApi },
  { name: 'DemoReactComponent', api: DemoReactComponentApi },
  { name: 'DemoStyledPanel', api: DemoStyledPanelApi },
  { name: 'DemoActionDispatch', api: DemoActionDispatchApi },
] as const;

export function buildSchemaDocuments() {
  return schemaRegistry.map(({ name, api }) => ({
    name,
    json: componentApiToJsonSchema2019(api),
  }));
}
