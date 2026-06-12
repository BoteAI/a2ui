/**
 * Preset 组件唯一清单（SSOT）。
 * 新增预设组件时：在此追加一项，然后执行 npm run build。
 */
export const PRESET_COMPONENTS = [
  'PresetBadge',
  'PresetBarChart',
  'PresetButton',
  'PresetColumn',
  'PresetDashboardCard',
  'PresetDataTable',
  'PresetFlightCard',
  'PresetMetric',
  'PresetPieChart',
  'PresetRow',
  'PresetSelect',
  'PresetTitle',
] as const;

export type a2uiPresetComponentName = (typeof PRESET_COMPONENTS)[number];
