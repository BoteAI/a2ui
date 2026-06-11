/**
 * 本文件由 scripts/sync-preset-artifacts.mjs 自动生成，请勿手改。
 * 源: src/presetComp/manifest.ts
 */
import { componentApiToJsonSchema2019 } from '@bote/a2ui-custom-kit';
import { PresetBadgeApi } from '../src/presetComp/PresetBadge/api';
import { PresetBarChartApi } from '../src/presetComp/PresetBarChart/api';
import { PresetButtonApi } from '../src/presetComp/PresetButton/api';
import { PresetColumnApi } from '../src/presetComp/PresetColumn/api';
import { PresetDashboardCardApi } from '../src/presetComp/PresetDashboardCard/api';
import { PresetDataTableApi } from '../src/presetComp/PresetDataTable/api';
import { PresetFlightCardApi } from '../src/presetComp/PresetFlightCard/api';
import { PresetMetricApi } from '../src/presetComp/PresetMetric/api';
import { PresetPieChartApi } from '../src/presetComp/PresetPieChart/api';
import { PresetRowApi } from '../src/presetComp/PresetRow/api';
import { PresetSelectApi } from '../src/presetComp/PresetSelect/api';
import { PresetTitleApi } from '../src/presetComp/PresetTitle/api';

export const schemaRegistry = [
  { name: 'PresetBadge', api: PresetBadgeApi },
  { name: 'PresetBarChart', api: PresetBarChartApi },
  { name: 'PresetButton', api: PresetButtonApi },
  { name: 'PresetColumn', api: PresetColumnApi },
  { name: 'PresetDashboardCard', api: PresetDashboardCardApi },
  { name: 'PresetDataTable', api: PresetDataTableApi },
  { name: 'PresetFlightCard', api: PresetFlightCardApi },
  { name: 'PresetMetric', api: PresetMetricApi },
  { name: 'PresetPieChart', api: PresetPieChartApi },
  { name: 'PresetRow', api: PresetRowApi },
  { name: 'PresetSelect', api: PresetSelectApi },
  { name: 'PresetTitle', api: PresetTitleApi },
] as const;

export function buildSchemaDocuments() {
  return schemaRegistry.map(({ name, api }) => ({
    name,
    json: componentApiToJsonSchema2019(api),
  }));
}
