import { useMemo } from 'react';
import type { A2UICustomElementHost } from '@boteai/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetRowApi } from './api';
import type { PresetRowWidgetProps, RowAlign, RowJustify } from './PresetRowWidget';

type ApiProps = z.infer<typeof PresetRowApi.schema>;

const ALL_ALIGNS: RowAlign[] = ['start', 'center', 'end', 'stretch'];
const ALL_JUSTIFIES: RowJustify[] = ['start', 'center', 'end', 'spaceBetween', 'spaceAround', 'spaceEvenly', 'stretch'];

function readAlign(raw: unknown): RowAlign {
  if (typeof raw === 'string' && ALL_ALIGNS.includes(raw as RowAlign)) return raw as RowAlign;
  return 'stretch';
}

function readJustify(raw: unknown): RowJustify {
  if (typeof raw === 'string' && ALL_JUSTIFIES.includes(raw as RowJustify)) return raw as RowJustify;
  return 'start';
}

export function useRowBinding(_host: A2UICustomElementHost, apiProps: ApiProps): PresetRowWidgetProps {
  const gap = useMemo(() => apiProps.gap ?? 16, [apiProps.gap]);
  const align = useMemo(() => readAlign(apiProps.align), [apiProps.align]);
  const justify = useMemo(() => readJustify(apiProps.justify), [apiProps.justify]);

  return { gap, align, justify };
}
