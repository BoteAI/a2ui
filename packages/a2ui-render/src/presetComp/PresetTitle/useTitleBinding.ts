import { useMemo } from 'react';
import { resolveBoundValue, type A2UICustomElementHost } from '@bote/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetTitleApi } from './api';
import type { PresetTitleWidgetProps, TitleLevel } from './PresetTitleWidget';

type ApiProps = z.infer<typeof PresetTitleApi.schema>;

function readLiteralLevel(raw: unknown): TitleLevel {
  if (raw === 'h1' || raw === 'h2' || raw === 'h3') return raw;
  return 'h2';
}

export function useTitleBinding(host: A2UICustomElementHost, apiProps: ApiProps): PresetTitleWidgetProps {
  const text = useMemo(() => resolveBoundValue(host, apiProps.text) || '', [host, apiProps.text]);
  const level = useMemo(() => readLiteralLevel(apiProps.level), [apiProps.level]);

  return { text, level };
}
