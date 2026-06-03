import React from 'react';
import { createReactComponent, defineComponentApi, DynString } from '@boteteam/a2ui-custom-kit';
import { z } from 'zod';

export const DemoReactTitleApi = defineComponentApi({
  name: 'DemoReactTitle',
  shape: {
    text: DynString,
    level: z.enum(['h1', 'h2', 'h3']).optional(),
  },
});

const SIZES: Record<string, string> = {
  h1: '1.75rem',
  h2: '1.25rem',
  h3: '1rem',
};

export const DemoReactTitleElement = createReactComponent(DemoReactTitleApi, ({ props }) => {
  const level = props.level ?? 'h2';
  const style: React.CSSProperties = {
    margin: 0,
    fontWeight: 600,
    fontSize: SIZES[level] ?? SIZES.h2,
    color: 'var(--a2ui-color-primary, #1677ff)',
    letterSpacing: '-0.01em',
  };
  const text = String(props.text ?? '');

  if (level === 'h1') {
    return <h1 style={style}>{text}</h1>;
  }
  if (level === 'h3') {
    return <h3 style={style}>{text}</h3>;
  }
  return <h2 style={style}>{text}</h2>;
});
