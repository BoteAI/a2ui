import React from 'react';
import { createReactComponent, ensureComponentStyles, type A2UICustomElementHost } from '@bote/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetBarChartApi } from './api';
import { PresetBarChartWidget } from './PresetBarChartWidget';
import { useBarChartBinding } from './useBarChartBinding';
import styles from './styles.generated';

const STYLE_KEY = 'preset-bar-chart';

type ApiProps = z.infer<typeof PresetBarChartApi.schema>;

type BarChartHostProps = {
  host: A2UICustomElementHost;
  apiProps: ApiProps;
};

function BarChartHost({ host, apiProps }: BarChartHostProps) {
  const widgetProps = useBarChartBinding(host, apiProps);
  return <PresetBarChartWidget {...widgetProps} />;
}

export const PresetBarChartElement = createReactComponent(PresetBarChartApi, ({ props, host }) => {
  ensureComponentStyles(host, STYLE_KEY, styles);
  return <BarChartHost host={host} apiProps={props} />;
});
