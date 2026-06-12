import React, { useState, useCallback } from 'react';
import { Card, Input, Divider, Typography, Space, Alert, Form, Radio } from 'antd';
import { PresetBadgeWidget, type BadgeVariant } from './PresetBadgeWidget';

const { Text, Title } = Typography;

const ALL_VARIANTS: BadgeVariant[] = ['success', 'warning', 'error', 'info', 'neutral'];

export default function PresetBadgeDebug() {
  const [text, setText] = useState('On Time');
  const [variant, setVariant] = useState<BadgeVariant>('success');
  const [logs, setLogs] = useState<string[]>([]);

  const pushLog = useCallback((msg: string) => {
    setLogs(prev => {
      const next = [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev];
      return next.slice(0, 50);
    });
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Title level={3}>PresetBadge 本地调试页</Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="控制面板" size="small">
          <Form layout="inline" style={{ flexWrap: 'wrap', rowGap: 8 }}>
            <Form.Item label="text（标签文本）">
              <Input
                placeholder="输入标签文本"
                value={text}
                onChange={e => {
                  setText(e.target.value);
                  pushLog(`text → "${e.target.value}"`);
                }}
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item label="variant">
              <Radio.Group
                value={variant}
                onChange={e => {
                  setVariant(e.target.value as BadgeVariant);
                  pushLog(`variant → ${e.target.value}`);
                }}
              >
                <Radio.Button value="success">success</Radio.Button>
                <Radio.Button value="warning">warning</Radio.Button>
                <Radio.Button value="error">error</Radio.Button>
                <Radio.Button value="info">info</Radio.Button>
                <Radio.Button value="neutral">neutral</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>

        <Card title="组件渲染区" size="small">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ALL_VARIANTS.map(v => (
              <PresetBadgeWidget key={v} text={text} variant={v} />
            ))}
          </div>
          <Divider style={{ margin: '16px 0' }} />
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>当前 variant：</Text>
            <PresetBadgeWidget text={text} variant={variant} />
            <Alert message={JSON.stringify({ text, variant })} type="info" showIcon />
          </Space>
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
