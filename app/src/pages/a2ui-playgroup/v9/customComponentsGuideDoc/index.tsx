import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { navigateTo } from '../../shared/navigate';
import { V9_CUSTOM_COMPONENTS_GUIDE_MD, V9_REMOTE_SHOWCASE_ID } from '../gallery';
import {
  extractHeadings,
  flattenHeadingText,
  type TocItem,
} from './tocUtils';
import styles from './index.less';

const PLAYGROUND_PATH = '/a2ui-playgroup/v9';

/** 目录展示 h2–h4，跳过文档 h1 */
const TOC_MIN_LEVEL = 2;
const TOC_MAX_LEVEL = 4;

function buildHeadingKey(level: number, text: string): string {
  return `${level}:${text}`;
}

const CustomComponentsGuideDoc: React.FC = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>('');

  const contentRef = useRef<HTMLElement>(null);
  const headingQueueRef = useRef<TocItem[]>([]);

  const headings = useMemo(() => extractHeadings(content), [content]);

  const tocItems = useMemo(
    () => headings.filter((item) => item.level >= TOC_MIN_LEVEL && item.level <= TOC_MAX_LEVEL),
    [headings],
  );

  const headingKeyToId = useMemo(() => {
    const map = new Map<string, string>();
    headings.forEach((item) => {
      map.set(buildHeadingKey(item.level, item.text), item.id);
    });
    return map;
  }, [headings]);

  useEffect(() => {
    let cancelled = false;

    async function loadDoc() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(V9_CUSTOM_COMPONENTS_GUIDE_MD);
        if (!res.ok) {
          throw new Error(`加载失败 (${res.status})`);
        }
        const text = await res.text();
        if (!cancelled) {
          setContent(text);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '加载文档失败');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDoc();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    headingQueueRef.current = [...headings];
  }, [headings]);

  useEffect(() => {
    const root = contentRef.current;
    if (!root || tocItems.length === 0) return undefined;

    const visibleIds = tocItems.map((item) => item.id);
    const elements = visibleIds
      .map((id) => root.querySelector<HTMLElement>(`#${CSS.escape(id)}`))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root,
        rootMargin: '-8% 0px -75% 0px',
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [content, tocItems]);

  const markdownComponents = useMemo<Components>(() => {
    const makeHeading =
      (Tag: 'h1' | 'h2' | 'h3' | 'h4', level: number) =>
      ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
        const text = flattenHeadingText(children);
        const id =
          headingKeyToId.get(buildHeadingKey(level, text))
          ?? headingQueueRef.current.shift()?.id;

        return (
          <Tag id={id} {...props}>
            {children}
          </Tag>
        );
      };

    return {
      h1: makeHeading('h1', 1),
      h2: makeHeading('h2', 2),
      h3: makeHeading('h3', 3),
      h4: makeHeading('h4', 4),
    };
  }, [headingKeyToId]);

  const scrollToHeading = useCallback((id: string) => {
    const root = contentRef.current;
    const target = root?.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  }, []);

  const goBack = () => {
    navigateTo(PLAYGROUND_PATH, { a2uiDemo: V9_REMOTE_SHOWCASE_ID });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={goBack}>
          <ArrowLeftOutlined /> 返回 Playground
        </button>
        <h1 className={styles.title}>自定义组件开发指南</h1>
      </header>

      <div className={styles.body}>
        {!loading && !error && tocItems.length > 0 ? (
          <nav className={styles.sidebar} aria-label="文档目录">
            <div className={styles.sidebarTitle}>目录</div>
            <ul className={styles.tocList}>
              {tocItems.map((item) => (
                <li
                  key={item.id}
                  className={styles.tocItem}
                  data-level={item.level}
                >
                  <button
                    type="button"
                    className={`${styles.tocLink}${activeId === item.id ? ` ${styles.tocLinkActive}` : ''}`}
                    onClick={() => scrollToHeading(item.id)}
                  >
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <main ref={contentRef} className={styles.content}>
          {loading ? <p className={styles.status}>加载中…</p> : null}
          {error ? <p className={styles.error}>{error}</p> : null}
          {!loading && !error && content ? (
            <article className={styles.prose}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {content}
              </ReactMarkdown>
            </article>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default CustomComponentsGuideDoc;
