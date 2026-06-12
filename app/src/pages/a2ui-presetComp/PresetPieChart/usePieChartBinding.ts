import { useMemo } from 'react';
import { resolveBoundValueRaw, type A2UICustomElementHost } from '@boteai/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetPieChartApi } from './api';
import type { PresetPieChartWidgetProps, PieDataItem } from './PresetPieChartWidget';

type ApiProps = z.infer<typeof PresetPieChartApi.schema>;

function parseData(raw: unknown): PieDataItem[] {
  if (Array.isArray(raw)) return raw as PieDataItem[];
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as PieDataItem[];
    } catch {
      /* ignore */
    }
  }
  return [];
}

export function usePieChartBinding(host: A2UICustomElementHost, apiProps: ApiProps): PresetPieChartWidgetProps {
  const rawData = useMemo(() => {
    const resolved = resolveBoundValueRaw(host, apiProps.data);
    return parseData(resolved);
  }, [host, apiProps.data]);

  const innerRadius = useMemo(() => apiProps.innerRadius ?? 40, [apiProps.innerRadius]);
  const showLegend = useMemo(() => apiProps.showLegend ?? false, [apiProps.showLegend]);

  return { data: rawData, innerRadius, showLegend };
}
