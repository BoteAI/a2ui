import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Col, Input, message, Row, Select, Space } from 'antd';
import {
  A2UI_THEME_PRESET_NAMES,
  BaseRenderer,
  pickCustomComponents,
  type A2UIMessage,
  type A2UIThemePreset,
} from '@boteteam/a2ui-render';
import mockMessagesV08 from './mock/v0.8/messages.json';
import mockMessagesV09 from './mock/v0.9/messages.json';
import customDemoMessagesV08 from './mock/v0.8/demo1.json';
import customDemoMessagesV09 from './mock/v0.9/demo1.json';
import demoRemoteOnlyMessagesV09 from './mock/v0.9/demo-remote-only.json';
import { a2uiTestCustomComponents } from './custElement';
import styles from './index.less';
import { resolveApiUrl } from '@/utils/resolveApiUrl';

const { TextArea } = Input;

const A2UI_PROTOCOL_QUERY_KEY = 'a2uiProtocolVersion';
const A2UI_DEMO_PRESET_QUERY_KEY = 'a2uiDemo';
const A2UI_THEME_QUERY_KEY = 'a2uiTheme';

type A2UIProtocolVersion = '0.8' | '0.9';
type A2UIDemoPreset = 'registration' | 'custom' | 'remote';
const THEME_PRESET_LABELS: Record<A2UIThemePreset, string> = {
  default: '默认',
  conversation: '对话标准',
  cyber: '炫彩科技',
  platformInterconnect: '平台互联',
  deepBlueWisdom: '深蓝智慧',
};

const THEME_SELECT_OPTIONS = A2UI_THEME_PRESET_NAMES.map((value) => ({
  label: THEME_PRESET_LABELS[value],
  value,
}));

/** 旅行表单示例角标：仅 custom 示例含 cyber-badge 时按主题替换文案 */
const SHOWCASE_THEME_BADGE: Partial<Record<A2UIThemePreset, string>> = {
  cyber: 'CYBER',
  platformInterconnect: '互联',
  deepBlueWisdom: '智慧',
};

function isA2UIThemePreset(value: string | null): value is A2UIThemePreset {
  return value != null && (A2UI_THEME_PRESET_NAMES as readonly string[]).includes(value);
}

function getProtocolVersionFromUrl(): A2UIProtocolVersion {
  if (typeof window === 'undefined') {
    return '0.8';
  }
  const value = new URLSearchParams(window.location.search).get(A2UI_PROTOCOL_QUERY_KEY);
  return value === '0.9' ? '0.9' : '0.8';
}

function getDemoPresetFromUrl(): A2UIDemoPreset {
  if (typeof window === 'undefined') {
    return 'registration';
  }
  const d = new URLSearchParams(window.location.search).get(A2UI_DEMO_PRESET_QUERY_KEY);
  if (d === 'custom') return 'custom';
  if (d === 'remote') return 'remote';
  return 'registration';
}

function getThemePresetFromUrl(): A2UIThemePreset {
  if (typeof window === 'undefined') {
    return 'conversation';
  }
  const value = new URLSearchParams(window.location.search).get(A2UI_THEME_QUERY_KEY);
  return isA2UIThemePreset(value) ? value : 'conversation';
}

/** 自定义示例角标文案随 themePreset 切换 */
function patchTravelFormBadge(messages: A2UIMessage[], badgeText: string): A2UIMessage[] {
  return messages.map((msg) => {
    const record = msg as Record<string, unknown>;
    const update = record.updateComponents as
      | { components?: { id?: string; text?: string }[] }
      | undefined;
    if (!update?.components) return msg;
    const components = update.components.map((component) =>
      component?.id === 'cyber-badge' ? { ...component, text: badgeText } : component,
    );
    return {
      ...msg,
      updateComponents: { ...update, components },
    } as A2UIMessage;
  });
}

function defaultMessagesForProtocol(version: A2UIProtocolVersion): A2UIMessage[] {
  return (version === '0.9' ? mockMessagesV09 : mockMessagesV08) as A2UIMessage[];
}

function messagesForPreset(version: A2UIProtocolVersion, preset: A2UIDemoPreset): A2UIMessage[] {
  if (preset === 'remote') {
    return demoRemoteOnlyMessagesV09 as A2UIMessage[];
  }
  if (preset === 'custom') {
    return (version === '0.9' ? customDemoMessagesV09 : customDemoMessagesV08) as A2UIMessage[];
  }
  return defaultMessagesForProtocol(version);
}

