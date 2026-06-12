import React, { useState, useCallback } from 'react';
import { Card, Input, Divider, Typography, Space, Alert, Form, Radio } from 'antd';
import { PresetTitleWidget, type TitleLevel } from './PresetTitleWidget';

const { Text, Title } = Typography;

export default function PresetTitleDebug() {
  const [text, setText] = useState('Flight Dashboard');
  const [level, setLevel] = useState<TitleLevel>('h1');
  const [logs, setLogs] = useState<string[]>([]);

  const pushLog = useCallback((msg: string) => {
    setLogs(prev => {
      const next = [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev];
      return next.slice(0, 50);
    });
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Title level={3}>PresetTitle 本地调试页</Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="控制面板" size="small">
          <Form layout="inline" style={{ flexWrap: 'wrap', rowGap: 8 }}>
            <Form.Item label="text（标题文本）">
              <Input
                placeholder="输入标题文本"
                value={text}
                onChange={e => {
                  setText(e.target.value);
                  pushLog(`text → "${e.target.value}"`);
                }}
                style={{ width: 260 }}
              />
            </Form.Item>
            <Form.Item label="level（标题级别）">
              <Radio.Group
                value={level}
                onChange={e => {
                  setLevel(e.target.value as TitleLevel);
                  pushLog(`level → ${e.target.value}`);
                }}
              >
                <Radio.Button value="h1">h1</Radio.Button>
                <Radio.Button value="h2">h2</Radio.Button>
                <Radio.Button value="h3">h3</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>

        <Card title="组件渲染区" size="small">
          <PresetTitleWidget text={text} level={level} />

          <Divider style={{ margin: '16px 0' }} />
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>当前 props：</Text>
            <Alert message={JSON.stringify({ text, level })} type="info" showIcon />
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
