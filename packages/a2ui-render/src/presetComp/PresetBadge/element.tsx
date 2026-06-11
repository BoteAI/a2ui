import React from 'react';
import { createReactComponent, ensureComponentStyles, type A2UICustomElementHost } from '@bote/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetBadgeApi } from './api';
import { PresetBadgeWidget } from './PresetBadgeWidget';
import { useBadgeBinding } from './useBadgeBinding';
import styles from './styles.generated';

const STYLE_KEY = 'preset-badge';

type ApiProps = z.infer<typeof PresetBadgeApi.schema>;

type BadgeHostProps = {
  host: A2UICustomElementHost;
  apiProps: ApiProps;
};

function BadgeHost({ host, apiProps }: BadgeHostProps) {
  const widgetProps = useBadgeBinding(host, apiProps);
  return <PresetBadgeWidget {...widgetProps} />;
}

export const PresetBadgeElement = createReactComponent(PresetBadgeApi, ({ props, host }) => {
  ensureComponentStyles(host, STYLE_KEY, styles);
  return <BadgeHost host={host} apiProps={props} />;
});
