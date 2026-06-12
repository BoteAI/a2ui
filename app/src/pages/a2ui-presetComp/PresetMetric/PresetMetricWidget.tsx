import React from 'react';

export const METRIC_PREFIX = 'preset-metric';

export type MetricTrend = 'up' | 'down' | 'neutral';

export type PresetMetricWidgetProps = {
  label?: string;
  value?: string;
  trend?: MetricTrend;
  trendValue?: string;
  className?: string;
};

const TREND_COLORS: Record<string, string> = {
  up: '#059669',
  down: '#dc2626',
  neutral: '#6b7280',
};

const TREND_ICONS: Record<string, string> = {
  up: '↑',
  down: '↓',
  neutral: '→',
};

export function PresetMetricWidget({ label, value, trend, trendValue, className }: PresetMetricWidgetProps) {
  const labelStr = String(label ?? '');
  const valueStr = String(value ?? '');
  const trendValueStr = trendValue != null ? String(trendValue) : '';

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span
        style={{
          fontSize: '0.75rem',
          color: '#6b7280',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {labelStr}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#111827',
            letterSpacing: '-0.02em',
          }}
        >
          {valueStr}
        </span>
        {trend && trendValueStr && (
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 500,
              color: TREND_COLORS[trend] ?? '#6b7280',
            }}
          >
            {TREND_ICONS[trend]} {trendValueStr}
          </span>
        )}
      </div>
    </div>
  );
}
