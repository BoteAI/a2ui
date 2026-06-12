import { useState, useCallback, useMemo } from 'react';
import { dispatchDeclaredAction, type A2UICustomElementHost } from '@boteai/a2ui-custom-kit';
import type { z } from 'zod';
import { PresetButtonApi } from './api';
import type { PresetButtonWidgetProps, ButtonVariant } from './PresetButtonWidget';

type ApiProps = z.infer<typeof PresetButtonApi.schema>;

const ALL_VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'danger', 'ghost'];

function readVariant(raw: unknown): ButtonVariant {
  if (typeof raw === 'string' && ALL_VARIANTS.includes(raw as ButtonVariant)) return raw as ButtonVariant;
  return 'primary';
}

export function useButtonBinding(host: A2UICustomElementHost, apiProps: ApiProps): PresetButtonWidgetProps {
  const [done, setDone] = useState(false);
  const variant = useMemo(() => readVariant(apiProps.variant), [apiProps.variant]);

  const onClick = useCallback(() => {
    if (done) return;
    dispatchDeclaredAction(host);
    setDone(true);
  }, [host, done]);

  return { variant, done, onClick };
}
