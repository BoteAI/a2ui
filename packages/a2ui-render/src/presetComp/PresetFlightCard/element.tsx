import React from 'react';
import { createReactComponent, ensureComponentStyles, type A2UICustomElementHost } from '@bote/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetFlightCardApi } from './api';
import { PresetFlightCardWidget } from './PresetFlightCardWidget';
import { useFlightCardBinding } from './useFlightCardBinding';
import styles from './styles.generated';

const STYLE_KEY = 'preset-flight-card';

type ApiProps = z.infer<typeof PresetFlightCardApi.schema>;

type FlightCardHostProps = {
  host: A2UICustomElementHost;
  apiProps: ApiProps;
};

function FlightCardHost({ host, apiProps }: FlightCardHostProps) {
  const widgetProps = useFlightCardBinding(host, apiProps);
  return <PresetFlightCardWidget {...widgetProps} />;
}

export const PresetFlightCardElement = createReactComponent(PresetFlightCardApi, ({ props, host }) => {
  ensureComponentStyles(host, STYLE_KEY, styles);
  return <FlightCardHost host={host} apiProps={props} />;
});
