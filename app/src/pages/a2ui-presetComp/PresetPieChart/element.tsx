import React from 'react';
import { createReactComponent, ensureComponentStyles, type A2UICustomElementHost } from '@boteai/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetPieChartApi } from './api';
import { PresetPieChartWidget } from './PresetPieChartWidget';
import { usePieChartBinding } from './usePieChartBinding';
import styles from './styles.generated';

const STYLE_KEY = 'preset-pie-chart';

type ApiProps = z.infer<typeof PresetPieChartApi.schema>;

type PieChartHostProps = {
  host: A2UICustomElementHost;
  apiProps: ApiProps;
};

function PieChartHost({ host, apiProps }: PieChartHostProps) {
  const widgetProps = usePieChartBinding(host, apiProps);
  return <PresetPieChartWidget {...widgetProps} />;
}

export const PresetPieChartElement = createReactComponent(PresetPieChartApi, ({ props, host }) => {
  ensureComponentStyles(host, STYLE_KEY, styles);
  return <PieChartHost host={host} apiProps={props} />;
});
