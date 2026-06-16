import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AppstoreOutlined,
  BarChartOutlined,
  BookOutlined,
  CloseOutlined,
  CodeOutlined,
  ExperimentOutlined,
  FormOutlined,
  SearchOutlined,
  StarFilled,
} from '@ant-design/icons';
import { Input, Modal } from 'antd';
import {
  A2UI_THEME_PRESET_NAMES,
  BaseRenderer,
  type A2UIMessage,
  type A2UIThemePreset,
} from '@boteai/a2ui-render';
import type { A2UICustomComponentRegistry } from '@boteai/a2ui-custom-kit';
import DemoCard from './DemoCard';
import { GALLERY_CATEGORIES, GALLERY_CATEGORY_LABELS } from './galleryCategories';
import type { GalleryCategoryId, GalleryItem } from './gallery';
import PlaygroundEditor from './PlaygroundEditor';
import { openGuideUrl } from './navigate';
import styles from './index.less';

const A2UI_DEMO_QUERY_KEY = 'a2uiDemo';
const A2UI_THEME_QUERY_KEY = 'a2uiTheme';
const FAVORITES_STORAGE_KEY = 'a2ui-playgroup-favorites';

const THEME_PRESET_LABELS: Record<A2UIThemePreset, string> = {
  default: '默认',
  conversation: '对话标准',
  cyber: '炫彩科技',
  platformInterconnect: '平台互联',
  deepBlueWisdom: '深蓝智慧',
};

const THEME_PRESET_OPTIONS = A2UI_THEME_PRESET_NAMES.map((value) => ({
  label: THEME_PRESET_LABELS[value],
  value,
}));

const CATEGORY_ICONS: Record<GalleryCategoryId, React.ReactNode> = {
  all: <AppstoreOutlined />,
  card: <AppstoreOutlined />,
  form: <FormOutlined />,
  data: <BarChartOutlined />,
  special: <ExperimentOutlined />,
};

export type GalleryPlaygroundProps = {
  pageTitle: string;
  protocolVersion: '0.8' | '0.9';
  galleryItems: GalleryItem[];
  customComponents: A2UICustomComponentRegistry;
  patchMessages?: (messages: A2UIMessage[], themePreset: A2UIThemePreset, demo: string) => A2UIMessage[];
  injectAntdStylesInShadow?: boolean;
  peerPath?: string;
  peerLabel?: string;
};

function isA2UIThemePreset(value: string | null): value is A2UIThemePreset {
  return value != null && (A2UI_THEME_PRESET_NAMES as readonly string[]).includes(value);
}

function getThemePresetFromUrl(): A2UIThemePreset {
  if (typeof window === 'undefined') return 'conversation';
  const value = new URLSearchParams(window.location.search).get(A2UI_THEME_QUERY_KEY);
  return isA2UIThemePreset(value) ? value : 'conversation';
}

function readFavorites(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []);
  } catch {
    return new Set();
  }
}

function persistFavorites(ids: Set<string>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...ids]));
}

