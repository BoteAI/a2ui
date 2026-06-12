import React from 'react';

export const TABLE_PREFIX = 'preset-data-table';

export interface ColumnDef {
  key: string;
  label?: string;
}

export type RowDef = Record<string, unknown>;

export type PresetDataTableWidgetProps = {
  columns?: ColumnDef[];
  rows?: RowDef[];
  className?: string;
};

export function PresetDataTableWidget({ columns = [], rows = [], className }: PresetDataTableWidgetProps) {
  return (
    <div className={className} style={{ overflowX: 'auto', width: '100%' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  borderBottom: '2px solid #e5e7eb',
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {col.label || col.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
              {columns.map(col => (
                <td key={col.key} style={{ padding: '8px 12px', color: '#111827' }}>
                  {String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
