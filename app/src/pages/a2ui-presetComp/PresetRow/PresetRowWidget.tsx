import React from 'react';

export const ROW_PREFIX = 'preset-row';

export type RowAlign = 'start' | 'center' | 'end' | 'stretch';
export type RowJustify = 'start' | 'center' | 'end' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly' | 'stretch';

export type PresetRowWidgetProps = {
  gap?: number;
  align?: RowAlign;
  justify?: RowJustify;
  children?: React.ReactNode;
  className?: string;
};

const JUSTIFY_MAP: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
  spaceEvenly: 'space-evenly',
  stretch: 'stretch',
};

const ALIGN_MAP: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

export function PresetRowWidget({ gap = 16, align = 'stretch', justify = 'start', children, className }: PresetRowWidgetProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: `${gap}px`,
        alignItems: ALIGN_MAP[align] ?? 'stretch',
        justifyContent: JUSTIFY_MAP[justify] ?? 'flex-start',
        flexWrap: 'wrap',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}
