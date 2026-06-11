import React from 'react';

export const CARD_PREFIX = 'preset-dashboard-card';

export type PresetDashboardCardWidgetProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
};

export function PresetDashboardCardWidget({ title, subtitle, children, className }: PresetDashboardCardWidgetProps) {
  return (
    <div
      className={className}
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flex: '1 1 0',
        minWidth: 0,
      }}
    >
      {(title || subtitle) && (
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>{String(title ?? '')}</div>
          {subtitle != null && <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>{String(subtitle)}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
