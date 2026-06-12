import React, { useState, useCallback } from 'react';
import { Card, Input, Divider, Typography, Space, Alert, Form, Radio } from 'antd';
import { PresetMetricWidget, type MetricTrend } from './PresetMetricWidget';

const { Text, Title } = Typography;

export default function PresetMetricDebug() {
  const [label, setLabel] = useState('ACTIVE USERS');
  const [value, setValue] = useState('12,450');
  const [trend, setTrend] = useState<MetricTrend>('up');
  const [trendValue, setTrendValue] = useState('+8.2%');
  const [logs, setLogs] = useState<string[]>([]);

  const pushLog = useCallback((msg: string) => {
    setLogs(prev => {
      const next = [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev];
      return next.slice(0, 50);
    });
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Title level={3}>PresetMetric 本地调试页</Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="控制面板" size="small">
          <Form layout="inline" style={{ flexWrap: 'wrap', rowGap: 8 }}>
            <Form.Item label="label">
              <Input value={label} onChange={e => setLabel(e.target.value)} style={{ width: 140 }} />
            </Form.Item>
            <Form.Item label="value">
              <Input value={value} onChange={e => setValue(e.target.value)} style={{ width: 120 }} />
            </Form.Item>
            <Form.Item label="trend">
              <Radio.Group
                value={trend}
                onChange={e => {
                  setTrend(e.target.value as MetricTrend);
                  pushLog(`trend → ${e.target.value}`);
                }}
              >
                <Radio.Button value="up">↑ up</Radio.Button>
                <Radio.Button value="down">↓ down</Radio.Button>
                <Radio.Button value="neutral">→ neutral</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="trendValue">
              <Input value={trendValue} onChange={e => setTrendValue(e.target.value)} style={{ width: 100 }} placeholder="+8.2%" />
            </Form.Item>
          </Form>
        </Card>

        <Card title="组件渲染区" size="small">
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <PresetMetricWidget label={label} value={value} trend={trend} trendValue={trendValue} />

            <div style={{ display: 'flex', gap: 24 }}>
              <PresetMetricWidget label="TICKETS" value="1,284" trend="up" trendValue="+12%" />
              <PresetMetricWidget label="AVG PRICE" value="$412" trend="down" trendValue="-3.2%" />
              <PresetMetricWidget label="ERROR RATE" value="0.04%" trend="neutral" trendValue="0.0%" />
            </div>
          </div>
          <Divider style={{ margin: '16px 0' }} />
          <Alert message={JSON.stringify({ label, value, trend, trendValue })} type="info" showIcon />
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
