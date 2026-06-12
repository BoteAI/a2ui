import { useMemo } from 'react';
import { resolveBoundValueRaw, type A2UICustomElementHost } from '@boteai/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetDataTableApi } from './api';
import type { PresetDataTableWidgetProps } from './PresetDataTableWidget';

type ApiProps = z.infer<typeof PresetDataTableApi.schema>;

function toArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as T[];
    } catch {
      /* ignore */
    }
  }
  return [];
}

export function useDataTableBinding(host: A2UICustomElementHost, apiProps: ApiProps): PresetDataTableWidgetProps {
  const columns = useMemo(() => {
    const resolved = resolveBoundValueRaw(host, apiProps.columns);
    return toArray(resolved) as PresetDataTableWidgetProps['columns'];
  }, [host, apiProps.columns]);

  const rows = useMemo(() => {
    const resolved = resolveBoundValueRaw(host, apiProps.rows);
    return toArray(resolved) as PresetDataTableWidgetProps['rows'];
  }, [host, apiProps.rows]);

  return { columns, rows };
}
