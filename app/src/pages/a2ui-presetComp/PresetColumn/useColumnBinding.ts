import { useMemo } from 'react';
import type { A2UICustomElementHost } from '@boteai/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetColumnApi } from './api';
import type { PresetColumnWidgetProps, ColumnAlign } from './PresetColumnWidget';

type ApiProps = z.infer<typeof PresetColumnApi.schema>;

const ALL_ALIGNS: ColumnAlign[] = ['start', 'center', 'end', 'stretch'];

function readAlign(raw: unknown): ColumnAlign {
  if (typeof raw === 'string' && ALL_ALIGNS.includes(raw as ColumnAlign)) return raw as ColumnAlign;
  return 'stretch';
}

export function useColumnBinding(_host: A2UICustomElementHost, apiProps: ApiProps): PresetColumnWidgetProps {
  const gap = useMemo(() => apiProps.gap ?? 12, [apiProps.gap]);
  const align = useMemo(() => readAlign(apiProps.align), [apiProps.align]);

  return { gap, align };
}
