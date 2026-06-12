import React from 'react';

export const BADGE_PREFIX = 'preset-badge';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export type PresetBadgeWidgetProps = {
  text?: string;
  variant?: BadgeVariant;
  className?: string;
};

const VARIANTS: Record<string, { bg: string; color: string }> = {
  success: { bg: '#dcfce7', color: '#166534' },
  warning: { bg: '#fef3c7', color: '#92400e' },
  error: { bg: '#fee2e2', color: '#991b1b' },
  info: { bg: '#dbeafe', color: '#1e40af' },
  neutral: { bg: '#f3f4f6', color: '#111827' },
};

export function PresetBadgeWidget({ text, variant = 'neutral', className }: PresetBadgeWidgetProps) {
  const v = VARIANTS[variant] ?? VARIANTS.neutral;

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '0.7rem',
        fontWeight: 500,
        background: v.bg,
        color: v.color,
      }}
    >
      {text}
    </span>
  );
}
