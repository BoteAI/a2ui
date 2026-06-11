/**
 * 本文件由 scripts/sync-preset-artifacts.mjs 自动生成，请勿手改。
 * 源: src/presetComp/manifest.ts
 */
import { mergeRegistryEntries } from '@bote/a2ui-custom-kit';
import { a2uiRemoteRegistry as PresetBadge } from './PresetBadge/index';
import { a2uiRemoteRegistry as PresetBarChart } from './PresetBarChart/index';
import { a2uiRemoteRegistry as PresetButton } from './PresetButton/index';
import { a2uiRemoteRegistry as PresetColumn } from './PresetColumn/index';
import { a2uiRemoteRegistry as PresetDashboardCard } from './PresetDashboardCard/index';
import { a2uiRemoteRegistry as PresetDataTable } from './PresetDataTable/index';
import { a2uiRemoteRegistry as PresetFlightCard } from './PresetFlightCard/index';
import { a2uiRemoteRegistry as PresetMetric } from './PresetMetric/index';
import { a2uiRemoteRegistry as PresetPieChart } from './PresetPieChart/index';
import { a2uiRemoteRegistry as PresetRow } from './PresetRow/index';
import { a2uiRemoteRegistry as PresetSelect } from './PresetSelect/index';
import { a2uiRemoteRegistry as PresetTitle } from './PresetTitle/index';

export const a2uiPresetComponentRegistry = mergeRegistryEntries(
  PresetBadge,
  PresetBarChart,
  PresetButton,
  PresetColumn,
  PresetDashboardCard,
  PresetDataTable,
  PresetFlightCard,
  PresetMetric,
  PresetPieChart,
  PresetRow,
  PresetSelect,
  PresetTitle,
);
