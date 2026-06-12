import React from 'react';
import { createReactComponent, ensureComponentStyles, type A2UICustomElementHost } from '@boteai/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetTitleApi } from './api';
import { PresetTitleWidget } from './PresetTitleWidget';
import { useTitleBinding } from './useTitleBinding';
import styles from './styles.generated';

const STYLE_KEY = 'preset-title';

type ApiProps = z.infer<typeof PresetTitleApi.schema>;

type TitleHostProps = {
  host: A2UICustomElementHost;
  apiProps: ApiProps;
};

function TitleHost({ host, apiProps }: TitleHostProps) {
  const widgetProps = useTitleBinding(host, apiProps);
  return <PresetTitleWidget {...widgetProps} />;
}

export const PresetTitleElement = createReactComponent(PresetTitleApi, ({ props, host }) => {
  ensureComponentStyles(host, STYLE_KEY, styles);
  return <TitleHost host={host} apiProps={props} />;
});
