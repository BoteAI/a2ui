import { useMemo } from 'react';
import { resolveBoundValue, type A2UICustomElementHost } from '@boteai/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetDashboardCardApi } from './api';
import type { PresetDashboardCardWidgetProps } from './PresetDashboardCardWidget';

type ApiProps = z.infer<typeof PresetDashboardCardApi.schema>;

export function useDashboardCardBinding(host: A2UICustomElementHost, apiProps: ApiProps): PresetDashboardCardWidgetProps {
  const title = useMemo(() => resolveBoundValue(host, apiProps.title) || '', [host, apiProps.title]);
  const subtitle = useMemo(() => (apiProps.subtitle != null ? resolveBoundValue(host, apiProps.subtitle) : ''), [host, apiProps.subtitle]);

  return { title, subtitle };
}
