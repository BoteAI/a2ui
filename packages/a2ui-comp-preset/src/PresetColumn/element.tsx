import React from 'react';
import { createReactComponent, ensureComponentStyles, type A2UICustomElementHost } from '@boteai/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetColumnApi } from './api';
import { PresetColumnWidget } from './PresetColumnWidget';
import { useColumnBinding } from './useColumnBinding';
import styles from './styles.generated';

const STYLE_KEY = 'preset-column';

type ApiProps = z.infer<typeof PresetColumnApi.schema>;

type ColumnHostProps = {
  host: A2UICustomElementHost;
  apiProps: ApiProps;
};

function ColumnHost({ host, apiProps }: ColumnHostProps) {
  const widgetProps = useColumnBinding(host, apiProps);
  return (
    <PresetColumnWidget {...widgetProps}>
      <slot />
    </PresetColumnWidget>
  );
}

export const PresetColumnElement = createReactComponent(PresetColumnApi, ({ props, host }) => {
  ensureComponentStyles(host, STYLE_KEY, styles);
  return <ColumnHost host={host} apiProps={props} />;
});
