import React from 'react';
import { createReactComponent, ensureComponentStyles, type A2UICustomElementHost } from '@boteai/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetDashboardCardApi } from './api';
import { PresetDashboardCardWidget } from './PresetDashboardCardWidget';
import { useDashboardCardBinding } from './useDashboardCardBinding';
import styles from './styles.generated';

const STYLE_KEY = 'preset-dashboard-card';

type ApiProps = z.infer<typeof PresetDashboardCardApi.schema>;

type CardHostProps = {
  host: A2UICustomElementHost;
  apiProps: ApiProps;
  buildChild: (childId: string, basePath?: string) => React.ReactNode;
};

function CardHost({ host, apiProps, buildChild }: CardHostProps) {
  const widgetProps = useDashboardCardBinding(host, apiProps);
  return <PresetDashboardCardWidget {...widgetProps}>{apiProps.child ? buildChild(apiProps.child) : null}</PresetDashboardCardWidget>;
}

export const PresetDashboardCardElement = createReactComponent(PresetDashboardCardApi, ({ props, host, buildChild }) => {
  ensureComponentStyles(host, STYLE_KEY, styles);
  return <CardHost host={host} apiProps={props} buildChild={buildChild} />;
});
