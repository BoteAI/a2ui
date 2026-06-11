import React from 'react';
import { createReactComponent, ensureComponentStyles, type A2UICustomElementHost } from '@bote/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetDataTableApi } from './api';
import { PresetDataTableWidget } from './PresetDataTableWidget';
import { useDataTableBinding } from './useDataTableBinding';
import styles from './styles.generated';

const STYLE_KEY = 'preset-data-table';

type ApiProps = z.infer<typeof PresetDataTableApi.schema>;

type TableHostProps = {
  host: A2UICustomElementHost;
  apiProps: ApiProps;
};

function TableHost({ host, apiProps }: TableHostProps) {
  const widgetProps = useDataTableBinding(host, apiProps);
  return <PresetDataTableWidget {...widgetProps} />;
}

export const PresetDataTableElement = createReactComponent(PresetDataTableApi, ({ props, host }) => {
  ensureComponentStyles(host, STYLE_KEY, styles);
  return <TableHost host={host} apiProps={props} />;
});
