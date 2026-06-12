import React, { useState, useCallback } from 'react';
import { Card, InputNumber, Divider, Typography, Space, Alert, Form, Radio } from 'antd';
import { PresetColumnWidget, type ColumnAlign } from './PresetColumnWidget';

const { Text, Title } = Typography;

const ALL_ALIGNS: ColumnAlign[] = ['start', 'center', 'end', 'stretch'];

export default function PresetColumnDebug() {
  const [gap, setGap] = useState<number>(12);
  const [align, setAlign] = useState<ColumnAlign>('stretch');
  const [logs, setLogs] = useState<string[]>([]);

  const pushLog = useCallback((msg: string) => {
    setLogs(prev => {
      const next = [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev];
      return next.slice(0, 50);
    });
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Title level={3}>PresetColumn 本地调试页</Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="控制面板" size="small">
          <Form layout="inline" style={{ flexWrap: 'wrap', rowGap: 8 }}>
            <Form.Item label="gap（间距 px）">
              <InputNumber
                min={0}
                max={64}
                value={gap}
                onChange={v => {
                  setGap(v ?? 12);
                  pushLog(`gap → ${v}`);
                }}
              />
            </Form.Item>
            <Form.Item label="align（交叉轴对齐）">
              <Radio.Group
                value={align}
                onChange={e => {
                  setAlign(e.target.value as ColumnAlign);
                  pushLog(`align → ${e.target.value}`);
                }}
              >
                {ALL_ALIGNS.map(v => (
                  <Radio.Button key={v} value={v}>
                    {v}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>

        <Card title="组件渲染区" size="small">
          <PresetColumnWidget gap={gap} align={align}>
            {[
              { label: 'Section A', color: '#dbeafe', height: 50 },
              { label: 'Section B', color: '#d1fae5', height: 70 },
              { label: 'Section C', color: '#fef3c7', height: 40 },
            ].map((child, i) => (
              <div
                key={i}
                style={{
                  height: child.height,
                  background: child.color,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#374151',
                }}
              >
                {child.label}
              </div>
            ))}
          </PresetColumnWidget>
          <Divider style={{ margin: '16px 0' }} />
          <Alert message={JSON.stringify({ gap, align, children: 'Mock 3 items' })} type="info" showIcon />
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
