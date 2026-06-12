import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { Alert, Input, message } from 'antd';
import { BaseRenderer, type A2UIMessage } from '@boteai/a2ui-render';
import { a2uiPresetComponentRegistry, a2uiPresetComponentSchemas } from '@boteai/a2ui-comp-preset';
import {
  CATALOG_CATEGORY_LABELS,
  PRESET_CATALOG_BY_NAME,
  PRESET_CATALOG_ITEMS,
  PRESET_QUERY_KEY,
  type CatalogCategoryId,
  type PresetCatalogItem,
} from './catalogData';
import { extractPropsFromSchema } from './schemaUtils';
import styles from './index.less';

const { TextArea } = Input;
const MESSAGES_JSON_DEBOUNCE_MS = 300;

function formatMessagesJson(messages: A2UIMessage[]): string {
  return JSON.stringify(messages, null, 2);
}

function readComponentFromQuery(): string {
  if (typeof window === 'undefined') return PRESET_CATALOG_ITEMS[0].name;
  const hash = window.location.hash;
  const queryStart = hash.indexOf('?');
  if (queryStart === -1) return PRESET_CATALOG_ITEMS[0].name;
  const params = new URLSearchParams(hash.slice(queryStart + 1));
  const value = params.get(PRESET_QUERY_KEY);
  if (value && PRESET_CATALOG_BY_NAME[value]) return value;
  return PRESET_CATALOG_ITEMS[0].name;
}

function writeComponentToQuery(name: string) {
  const { pathname, search } = window.location;
  const baseHash = window.location.hash.split('?')[0];
  const params = new URLSearchParams();
  params.set(PRESET_QUERY_KEY, name);
  window.history.replaceState(null, '', `${pathname}${search}${baseHash}?${params.toString()}`);
}

type MessagesEditorProps = {
  value: string;
  error: string | null;
  onChange: (next: string) => void;
};

const MessagesEditor: React.FC<MessagesEditorProps> = ({ value, error, onChange }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      message.success('已复制');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      message.error('复制失败');
    }
  }, [value]);

  return (
    <div className={styles.messagesEditorWrap}>
      <button type="button" className={styles.copyBtn} onClick={handleCopy} aria-label="复制">
        {copied ? <CheckOutlined /> : <CopyOutlined />}
      </button>
      <TextArea
        className={styles.messageEditor}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        autoSize={{ minRows: 20 }}
      />
      {error ? (
        <Alert type="error" showIcon message={error} className={styles.messageEditorError} />
      ) : null}
    </div>
  );
};

type PropsTableProps = {
  componentName: string;
};

const PropsTable: React.FC<PropsTableProps> = ({ componentName }) => {
  const rows = useMemo(() => {
    const schema = a2uiPresetComponentSchemas[componentName];
    if (!schema || typeof schema !== 'object') return [];
    return extractPropsFromSchema(schema as Record<string, unknown>);
  }, [componentName]);

  if (rows.length === 0) {
    return <p>暂无 API 定义</p>;
  }

  return (
    <table className={styles.propsTable}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td>
              <span className={styles.propName}>{row.name}</span>
              {row.required ? <span className={styles.requiredTag}>required</span> : null}
            </td>
            <td>
              <span className={styles.typeTag}>{row.type}</span>
              {row.description !== '-' ? (
                <div style={{ marginTop: 6, color: '#64677a', fontSize: 13 }}>{row.description}</div>
              ) : null}
            </td>
            <td>{row.defaultValue}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

type ComponentDetailProps = {
  item: PresetCatalogItem;
};

const ComponentDetail: React.FC<ComponentDetailProps> = ({ item }) => {
  const [previewMessages, setPreviewMessages] = useState<A2UIMessage[]>(item.messages);
  const [editorText, setEditorText] = useState(() => formatMessagesJson(item.messages));
  const [messagesJsonError, setMessagesJsonError] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const messagesRef = useRef(item.messages);

  useEffect(() => {
    messagesRef.current = item.messages;
    setPreviewMessages(item.messages);
    setEditorText(formatMessagesJson(item.messages));
    setMessagesJsonError(null);
    setPreviewKey((key) => key + 1);
  }, [item.name, item.messages]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const parsed = JSON.parse(editorText) as unknown;
        if (!Array.isArray(parsed)) {
          setMessagesJsonError('Messages 须为 JSON 数组');
          return;
        }
        const next = parsed as A2UIMessage[];
        if (JSON.stringify(next) === JSON.stringify(messagesRef.current)) {
          setMessagesJsonError(null);
          return;
        }
        messagesRef.current = next;
        setPreviewMessages(next);
        setMessagesJsonError(null);
        setPreviewKey((key) => key + 1);
      } catch {
        setMessagesJsonError('JSON 格式错误');
      }
    }, MESSAGES_JSON_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [editorText]);

  return (
    <>
      <h1 className={styles.componentTitle}>{item.displayName}</h1>
      <p className={styles.componentDesc}>{item.description}</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Preview</h2>
        <div className={styles.previewBox}>
          <div className={styles.rendererWrap}>
            <BaseRenderer
              key={`${item.name}-${previewKey}`}
              messages={previewMessages}
              protocolVersion="0.9"
              customComponents={a2uiPresetComponentRegistry}
              themePreset="default"
              injectAntdStylesInShadow
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Messages</h2>
        <MessagesEditor value={editorText} error={messagesJsonError} onChange={setEditorText} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Props</h2>
        <PropsTable componentName={item.name} />
      </section>
    </>
  );
};

const PresetCatalogPage: React.FC = () => {
  const [activeName, setActiveName] = useState(readComponentFromQuery);

  const grouped = useMemo(() => {
    const map = new Map<CatalogCategoryId, PresetCatalogItem[]>();
    PRESET_CATALOG_ITEMS.forEach((item) => {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    });
    return map;
  }, []);

  const activeItem = PRESET_CATALOG_BY_NAME[activeName] ?? PRESET_CATALOG_ITEMS[0];

  const handleSelect = useCallback((name: string) => {
    setActiveName(name);
    writeComponentToQuery(name);
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>A2UI 预设组件库</h1>
        <span className={styles.headerUnderline} />
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          {Array.from(grouped.entries()).map(([categoryId, items]) => (
            <div key={categoryId} className={styles.categoryBlock}>
              <div className={styles.categoryLabel}>{CATALOG_CATEGORY_LABELS[categoryId]}</div>
              <ul className={styles.navList}>
                {items.map((item) => (
                  <li key={item.name} className={styles.navItem}>
                    <button
                      type="button"
                      className={`${styles.navLink} ${activeName === item.name ? styles.navLinkActive : ''}`}
                      onClick={() => handleSelect(item.name)}
                    >
                      {item.displayName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        <main className={styles.content}>
          <ComponentDetail key={activeItem.name} item={activeItem} />
        </main>
      </div>
    </div>
  );
};

export default PresetCatalogPage;
