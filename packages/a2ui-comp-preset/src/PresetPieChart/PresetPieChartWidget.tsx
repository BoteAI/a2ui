import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const PIECHART_PREFIX = 'preset-pie-chart';

export interface PieDataItem {
  label?: string;
  value?: number;
  color?: string;
}

export type PresetPieChartWidgetProps = {
  data?: PieDataItem[];
  innerRadius?: number;
  showLegend?: boolean;
  className?: string;
};

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

export function PresetPieChartWidget({ data = [], innerRadius = 40, showLegend = false, className }: PresetPieChartWidgetProps) {
  const chartData = useMemo(() => data.map(item => ({ name: item.label || 'Unknown', value: Number(item.value) || 0, color: item.color })), [data]);

  if (chartData.length === 0) return null;

  return (
    <div className={className} style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={80} paddingAngle={2}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color ?? COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          {showLegend && <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11 }} />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
