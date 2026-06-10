import type { A2UIMessage } from '@bote/a2ui-render';

export type GalleryCategoryId = 'all' | 'card' | 'form' | 'data' | 'special';

export type GalleryItem = {
  id: string;
  label: string;
  description?: string;
  category: Exclude<GalleryCategoryId, 'all'>;
  messages: A2UIMessage[];
  /** 关联的开发指南文档 URL（站内静态路径或外链，新标签页打开） */
  guideUrl?: string;
};

type V09GalleryFile = {
  name?: string;
  description?: string;
  messages?: A2UIMessage[];
};

/** 与 @bote/a2ui-render litCompat09 中 basicCatalog.id 对齐 */
const V09_BASIC_CATALOG_ID = 'https://a2ui.org/specification/v0_9/basic_catalog.json';

function normalizeV09GalleryMessages(messages: A2UIMessage[]): A2UIMessage[] {
  return messages.map((msg) => {
    const record = msg as Record<string, unknown>;
    const createSurface = record.createSurface;
    if (!createSurface || typeof createSurface !== 'object') return msg;
    const cs = createSurface as Record<string, unknown>;
    const catalogId = cs.catalogId;
    if (catalogId == null) return msg;
    const id = String(catalogId).trim();
    if (
      id === V09_BASIC_CATALOG_ID
      || id.endsWith('/catalogs/basic/catalog.json')
      || ['standard', 'default', 'basic'].includes(id.toLowerCase())
    ) {
      return {
        ...record,
        createSurface: {
          ...cs,
          catalogId: V09_BASIC_CATALOG_ID,
        },
      } as A2UIMessage;
    }
    return msg;
  });
}

function slugFromFilename(filename: string): string {
  return filename.replace(/^\d+_/, '').replace(/\.json$/i, '');
}

function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function inferGalleryCategory(id: string): Exclude<GalleryCategoryId, 'all'> {
  if (/login|form|notification|email-compose|advanced-form|live-invitation/.test(id)) return 'form';
  if (/stats|financial|dashboard|workout|step-counter|account-balance|track-list|countdown/.test(id)) {
    return 'data';
  }
  if (/modal|markdown|child-list|incremental|remote-showcase|calendar|flight|weather/.test(id)) {
    return 'special';
  }
  return 'card';
}

/** v0.9 官方 gallery 示例：{ name, messages } 包装 */
export function buildGalleryFromV09Context(
  context: __WebpackModuleApi.RequireContext,
): GalleryItem[] {
  return context
    .keys()
    .sort()
    .map((key) => {
      const raw = context(key) as V09GalleryFile | { default: V09GalleryFile };
      const file = 'default' in raw && raw.default ? raw.default : (raw as V09GalleryFile);
      const filename = key.replace('./', '');
      const id = slugFromFilename(filename);
      return {
        id,
        label: file.name?.trim() || titleFromSlug(id),
        description: file.description?.trim(),
        category: inferGalleryCategory(id),
        messages: normalizeV09GalleryMessages(
          Array.isArray(file.messages) ? file.messages : [],
        ),
      };
    })
    .filter((item) => item.messages.length > 0);
}

/** v0.8 官方 gallery 示例：messages 数组 */
export function buildGalleryFromV08Context(
  context: __WebpackModuleApi.RequireContext,
): GalleryItem[] {
  return context
    .keys()
    .sort()
    .map((key) => {
      const raw = context(key) as A2UIMessage[] | { default: A2UIMessage[] };
      const messages = Array.isArray(raw) ? raw : raw.default;
      const filename = key.replace('./', '');
      const id = slugFromFilename(filename);
      return {
        id,
        label: titleFromSlug(id),
        category: inferGalleryCategory(id),
        messages: Array.isArray(messages) ? messages : [],
      };
    })
    .filter((item) => item.messages.length > 0);
}

export function galleryToDemoOptions(items: GalleryItem[]) {
  return items.map((item) => ({ label: item.label, value: item.id }));
}

export function getGalleryMessages(items: GalleryItem[], id: string): A2UIMessage[] {
  return items.find((item) => item.id === id)?.messages ?? items[0]?.messages ?? [];
}

export function resolveDemoId(requested: string | null, items: GalleryItem[], fallback: string): string {
  const ids = new Set(items.map((item) => item.id));
  if (requested && ids.has(requested)) return requested;
  if (ids.has(fallback)) return fallback;
  return items[0]?.id ?? fallback;
}
