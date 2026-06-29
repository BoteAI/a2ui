import React, { useState, useCallback } from 'react';
import { Card, Radio, Input, Switch, Divider, Typography, Space, Alert, Form } from 'antd';
import { SelectWidget, type LabelLayout, type SelectWidgetMode } from './SelectWidget';
import type { SelectProps } from 'antd';

const { Text, Title } = Typography;
const { TextArea } = Input;

/** 默认 options */
const DEFAULT_OPTIONS_JSON = JSON.stringify(
  [
    { label: '选项 A', value: 'a' },
    { label: '选项 B', value: 'b' },
    { label: '选项 C', value: 'c' },
    { label: '选项 D（禁用）', value: 'd', disabled: true },
  ],
  null,
  2,
);

export default function PresetSelectDebug() {
  const [mode, setMode] = useState<SelectWidgetMode>('single');
  const [label, setLabel] = useState('状态');
  const [labelLayout, setLabelLayout] = useState<LabelLayout>('vertical');
  const [optionsJson, setOptionsJson] = useState(DEFAULT_OPTIONS_JSON);
  const [placeholder, setPlaceholder] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [allowClear, setAllowClear] = useState(true);
  const [value, setValue] = useState<string | string[] | undefined>(undefined);
  const [logs, setLogs] = useState<string[]>([]);

  let parsedOptions: SelectProps['options'] = [];
  let parseError = '';
  try {
    const parsed = JSON.parse(optionsJson);
    parsedOptions = Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    parseError = (e as Error).message;
  }

  const pushLog = useCallback((msg: string) => {
    setLogs(prev => {
      const next = [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev];
      return next.slice(0, 50);
    });
  }, []);

  const handleChange = useCallback(
    (next: string | string[] | undefined) => {
      setValue(next);
      pushLog(`onChange: ${JSON.stringify(next)}`);
    },
    [pushLog],
  );

  const handleModeChange = (nextMode: SelectWidgetMode) => {
    setMode(nextMode);
    setValue(undefined);
    pushLog(`切换 mode → ${nextMode}，value 已重置`);
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Title level={3}>PresetSelect 本地调试页</Title>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 控制面板 */}
        <Card title="控制面板" size="small">
          <Form layout="inline" style={{ flexWrap: 'wrap', rowGap: 8 }}>
            <Form.Item label="mode">
              <Radio.Group value={mode} onChange={e => handleModeChange(e.target.value)}>
                <Radio.Button value="single">single（单选）</Radio.Button>
                <Radio.Button value="multiple">multiple（多选）</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="disabled">
              <Switch checked={disabled} onChange={setDisabled} />
            </Form.Item>

            <Form.Item label="showSearch">
              <Switch checked={showSearch} onChange={setShowSearch} />
            </Form.Item>

            <Form.Item label="allowClear">
              <Switch checked={allowClear} onChange={setAllowClear} />
            </Form.Item>

            <Form.Item label="placeholder">
              <Input placeholder="输入占位文本" value={placeholder} onChange={e => setPlaceholder(e.target.value)} style={{ width: 200 }} />
            </Form.Item>

            <Form.Item label="label">
              <Input placeholder="输入标题" value={label} onChange={e => setLabel(e.target.value)} style={{ width: 200 }} />
            </Form.Item>

            <Form.Item label="labelLayout">
              <Radio.Group value={labelLayout} onChange={e => setLabelLayout(e.target.value)}>
                <Radio.Button value="horizontal">horizontal</Radio.Button>
                <Radio.Button value="vertical">vertical</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '16px 0' }} />

          <Form layout="vertical">
            <Form.Item
              label="options（JSON 数组）"
              validateStatus={parseError ? 'error' : 'success'}
              help={parseError || `共 ${parsedOptions?.length || 0} 项`}
            >
              <TextArea rows={6} value={optionsJson} onChange={e => setOptionsJson(e.target.value)} />
            </Form.Item>
          </Form>
        </Card>

        {/* 组件渲染 */}
        <Card title="组件渲染区" size="small">
          <SelectWidget
            mode={mode}
            label={label || undefined}
            labelLayout={labelLayout}
            value={value}
            onChange={handleChange}
            options={parsedOptions}
            placeholder={placeholder || undefined}
            disabled={disabled}
            showSearch={showSearch}
            allowClear={allowClear}
          />

          <Divider style={{ margin: '16px 0' }} />

          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>当前 value：</Text>
            <Alert message={JSON.stringify(value)} type="info" showIcon />
          </Space>
        </Card>

        {/* 日志 */}
        <Card title="事件日志" size="small" extra={<a onClick={() => setLogs([])}>清空</a>}>
          {logs.length === 0 ? (
            <Text type="secondary">暂无日志</Text>
          ) : (
            <div
              style={{
                maxHeight: 240,
                overflow: 'auto',
                background: '#f6f8fa',
                padding: 8,
                borderRadius: 4,
              }}
            >
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
