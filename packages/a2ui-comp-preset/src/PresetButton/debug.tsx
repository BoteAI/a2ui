import React, { useState, useCallback } from 'react';
import { Card, Divider, Typography, Space, Alert, Form, Radio } from 'antd';
import { PresetButtonWidget, type ButtonVariant } from './PresetButtonWidget';

const { Text, Title } = Typography;

const ALL_VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'danger', 'ghost'];

const LABEL_MAP: Record<ButtonVariant, string> = {
  primary: 'Confirm',
  secondary: 'Cancel',
  danger: 'Delete',
  ghost: 'Link',
};

export default function PresetButtonDebug() {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [logs, setLogs] = useState<string[]>([]);

  const pushLog = useCallback((msg: string) => {
    setLogs(prev => {
      const next = [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev];
      return next.slice(0, 50);
    });
  }, []);

  const handleClick = (v: ButtonVariant) => {
    pushLog(`onClick: "${v}" button clicked`);
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Title level={3}>PresetButton 本地调试页</Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="控制面板" size="small">
          <Form.Item label="variant（按钮变体）">
            <Radio.Group
              value={variant}
              onChange={e => {
                setVariant(e.target.value as ButtonVariant);
                pushLog(`variant → ${e.target.value}`);
              }}
            >
              {ALL_VARIANTS.map(v => (
                <Radio.Button key={v} value={v}>
                  {v}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </Card>

        <Card title="组件渲染区" size="small">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {ALL_VARIANTS.map(v => (
              <PresetButtonWidget key={v} variant={v} onClick={() => handleClick(v)}>
                {LABEL_MAP[v]}
              </PresetButtonWidget>
            ))}
          </div>

          <Divider style={{ margin: '16px 0' }} />

          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>当前 variant：</Text>
            <PresetButtonWidget variant={variant} onClick={() => handleClick(variant)}>
              {LABEL_MAP[variant]}
            </PresetButtonWidget>
            <Alert message={JSON.stringify({ variant })} type="info" showIcon />
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
