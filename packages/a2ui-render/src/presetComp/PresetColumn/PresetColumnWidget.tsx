import React from 'react';

export const COLUMN_PREFIX = 'preset-column';

export type ColumnAlign = 'start' | 'center' | 'end' | 'stretch';

export type PresetColumnWidgetProps = {
  gap?: number;
  align?: ColumnAlign;
  children?: React.ReactNode;
  className?: string;
};

const ALIGN_MAP: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

export function PresetColumnWidget({ gap = 12, align = 'stretch', children, className }: PresetColumnWidgetProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`,
        width: '100%',
        alignItems: ALIGN_MAP[align] ?? 'stretch',
      }}
    >
      {children}
    </div>
  );
}
