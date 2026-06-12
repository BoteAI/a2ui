import React, { useMemo } from 'react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const BARCHART_PREFIX = 'preset-bar-chart';

export interface BarDataItem {
  label?: string;
  value?: number;
}

export type PresetBarChartWidgetProps = {
  data?: BarDataItem[];
  color?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  className?: string;
};

export function PresetBarChartWidget({ data = [], color = '#3b82f6', valuePrefix = '', valueSuffix = '', className }: PresetBarChartWidgetProps) {
  const chartData = useMemo(() => data.map(item => ({ label: item.label || 'Unknown', value: Number(item.value) || 0 })), [data]);

  const formatValue = (value: unknown) => (value == null ? '' : `${valuePrefix}${value}${valueSuffix}`);

  if (chartData.length === 0) return null;

  return (
    <div className={className} style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} />
          <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={formatValue} />
          <Tooltip formatter={(value: unknown) => formatValue(value)} />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
