import React from 'react';
import { createReactComponent, ensureComponentStyles, type A2UICustomElementHost } from '@bote/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetButtonApi } from './api';
import { PresetButtonWidget } from './PresetButtonWidget';
import { useButtonBinding } from './useButtonBinding';
import styles from './styles.generated';

const STYLE_KEY = 'preset-button';

type ApiProps = z.infer<typeof PresetButtonApi.schema>;

type ButtonHostProps = {
  host: A2UICustomElementHost;
  apiProps: ApiProps;
  buildChild: (childId: string, basePath?: string) => React.ReactNode;
};

function ButtonHost({ host, apiProps, buildChild }: ButtonHostProps) {
  const widgetProps = useButtonBinding(host, apiProps);
  return <PresetButtonWidget {...widgetProps}>{apiProps.child ? buildChild(apiProps.child) : null}</PresetButtonWidget>;
}

export const PresetButtonElement = createReactComponent(PresetButtonApi, ({ props, host, buildChild }) => {
  ensureComponentStyles(host, STYLE_KEY, styles);
  return <ButtonHost host={host} apiProps={props} buildChild={buildChild} />;
});
