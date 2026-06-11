import React from 'react';

export const TITLE_PREFIX = 'preset-title';

export type TitleLevel = 'h1' | 'h2' | 'h3';

export type PresetTitleWidgetProps = {
  text?: string;
  level?: TitleLevel;
  className?: string;
};

const SIZES: Record<string, string> = {
  h1: '1.75rem',
  h2: '1.25rem',
  h3: '1rem',
};

export function PresetTitleWidget({ text, level = 'h2', className }: PresetTitleWidgetProps) {
  const style: React.CSSProperties = {
    margin: 0,
    fontWeight: 600,
    fontSize: SIZES[level] ?? SIZES.h2,
    color: '#111827',
    letterSpacing: '-0.01em',
  };

  const content = String(text ?? '');
  if (level === 'h1')
    return (
      <h1 className={className} style={style}>
        {content}
      </h1>
    );
  if (level === 'h3')
    return (
      <h3 className={className} style={style}>
        {content}
      </h3>
    );
  return (
    <h2 className={className} style={style}>
      {content}
    </h2>
  );
}
