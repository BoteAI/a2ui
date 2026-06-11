import { useMemo } from 'react';
import { resolveBoundValue, type A2UICustomElementHost } from '@bote/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetBadgeApi } from './api';
import type { PresetBadgeWidgetProps, BadgeVariant } from './PresetBadgeWidget';

type ApiProps = z.infer<typeof PresetBadgeApi.schema>;

const ALL_VARIANTS: BadgeVariant[] = ['success', 'warning', 'error', 'info', 'neutral'];

function readLiteralVariant(raw: unknown): BadgeVariant {
  if (typeof raw === 'string' && ALL_VARIANTS.includes(raw as BadgeVariant)) {
    return raw as BadgeVariant;
  }
  return 'neutral';
}

export function useBadgeBinding(host: A2UICustomElementHost, apiProps: ApiProps): PresetBadgeWidgetProps {
  const text = useMemo(() => resolveBoundValue(host, apiProps.text) || '', [host, apiProps.text]);
  const variant = useMemo(() => readLiteralVariant(apiProps.variant), [apiProps.variant]);

  return { text, variant };
}
