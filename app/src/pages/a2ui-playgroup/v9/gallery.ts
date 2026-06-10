import {
  buildGalleryFromV09Context,
  galleryToDemoOptions,
  getGalleryMessages,
  resolveDemoId,
  type GalleryItem,
} from '../shared/gallery';

const galleryContext = require.context('./mock/gallery', false, /\.json$/);

export const V9_GALLERY_ITEMS: GalleryItem[] = buildGalleryFromV09Context(galleryContext);

export const V9_GALLERY_DEMO_OPTIONS = galleryToDemoOptions(V9_GALLERY_ITEMS);

export const V9_DEFAULT_GALLERY_ID = V9_GALLERY_ITEMS[0]?.id ?? 'flight-status';

export const V9_REMOTE_SHOWCASE_ID = 'remote-showcase';

export const V9_CUSTOM_COMPONENTS_GUIDE_PATH = '/a2ui-playgroup/v9/custom-components';

export function getV9GalleryMessages(demoId: string) {
  return getGalleryMessages(V9_GALLERY_ITEMS, demoId);
}

export function resolveV9DemoId(requested: string | null) {
  return resolveDemoId(requested, V9_GALLERY_ITEMS, V9_DEFAULT_GALLERY_ID);
}
