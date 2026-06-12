import { useMemo } from 'react';
import { resolveBoundValueRaw, type A2UICustomElementHost } from '@boteai/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetBarChartApi } from './api';
import type { PresetBarChartWidgetProps, BarDataItem } from './PresetBarChartWidget';

type ApiProps = z.infer<typeof PresetBarChartApi.schema>;

function parseData(raw: unknown): BarDataItem[] {
  if (Array.isArray(raw)) return raw as BarDataItem[];
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as BarDataItem[];
    } catch {
      /* ignore */
    }
  }
  return [];
}

export function useBarChartBinding(host: A2UICustomElementHost, apiProps: ApiProps): PresetBarChartWidgetProps {
  const rawData = useMemo(() => {
    const resolved = resolveBoundValueRaw(host, apiProps.data);
    return parseData(resolved);
  }, [host, apiProps.data]);

  const color = useMemo(() => apiProps.color || '#3b82f6', [apiProps.color]);
  const valuePrefix = useMemo(() => apiProps.valuePrefix || '', [apiProps.valuePrefix]);
  const valueSuffix = useMemo(() => apiProps.valueSuffix || '', [apiProps.valueSuffix]);

  return { data: rawData, color, valuePrefix, valueSuffix };
}
