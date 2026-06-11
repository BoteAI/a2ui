import React, { useState } from 'react';

export const BUTTON_PREFIX = 'preset-button';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export type PresetButtonWidgetProps = {
  variant?: ButtonVariant;
  disabled?: boolean;
  done?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function PresetButtonWidget({ variant = 'primary', disabled = false, done = false, children, onClick, className }: PresetButtonWidgetProps) {
  return (
    <button
      type="button"
      className={className}
      disabled={disabled || done}
      style={{
        width: '100%',
        padding: '10px 16px',
        borderRadius: '10px',
        border: done ? '1px solid #bbf7d0' : '1px solid #e5e7eb',
        background: done ? 'color-mix(in srgb, #22c55e 10%, #ffffff)' : 'color-mix(in srgb, #f3f4f6 40%, #ffffff)',
        color: done ? '#059669' : '#111827',
        fontSize: '0.85rem',
        fontWeight: 500,
        cursor: done || disabled ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
      }}
      onClick={() => {
        if (done || disabled) return;
        onClick?.();
      }}
    >
      {done && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {done ? 'Done' : children}
    </button>
  );
}