const GalleryPlayground: React.FC<GalleryPlaygroundProps> = ({
  pageTitle,
  protocolVersion,
  galleryItems,
  customComponents,
  patchMessages,
  injectAntdStylesInShadow,
  peerPath,
  peerLabel,
}) => {
  const [category, setCategory] = useState<GalleryCategoryId>('all');
  const [search, setSearch] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [themePreset, setThemePreset] = useState<A2UIThemePreset>(getThemePresetFromUrl);
  const [favorites, setFavorites] = useState<Set<string>>(readFavorites);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [editorItem, setEditorItem] = useState<GalleryItem | null>(null);

  const syncUrlTheme = useCallback((nextTheme: A2UIThemePreset) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set(A2UI_THEME_QUERY_KEY, nextTheme);
    url.searchParams.delete(A2UI_DEMO_QUERY_KEY);
    window.history.replaceState(null, '', url.toString());
  }, []);

  const handleThemeChange = (next: A2UIThemePreset) => {
    setThemePreset(next);
    syncUrlTheme(next);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      persistFavorites(next);
      return next;
    });
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<GalleryCategoryId, number> = {
      all: galleryItems.length,
      card: 0,
      form: 0,
      data: 0,
      special: 0,
    };
    galleryItems.forEach((item) => {
      counts[item.category] += 1;
    });
    return counts;
  }, [galleryItems]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const base = showFavoritesOnly
      ? galleryItems.filter((item) => favorites.has(item.id))
      : galleryItems;
    return base.filter((item) => {
      if (!showFavoritesOnly && category !== 'all' && item.category !== category) return false;
      if (!keyword) return true;
      const haystack = `${item.label} ${item.description ?? ''} ${item.id}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [galleryItems, category, search, showFavoritesOnly, favorites]);

  const favoriteItems = useMemo(
    () => galleryItems.filter((item) => favorites.has(item.id)),
    [galleryItems, favorites],
  );

  const getPreviewMessages = useCallback(
    (item: GalleryItem) => {
      if (!patchMessages) return item.messages;
      return patchMessages(item.messages, themePreset, item.id);
    },
    [patchMessages, themePreset],
  );

  const peerHref = peerPath
    ? `${peerPath}${themePreset !== 'conversation' ? `?${A2UI_THEME_QUERY_KEY}=${themePreset}` : ''}`
    : undefined;

  const openEditor = (item: GalleryItem) => {
    setActiveItem(null);
    setEditorItem(item);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set(A2UI_DEMO_QUERY_KEY, item.id);
      window.history.replaceState(null, '', url.toString());
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const demoId = new URLSearchParams(window.location.search).get(A2UI_DEMO_QUERY_KEY);
    if (!demoId) return;
    const item = galleryItems.find((g) => g.id === demoId);
    if (item) setEditorItem(item);
  }, [galleryItems]);

  const activeIndex = activeItem
    ? filteredItems.findIndex((item) => item.id === activeItem.id)
    : -1;

  return (
    <div className={styles.galleryPage}>
      <header className={styles.galleryHeader}>
        <div className={styles.galleryHeaderLeft}>
          <div className={styles.galleryLogo}>
            <span className={styles.galleryLogoMark}>A2</span>
            <div>
              <div className={styles.galleryLogoTitle}>A2UI Playground</div>
              <div className={styles.galleryLogoVersion}>{pageTitle}</div>
            </div>
          </div>
        </div>
        <div className={styles.galleryHeaderCenter}>
          <div className={styles.gallerySlogan}>探索 · 体验 · 创造</div>
          <div className={styles.gallerySloganSub}>A2UI 组件示例库，一页浏览全部 Demo</div>
        </div>
        <div className={styles.galleryHeaderRight}>
          {peerHref && peerLabel ? (
            <a className={styles.galleryPeerLink} href={peerHref}>
              切换到 {peerLabel}
            </a>
          ) : null}
        </div>
      </header>

      <div className={styles.galleryLayout}>
        <aside className={styles.gallerySidebar}>
          <nav className={styles.sidebarNav}>
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.sidebarNavItem} ${!showFavoritesOnly && category === cat.id ? styles.sidebarNavItemActive : ''}`}
                onClick={() => {
                  setShowFavoritesOnly(false);
                  setCategory(cat.id);
                }}
              >
                <span className={styles.sidebarNavIcon}>{CATEGORY_ICONS[cat.id]}</span>
                <span className={styles.sidebarNavLabel}>{cat.label}</span>
                <span className={styles.sidebarNavCount}>{categoryCounts[cat.id]}</span>
              </button>
            ))}
            {favoriteItems.length > 0 ? (
              <button
                type="button"
                className={`${styles.sidebarNavItem} ${showFavoritesOnly ? styles.sidebarNavItemActive : ''}`}
                onClick={() => setShowFavoritesOnly(true)}
              >
                <span className={styles.sidebarNavIcon}><StarFilled /></span>
                <span className={styles.sidebarNavLabel}>我的收藏</span>
                <span className={styles.sidebarNavCount}>{favoriteItems.length}</span>
              </button>
            ) : null}
          </nav>
          <div className={styles.sidebarPromo}>
            <div className={styles.sidebarPromoTitle}>快速开始</div>
            <div className={styles.sidebarPromoDesc}>点击卡片预览组件，或使用按钮进入 JSON 编辑模式</div>
          </div>
        </aside>

        <main className={styles.galleryMain}>
          <div className={styles.galleryToolbar}>
            <div className={styles.galleryToolbarTitle}>
              {showFavoritesOnly
                ? '我的收藏'
                : (GALLERY_CATEGORIES.find((c) => c.id === category)?.label ?? '全部组件')}
              <span className={styles.galleryToolbarCount}>（{filteredItems.length}）</span>
            </div>
            <Input
              className={styles.gallerySearch}
              prefix={<SearchOutlined />}
              placeholder="搜索组件…"
              allowClear
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.themeBar}>
            <span className={styles.themeBarLabel}>主题</span>
            <div className={styles.themeChips}>
              {THEME_PRESET_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.themeChip} ${themePreset === opt.value ? styles.themeChipActive : ''}`}
                  onClick={() => handleThemeChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.demoGrid}>
            {filteredItems.map((item, index) => (
              <DemoCard
                key={item.id}
                item={item}
                index={index}
                themePreset={themePreset}
                protocolVersion={protocolVersion}
                customComponents={customComponents}
                previewMessages={getPreviewMessages(item)}
                injectAntdStylesInShadow={injectAntdStylesInShadow}
                isFavorite={favorites.has(item.id)}
                onToggleFavorite={toggleFavorite}
                onOpen={setActiveItem}
                onUse={openEditor}
              />
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div className={styles.galleryEmpty}>暂无匹配的组件示例</div>
          ) : null}
        </main>
      </div>

      <Modal
        visible={!!activeItem}
        footer={null}
        width={720}
        centered
        destroyOnClose
        className={styles.detailModal}
        closeIcon={<CloseOutlined />}
        onCancel={() => setActiveItem(null)}
        title={activeItem ? `${String(activeIndex + 1).padStart(2, '0')} ${activeItem.label}` : undefined}
      >
        {activeItem ? (
          <div className={styles.detailModalBody}>
            <div className={styles.detailModalPreview}>
              <BaseRenderer
                messages={getPreviewMessages(activeItem)}
                protocolVersion={protocolVersion}
                customComponents={customComponents}
                themePreset={themePreset}
                injectAntdStylesInShadow={injectAntdStylesInShadow}
                onAction={() => {}}
              />
            </div>
            <div className={styles.detailModalMeta}>
              <span className={styles.detailModalTag}>
                {GALLERY_CATEGORY_LABELS[activeItem.category]}
              </span>
              {activeItem.description ? (
                <p className={styles.detailModalDesc}>{activeItem.description}</p>
              ) : null}
            </div>
            <div className={styles.detailModalActions}>
              <button type="button" className={styles.detailModalBtnSecondary} onClick={() => setActiveItem(null)}>
                关闭
              </button>
              {activeItem.guideUrl ? (
                <button
                  type="button"
                  className={styles.detailModalBtnGuide}
                  onClick={() => {
                    setActiveItem(null);
                    openGuideUrl(activeItem.guideUrl!);
                  }}
                >
                  <BookOutlined /> 开发指南
                </button>
              ) : null}
              <button
                type="button"
                className={styles.detailModalBtnPrimary}
                onClick={() => openEditor(activeItem)}
              >
                <CodeOutlined /> 编辑 JSON
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        visible={!!editorItem}
        footer={null}
        width="96vw"
        style={{ top: 16, maxWidth: 1400 }}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        className={styles.editorModal}
        closeIcon={<CloseOutlined />}
        onCancel={() => {
          setEditorItem(null);
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete(A2UI_DEMO_QUERY_KEY);
            window.history.replaceState(null, '', url.toString());
          }
        }}
        title={editorItem ? `编辑 · ${editorItem.label}` : undefined}
      >
        {editorItem ? (
          <PlaygroundEditor
            protocolVersion={protocolVersion}
            demoLabel={editorItem.label}
            demoId={editorItem.id}
            initialMessages={editorItem.messages}
            themePreset={themePreset}
            customComponents={customComponents}
            patchMessages={patchMessages}
            injectAntdStylesInShadow={injectAntdStylesInShadow}
          />
        ) : null}
      </Modal>
    </div>
  );
};

export default GalleryPlayground;
