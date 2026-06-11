import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Col, Input, message, Row, Space } from 'antd';
import {
  BaseRenderer,
  type A2UIMessage,
  type A2UIThemePreset,
} from '@boteai/a2ui-render';
import type { A2UICustomComponentRegistry } from '@boteai/a2ui-custom-kit';
import styles from './index.less';

const { TextArea } = Input;

const MESSAGES_JSON_DEBOUNCE_MS = 380;

export type PlaygroundEditorProps = {
  protocolVersion: '0.8' | '0.9';
  demoLabel: string;
  initialMessages: A2UIMessage[];
  themePreset: A2UIThemePreset;
  customComponents: A2UICustomComponentRegistry;
  patchMessages?: (messages: A2UIMessage[], themePreset: A2UIThemePreset, demo: string) => A2UIMessage[];
  demoId?: string;
};

function formatMessagesJson(next: A2UIMessage[]): string {
  return JSON.stringify(next, null, 2);
}

const PlaygroundEditor: React.FC<PlaygroundEditorProps> = ({
  protocolVersion,
  demoLabel,
  initialMessages,
  themePreset,
  customComponents,
  patchMessages,
  demoId = '',
}) => {
  const [messages, setMessages] = useState<A2UIMessage[]>(initialMessages);
  const [messageEditorText, setMessageEditorText] = useState(() => formatMessagesJson(initialMessages));
  const messagesRef = useRef<A2UIMessage[]>(initialMessages);
  const [messagesJsonError, setMessagesJsonError] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    messagesRef.current = initialMessages;
    setMessages(initialMessages);
    setMessageEditorText(formatMessagesJson(initialMessages));
    setMessagesJsonError(null);
    setPreviewKey((k) => k + 1);
  }, [initialMessages, demoLabel]);

  const handleAction = (action: { name: string; context: unknown }) => {
    const preview =
      action.context && typeof action.context === 'object'
        ? JSON.stringify(action.context)
        : String(action.context);
    message.info(`${action.name}: ${preview.slice(0, 120)}${preview.length > 120 ? '…' : ''}`, 3);
  };

  const applyMessagesFromEditorText = useCallback((text: string, options?: { showToast?: boolean }) => {
    try {
      const parsed = JSON.parse(text) as unknown;
      if (!Array.isArray(parsed)) {
        setMessagesJsonError('Messages 须为 JSON 数组');
        if (options?.showToast) message.error('Messages 须为 JSON 数组');
        return;
      }
      const next = parsed as A2UIMessage[];
      const nextStr = JSON.stringify(next);
      if (nextStr === JSON.stringify(messagesRef.current)) {
        setMessagesJsonError(null);
        if (options?.showToast) message.info('预览已与左侧 JSON 一致');
        return;
      }
      setMessagesJsonError(null);
      messagesRef.current = next;
      setMessages(next);
      setPreviewKey((k) => k + 1);
      if (options?.showToast) message.success('已更新预览');
    } catch {
      setMessagesJsonError('JSON 格式错误');
      if (options?.showToast) message.error('JSON 格式错误');
    }
  }, []);

  useEffect(() => {
    const tid = window.setTimeout(() => {
      applyMessagesFromEditorText(messageEditorText);
    }, MESSAGES_JSON_DEBOUNCE_MS);
    return () => window.clearTimeout(tid);
  }, [messageEditorText, applyMessagesFromEditorText]);

  const previewMessages = React.useMemo(() => {
    if (!patchMessages) return messages;
    return patchMessages(messages, themePreset, demoId);
  }, [messages, themePreset, demoId, patchMessages]);

  return (
    <div className={styles.editorBody}>
      <Row gutter={[16, 16]} className={styles.editorRow}>
        <Col xs={24} lg={11} className={styles.editorPanel}>
          <div className={styles.panelLabel}>Messages · {demoLabel}</div>
          <div className={styles.messageEditorWrap}>
            <TextArea
              className={styles.messageEditor}
              value={messageEditorText}
              onChange={(e) => setMessageEditorText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) {
                  e.preventDefault();
                  applyMessagesFromEditorText(messageEditorText, { showToast: true });
                }
              }}
              placeholder="A2UI 消息 JSON 数组"
              spellCheck={false}
            />
            {messagesJsonError ? (
              <Alert
                type="error"
                showIcon
                message={messagesJsonError}
                className={styles.messageEditorBanner}
              />
            ) : null}
          </div>
        </Col>
        <Col xs={24} lg={13} className={styles.editorPanel}>
          <div className={styles.panelLabel}>预览</div>
          <div className={styles.previewPane}>
            <div
              key={`editor-${protocolVersion}-${demoLabel}-${themePreset}-${previewKey}`}
              className={styles.rendererWrapper}
            >
              <BaseRenderer
                key={`renderer-${protocolVersion}-${demoLabel}-${themePreset}-${previewKey}`}
                messages={previewMessages}
                protocolVersion={protocolVersion}
                onAction={handleAction}
                customComponents={customComponents}
                themePreset={themePreset}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PlaygroundEditor;
