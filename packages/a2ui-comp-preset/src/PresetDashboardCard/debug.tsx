import React, { useState, useCallback } from 'react';
import { Card, Input, Divider, Typography, Space, Alert, Form } from 'antd';
import { PresetDashboardCardWidget } from './PresetDashboardCardWidget';

const { Text, Title } = Typography;

export default function PresetDashboardCardDebug() {
  const [title, setTitle] = useState('Revenue Summary');
  const [subtitle, setSubtitle] = useState('Q2 2026');
  const [logs, setLogs] = useState<string[]>([]);

  const pushLog = useCallback((msg: string) => {
    setLogs(prev => {
      const next = [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev];
      return next.slice(0, 50);
    });
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Title level={3}>PresetDashboardCard 本地调试页</Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="控制面板" size="small">
          <Form layout="inline" style={{ flexWrap: 'wrap', rowGap: 8 }}>
            <Form.Item label="title">
              <Input
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  pushLog(`title → "${e.target.value}"`);
                }}
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item label="subtitle">
              <Input
                value={subtitle}
                onChange={e => {
                  setSubtitle(e.target.value);
                  pushLog(`subtitle → "${e.target.value}"`);
                }}
                style={{ width: 200 }}
              />
            </Form.Item>
          </Form>
        </Card>

        <Card title="组件渲染区" size="small">
          <PresetDashboardCardWidget title={title} subtitle={subtitle}>
            <div
              style={{
                background: '#f3f4f6',
                borderRadius: 8,
                padding: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                fontSize: 13,
              }}
            >
              Mock Child Content (slot)
            </div>
          </PresetDashboardCardWidget>
          <Divider style={{ margin: '16px 0' }} />
          <Alert message={JSON.stringify({ title, subtitle })} type="info" showIcon />
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
