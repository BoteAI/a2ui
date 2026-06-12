import React, { useState, useCallback, useMemo } from 'react';
import { Card, Divider, Typography, Space, Alert, Form, Input, Switch } from 'antd';
import { PresetDataTableWidget } from './PresetDataTableWidget';

const { Text, Title } = Typography;
const { TextArea } = Input;

const DEFAULT_COLUMNS_JSON = JSON.stringify(
  [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Name' },
    { key: 'status', title: 'Status' },
    { key: 'amount', title: 'Amount' },
  ],
  null,
  2,
);

const DEFAULT_ROWS_JSON = JSON.stringify(
  [
    { id: '1', name: 'Flight AA100', status: 'On Time', amount: '$420' },
    { id: '2', name: 'Flight DL200', status: 'Delayed', amount: '$315' },
    { id: '3', name: 'Flight UA300', status: 'On Time', amount: '$598' },
    { id: '4', name: 'Flight WN400', status: 'Cancelled', amount: '$0' },
  ],
  null,
  2,
);

export default function PresetDataTableDebug() {
  const [columnsJson, setColumnsJson] = useState(DEFAULT_COLUMNS_JSON);
  const [rowsJson, setRowsJson] = useState(DEFAULT_ROWS_JSON);
  const [logs, setLogs] = useState<string[]>([]);

  const pushLog = useCallback((msg: string) => {
    setLogs(prev => {
      const next = [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev];
      return next.slice(0, 50);
    });
  }, []);

  const columns = useMemo(() => {
    try {
      const p = JSON.parse(columnsJson);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }, [columnsJson]);

  const rows = useMemo(() => {
    try {
      const p = JSON.parse(rowsJson);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }, [rowsJson]);

  const colError = useMemo(() => {
    try {
      JSON.parse(columnsJson);
      return '';
    } catch (e) {
      return (e as Error).message;
    }
  }, [columnsJson]);
  const rowError = useMemo(() => {
    try {
      JSON.parse(rowsJson);
      return '';
    } catch (e) {
      return (e as Error).message;
    }
  }, [rowsJson]);

  const statusStyle = (status: string): React.CSSProperties => {
    switch (status?.toLowerCase()) {
      case 'on time':
        return { color: '#065f46', background: '#d1fae5' };
      case 'delayed':
        return { color: '#92400e', background: '#fef3c7' };
      case 'cancelled':
        return { color: '#991b1b', background: '#fee2e2' };
      default:
        return {};
    }
  };

  const handleRowClick = (row: Record<string, unknown>) => {
    pushLog(`rowClick: ${JSON.stringify(row)}`);
  };

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <Title level={3}>PresetDataTable 本地调试页</Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="控制面板" size="small">
          <Form layout="vertical">
            <Form.Item label="columns（JSON 数组）" validateStatus={colError ? 'error' : 'success'} help={colError || `共 ${columns.length} 列`}>
              <TextArea rows={5} value={columnsJson} onChange={e => setColumnsJson(e.target.value)} />
            </Form.Item>
            <Form.Item label="rows（JSON 数组）" validateStatus={rowError ? 'error' : 'success'} help={rowError || `共 ${rows.length} 行`}>
              <TextArea rows={7} value={rowsJson} onChange={e => setRowsJson(e.target.value)} />
            </Form.Item>
          </Form>
        </Card>

        <Card title="组件渲染区" size="small">
          <PresetDataTableWidget columns={columns} rows={rows} />
          <Divider style={{ margin: '16px 0' }} />
          <Alert message={JSON.stringify({ columns: columns.length, rows: rows.length })} type="info" showIcon />
        </Card>

        <Card title="事件日志" size="small" extra={<a onClick={() => setLogs([])}>清空</a>}>
          {logs.length === 0 ? (
            <Text type="secondary">暂无日志</Text>
          ) : (
            <div style={{ maxHeight: 240, overflow: 'auto', background: '#f6f8fa', padding: 8, borderRadius: 4 }}>
              {logs.map((log, i) => (
                <div key={i} style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: '20px' }}>
                  {log}
                </div>
              ))}
            </div>
          )}
        </Card>
      </Space>
    </div>
  );
}
