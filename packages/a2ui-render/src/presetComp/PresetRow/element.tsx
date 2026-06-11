import React from 'react';
import { createReactComponent, ensureComponentStyles, type A2UICustomElementHost } from '@bote/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetRowApi } from './api';
import { PresetRowWidget } from './PresetRowWidget';
import { useRowBinding } from './useRowBinding';
import styles from './styles.generated';

const STYLE_KEY = 'preset-row';

type ApiProps = z.infer<typeof PresetRowApi.schema>;

type RowHostProps = {
  host: A2UICustomElementHost;
  apiProps: ApiProps;
};

function RowHost({ host, apiProps }: RowHostProps) {
  const widgetProps = useRowBinding(host, apiProps);
  return (
    <PresetRowWidget {...widgetProps}>
      <slot />
    </PresetRowWidget>
  );
}

export const PresetRowElement = createReactComponent(PresetRowApi, ({ props, host }) => {
  ensureComponentStyles(host, STYLE_KEY, styles);
  return <RowHost host={host} apiProps={props} />;
});
