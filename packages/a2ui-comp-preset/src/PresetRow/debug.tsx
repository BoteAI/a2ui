import React, { useState, useCallback } from 'react';
import { Card, InputNumber, Divider, Typography, Space, Alert, Form, Radio } from 'antd';
import { PresetRowWidget, type RowAlign, type RowJustify } from './PresetRowWidget';

const { Text, Title } = Typography;

const ALL_ALIGNS: RowAlign[] = ['start', 'center', 'end', 'stretch'];
const ALL_JUSTIFIES: RowJustify[] = ['start', 'center', 'end', 'spaceBetween', 'spaceAround', 'spaceEvenly', 'stretch'];

export default function PresetRowDebug() {
  const [gap, setGap] = useState<number>(16);
  const [align, setAlign] = useState<RowAlign>('stretch');
  const [justify, setJustify] = useState<RowJustify>('start');
  const [logs, setLogs] = useState<string[]>([]);

  const pushLog = useCallback((msg: string) => {
    setLogs(prev => {
      const next = [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev];
      return next.slice(0, 50);
    });
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Title level={3}>PresetRow 本地调试页</Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="控制面板" size="small">
          <Form layout="inline" style={{ flexWrap: 'wrap', rowGap: 8 }}>
            <Form.Item label="gap（间距 px）">
              <InputNumber
                min={0}
                max={64}
                value={gap}
                onChange={v => {
                  setGap(v ?? 16);
                  pushLog(`gap → ${v}`);
                }}
              />
            </Form.Item>
            <Form.Item label="align（交叉轴对齐）">
              <Radio.Group
                value={align}
                onChange={e => {
                  setAlign(e.target.value as RowAlign);
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
            <Form.Item label="justify（主轴分布）">
              <Radio.Group
                value={justify}
                onChange={e => {
                  setJustify(e.target.value as RowJustify);
                  pushLog(`justify → ${e.target.value}`);
                }}
              >
                {ALL_JUSTIFIES.map(v => (
                  <Radio.Button key={v} value={v} style={{ fontSize: 11 }}>
                    {v}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>

        <Card title="组件渲染区" size="small">
          <PresetRowWidget gap={gap} align={align} justify={justify}>
            {[
              { label: 'Item A', color: '#dbeafe', width: 80 },
              { label: 'Item B', color: '#d1fae5', width: 120 },
              { label: 'Item C', color: '#fef3c7', width: 90 },
              { label: 'Item D', color: '#fce7f3', width: 100 },
            ].map((child, i) => (
              <div
                key={i}
                style={{
                  width: child.width,
                  background: child.color,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#374151',
                  padding: '12px 4px',
                }}
              >
                {child.label}
              </div>
            ))}
          </PresetRowWidget>
          <Divider style={{ margin: '16px 0' }} />
          <Alert message={JSON.stringify({ gap, align, justify, children: 'Mock 4 items' })} type="info" showIcon />
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
