import React from 'react';
import { createReactComponent, ensureComponentStyles, type A2UICustomElementHost } from '@boteai/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetMetricApi } from './api';
import { PresetMetricWidget } from './PresetMetricWidget';
import { useMetricBinding } from './useMetricBinding';
import styles from './styles.generated';

const STYLE_KEY = 'preset-metric';

type ApiProps = z.infer<typeof PresetMetricApi.schema>;

type MetricHostProps = {
  host: A2UICustomElementHost;
  apiProps: ApiProps;
};

function MetricHost({ host, apiProps }: MetricHostProps) {
  const widgetProps = useMetricBinding(host, apiProps);
  return <PresetMetricWidget {...widgetProps} />;
}

export const PresetMetricElement = createReactComponent(PresetMetricApi, ({ props, host }) => {
  ensureComponentStyles(host, STYLE_KEY, styles);
  return <MetricHost host={host} apiProps={props} />;
});
