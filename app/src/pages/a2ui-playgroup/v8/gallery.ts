import {
  buildGalleryFromV08Context,
  galleryToDemoOptions,
  getGalleryMessages,
  resolveDemoId,
  type GalleryItem,
} from '../shared/gallery';

const galleryContext = require.context('./mock/gallery', false, /\.json$/);

export const V8_GALLERY_ITEMS: GalleryItem[] = buildGalleryFromV08Context(galleryContext);

export const V8_GALLERY_DEMO_OPTIONS = galleryToDemoOptions(V8_GALLERY_ITEMS);

export const V8_DEFAULT_GALLERY_ID = V8_GALLERY_ITEMS[0]?.id ?? 'flight-status';

export function getV8GalleryMessages(demoId: string) {
  return getGalleryMessages(V8_GALLERY_ITEMS, demoId);
}

export function resolveV8DemoId(requested: string | null) {
  return resolveDemoId(requested, V8_GALLERY_ITEMS, V8_DEFAULT_GALLERY_ID);
}
