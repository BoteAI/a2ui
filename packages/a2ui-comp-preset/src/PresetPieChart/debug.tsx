import React, { useState, useCallback, useMemo } from 'react';
import { Card, Divider, Typography, Space, Alert, Form, Input, Slider, Switch } from 'antd';
import { PresetPieChartWidget, type PieDataItem } from './PresetPieChartWidget';

const { Text, Title } = Typography;
const { TextArea } = Input;

const DEFAULT_DATA_JSON = JSON.stringify(
  [
    { label: 'Electronics', value: 420 },
    { label: 'Clothing', value: 310 },
    { label: 'Food & Drink', value: 200 },
    { label: 'Books', value: 120 },
    { label: 'Other', value: 80 },
  ],
  null,
  2,
);

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function PresetPieChartDebug() {
  const [dataJson, setDataJson] = useState(DEFAULT_DATA_JSON);
  const [innerRadius, setInnerRadius] = useState(0);
  const [showLegend, setShowLegend] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const pushLog = useCallback((msg: string) => {
    setLogs(prev => {
      const next = [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev];
      return next.slice(0, 50);
    });
  }, []);

  const chartData = useMemo(() => {
    try {
      const parsed = JSON.parse(dataJson);
      if (Array.isArray(parsed)) {
        return parsed.map((item: { label?: string; value?: number }) => ({
          label: item.label || 'Unknown',
          value: Number(item.value) || 0,
        }));
      }
    } catch {
      /* invalid JSON */
    }
    return [];
  }, [dataJson]);

  const parseError = useMemo(() => {
    try {
      JSON.parse(dataJson);
      return '';
    } catch (e) {
      return (e as Error).message;
    }
  }, [dataJson]);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Title level={3}>PresetPieChart 本地调试页</Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="控制面板" size="small">
          <Form layout="vertical">
            <Form.Item label="data（JSON 数组）" validateStatus={parseError ? 'error' : 'success'} help={parseError || `共 ${chartData.length} 项`}>
              <TextArea rows={8} value={dataJson} onChange={e => setDataJson(e.target.value)} />
            </Form.Item>
            <Form layout="inline" style={{ flexWrap: 'wrap', rowGap: 8 }}>
              <Form.Item label="innerRadius（内半径 %）">
                <Slider
                  min={0}
                  max={80}
                  value={innerRadius}
                  onChange={v => {
                    setInnerRadius(v);
                    pushLog(`innerRadius → ${v}%`);
                  }}
                  style={{ width: 160 }}
                />
                <span style={{ marginLeft: 8, fontSize: 12, color: '#6b7280' }}>{innerRadius}%</span>
              </Form.Item>
              <Form.Item label="showLegend">
                <Switch
                  checked={showLegend}
                  onChange={v => {
                    setShowLegend(v);
                    pushLog(`showLegend → ${v}`);
                  }}
                />
              </Form.Item>
            </Form>
          </Form>
        </Card>

        <Card title="组件渲染区" size="small">
          <PresetPieChartWidget data={chartData} innerRadius={innerRadius} showLegend={showLegend} />

          <Divider style={{ margin: '16px 0' }} />
          <Alert message={JSON.stringify({ data: chartData, innerRadius: `${innerRadius}%`, showLegend })} type="info" showIcon />
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
