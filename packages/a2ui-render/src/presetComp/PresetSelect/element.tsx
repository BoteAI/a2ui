import React from 'react';
import { createReactComponent, ensureComponentStyles, type A2UICustomElementHost } from '@bote/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetSelectApi } from './api';
import { SelectWidget } from './SelectWidget';
import { useSelectBinding } from './useSelectBinding';
import styles from './styles.generated';

const STYLE_KEY = 'preset-select';

type ApiProps = z.infer<typeof PresetSelectApi.schema>;

type SelectHostProps = {
  host: A2UICustomElementHost;
  apiProps: ApiProps;
};

function SelectHost({ host, apiProps }: SelectHostProps) {
  const selectProps = useSelectBinding(host, apiProps);
  return <SelectWidget {...selectProps} />;
}

export const PresetSelectElement = createReactComponent(PresetSelectApi, ({ props, host }) => {
  ensureComponentStyles(host, STYLE_KEY, styles);
  return <SelectHost host={host} apiProps={props} />;
});
