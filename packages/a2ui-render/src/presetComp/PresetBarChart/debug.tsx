import React, { useState, useCallback, useMemo } from 'react';
import { Card, Input, Divider, Typography, Space, Alert, Form, InputNumber } from 'antd';
import { PresetBarChartWidget, type BarDataItem } from './PresetBarChartWidget';

const { Text, Title } = Typography;
const { TextArea } = Input;

const DEFAULT_DATA_JSON = JSON.stringify(
  [
    { label: 'Jan', value: 400 },
    { label: 'Feb', value: 300 },
    { label: 'Mar', value: 600 },
    { label: 'Apr', value: 800 },
    { label: 'May', value: 500 },
    { label: 'Jun', value: 700 },
  ],
  null,
  2,
);

export default function PresetBarChartDebug() {
  const [dataJson, setDataJson] = useState(DEFAULT_DATA_JSON);
  const [color, setColor] = useState('#3b82f6');
  const [valuePrefix, setValuePrefix] = useState('');
  const [valueSuffix, setValueSuffix] = useState('');
  const [maxBarSize, setMaxBarSize] = useState(40);
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
      <Title level={3}>PresetBarChart 本地调试页</Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="控制面板" size="small">
          <Form layout="vertical">
            <Form.Item label="data（JSON 数组）" validateStatus={parseError ? 'error' : 'success'} help={parseError || `共 ${chartData.length} 项`}>
              <TextArea rows={7} value={dataJson} onChange={e => setDataJson(e.target.value)} />
            </Form.Item>
          </Form>
          <Form layout="inline" style={{ flexWrap: 'wrap', rowGap: 8 }}>
            <Form.Item label="color">
              <Input value={color} onChange={e => setColor(e.target.value)} style={{ width: 120 }} />
              <span
                style={{
                  display: 'inline-block',
                  width: 24,
                  height: 24,
                  background: color,
                  borderRadius: 4,
                  marginLeft: 8,
                  verticalAlign: 'middle',
                  border: '1px solid #d1d5db',
                }}
              />
            </Form.Item>
            <Form.Item label="valuePrefix">
              <Input value={valuePrefix} onChange={e => setValuePrefix(e.target.value)} placeholder="$" style={{ width: 80 }} />
            </Form.Item>
            <Form.Item label="valueSuffix">
              <Input value={valueSuffix} onChange={e => setValueSuffix(e.target.value)} placeholder="k" style={{ width: 80 }} />
            </Form.Item>
            <Form.Item label="maxBarSize">
              <InputNumber min={8} max={120} value={maxBarSize} onChange={v => setMaxBarSize(v ?? 40)} />
            </Form.Item>
          </Form>
        </Card>

        <Card title="组件渲染区" size="small">
          <PresetBarChartWidget data={chartData} color={color} valuePrefix={valuePrefix} valueSuffix={valueSuffix} />

          <Divider style={{ margin: '16px 0' }} />
          <Alert message={JSON.stringify({ data: chartData, color, valuePrefix, valueSuffix, maxBarSize })} type="info" showIcon />
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
