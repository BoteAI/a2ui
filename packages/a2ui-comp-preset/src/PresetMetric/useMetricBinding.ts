import { useMemo } from 'react';
import { resolveBoundValue, type A2UICustomElementHost } from '@boteai/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetMetricApi } from './api';
import type { PresetMetricWidgetProps, MetricTrend } from './PresetMetricWidget';

type ApiProps = z.infer<typeof PresetMetricApi.schema>;

const ALL_TRENDS: MetricTrend[] = ['up', 'down', 'neutral'];

function readLiteralTrend(raw: unknown): MetricTrend | undefined {
  if (typeof raw === 'string' && ALL_TRENDS.includes(raw as MetricTrend)) {
    return raw as MetricTrend;
  }
  return undefined;
}

export function useMetricBinding(host: A2UICustomElementHost, apiProps: ApiProps): PresetMetricWidgetProps {
  const label = useMemo(() => resolveBoundValue(host, apiProps.label) || '', [host, apiProps.label]);
  const value = useMemo(() => resolveBoundValue(host, apiProps.value) || '', [host, apiProps.value]);
  const trend = useMemo(() => readLiteralTrend(apiProps.trend), [apiProps.trend]);
  const trendValue = useMemo(() => (apiProps.trendValue != null ? resolveBoundValue(host, apiProps.trendValue) : ''), [host, apiProps.trendValue]);

  return { label, value, trend, trendValue };
}