function formatMessagesJson(next: A2UIMessage[]): string {
  return JSON.stringify(next, null, 2);
}

const PROTOCOL_SELECT_OPTIONS = [
  { label: '协议 0.8', value: '0.8' },
  { label: '协议 0.9', value: '0.9' },
] as const;

const DEMO_SELECT_OPTIONS = [
  { label: '客户表单', value: 'registration' },
  { label: '自定义组件', value: 'custom' },
  { label: '远程 ESM 联调', value: 'remote' },
] as const;

const MESSAGES_JSON_DEBOUNCE_MS = 380;

const A2UITest: React.FC = () => {
  const initialPreset = getDemoPresetFromUrl();
  const initialVersion: A2UIProtocolVersion = initialPreset === 'remote' ? '0.9' : getProtocolVersionFromUrl();
  const initialMessages = messagesForPreset(initialVersion, initialPreset);

  const [protocolVersion, setProtocolVersion] = useState<A2UIProtocolVersion>(initialVersion);
  const [demoPreset, setDemoPreset] = useState<A2UIDemoPreset>(initialPreset);
  const [themePreset, setThemePreset] = useState<A2UIThemePreset>(getThemePresetFromUrl);
  const [messages, setMessages] = useState<A2UIMessage[]>(initialMessages);
  const [messageEditorText, setMessageEditorText] = useState(() => formatMessagesJson(initialMessages));
  const messagesRef = useRef<A2UIMessage[]>(initialMessages);
  const [messagesJsonError, setMessagesJsonError] = useState<string | null>(null);

  /** 切换协议、示例或左侧 JSON 解析结果变化时递增，强制右侧预览 remount */
  const [previewKey, setPreviewKey] = useState(0);
  const [committedRemoteUrls, setCommittedRemoteUrls] = useState<string[]>([]);

  useEffect(() => {
    const tenantId = (() => {
      if (typeof window === 'undefined') return '';
      const fromSearch = new URLSearchParams(window.location.search).get('tenantId');
      if (fromSearch) return fromSearch;
      return sessionStorage.getItem('botSelectedTenantID') || '';
    })();
    // 本地 custElement 已注册的组件不再拉远程 ESM，避免旧远程 bundle 覆盖本地实现
    const localRegisteredTypes = Object.keys(a2uiTestCustomComponents);
    const remoteOnlyTypes = pickCustomComponents(
      Array.isArray(messages) ? messages : [],
      localRegisteredTypes,
    );
    setCommittedRemoteUrls(
      remoteOnlyTypes.map(
        (component) =>
          resolveApiUrl(`/file/downloadA2uiCompent?compName=${component}&tenantId=${tenantId}`),
      ),
    );
  }, [messages]);

  // 远程组件 URL 输入和提交状态
  const handleAction = (action: { name: string; context: any }) => {
    const preview =
      action.context && typeof action.context === 'object'
        ? JSON.stringify(action.context)
        : String(action.context);
    message.info(`${action.name}: ${preview.slice(0, 120)}${preview.length > 120 ? '…' : ''}`, 3);
    console.log('Action:', action);
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

  const syncUrlSearchParams = (
    nextVersion: A2UIProtocolVersion,
    nextPreset: A2UIDemoPreset,
    nextTheme: A2UIThemePreset,
  ) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set(A2UI_PROTOCOL_QUERY_KEY, nextVersion);
    let demoParam = 'registration';
    if (nextPreset === 'custom') {
      demoParam = 'custom';
    } else if (nextPreset === 'remote') {
      demoParam = 'remote';
    }
    url.searchParams.set(A2UI_DEMO_PRESET_QUERY_KEY, demoParam);
    url.searchParams.set(A2UI_THEME_QUERY_KEY, nextTheme);
    window.history.replaceState(null, '', url.toString());
  };

  const handleProtocolVersionChange = (value: A2UIProtocolVersion) => {
    if (demoPreset === 'remote') {
      message.info('「远程 ESM 联调」示例固定为协议 0.9');
      return;
    }
    const nextVersion: A2UIProtocolVersion = value === '0.9' ? '0.9' : '0.8';
    if (nextVersion === protocolVersion) return;
    const nextMessages = messagesForPreset(nextVersion, demoPreset);
    setProtocolVersion(nextVersion);
    messagesRef.current = nextMessages;
    setMessages(nextMessages);
    setMessageEditorText(formatMessagesJson(nextMessages));
    setMessagesJsonError(null);
    setPreviewKey((k) => k + 1);
    syncUrlSearchParams(nextVersion, demoPreset, themePreset);
  };

  const handleThemePresetChange = (next: A2UIThemePreset) => {
    if (next === themePreset) return;
    setThemePreset(next);
    setPreviewKey((k) => k + 1);
    syncUrlSearchParams(protocolVersion, demoPreset, next);
  };

  const handleDemoPresetChange = (next: A2UIDemoPreset) => {
    if (next === demoPreset) return;
    if (next === 'remote') {
      const nextMessages = messagesForPreset('0.9', 'remote');
      setDemoPreset('remote');
      setProtocolVersion('0.9');
      messagesRef.current = nextMessages;
      setMessages(nextMessages);
      setMessageEditorText(formatMessagesJson(nextMessages));
      setMessagesJsonError(null);
      setPreviewKey((k) => k + 1);
      syncUrlSearchParams('0.9', 'remote', themePreset);
      return;
    }
    const nextMessages = messagesForPreset(protocolVersion, next);
    setDemoPreset(next);
    messagesRef.current = nextMessages;
    setMessages(nextMessages);
    setMessageEditorText(formatMessagesJson(nextMessages));
    setMessagesJsonError(null);
    setPreviewKey((k) => k + 1);
    syncUrlSearchParams(protocolVersion, next, themePreset);
  };


  const previewProtocol: A2UIProtocolVersion = demoPreset === 'remote' ? '0.9' : protocolVersion;

  const previewMessages = React.useMemo(() => {
    if (demoPreset !== 'custom') return messages;
    const badgeText = SHOWCASE_THEME_BADGE[themePreset];
    if (!badgeText) return messages;
    return patchTravelFormBadge(messages, badgeText);
  }, [messages, demoPreset, themePreset]);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarTitle}>A2UI Playground</div>
        <Space wrap size="middle" align="center">
          <Space size="small" align="center">
            <span className={styles.toolbarLabel}>协议</span>
            <Select<A2UIProtocolVersion>
              size="small"
              value={protocolVersion}
              disabled={demoPreset === 'remote'}
              style={{ width: 128 }}
              options={[...PROTOCOL_SELECT_OPTIONS]}
              onChange={(v) => handleProtocolVersionChange(v)}
            />
          </Space>
          <Space size="small" align="center">
            <span className={styles.toolbarLabel}>示例</span>
            <Select<A2UIDemoPreset>
              size="small"
              value={demoPreset}
              style={{ width: 168 }}
              options={[...DEMO_SELECT_OPTIONS]}
              onChange={(v) => handleDemoPresetChange(v)}
            />
          </Space>
          <Space size="small" align="center">
            <span className={styles.toolbarLabel}>主题</span>
            <Select<A2UIThemePreset>
              size="small"
              value={themePreset}
              style={{ width: 140 }}
              options={[...THEME_SELECT_OPTIONS]}
              onChange={(v) => handleThemePresetChange(v)}
            />
          </Space>
        </Space>
      </div>

      <div className={styles.playgroundBody}>
        <Row gutter={[16, 16]} className={styles.mainRow}>
          <Col xs={24} lg={11} className={styles.panel}>
            <div className={styles.panelLabel}>Messages</div>
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
                placeholder="A2UI 消息 JSON 数组，合法内容会在约 0.4 秒内自动同步到右侧预览；⌘S 或 Ctrl+S 立即校验并提示"
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
          <Col xs={24} lg={13} className={styles.panel}>
            <div className={styles.panelLabel}>预览</div>
            <div className={styles.previewPane}>
              <div
                key={`main-${previewProtocol}-${demoPreset}-${themePreset}-${previewKey}`}
                className={styles.rendererWrapper}
              >
                <BaseRenderer
                  messages={previewMessages}
                  protocolVersion={previewProtocol}
                  onAction={handleAction}
                  customComponents={a2uiTestCustomComponents}
                  remoteComponentUrls={committedRemoteUrls.length > 0 ? committedRemoteUrls : undefined}
                  injectAntdStylesInShadow={committedRemoteUrls.length > 0}
                  themePreset={themePreset}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default A2UITest;
