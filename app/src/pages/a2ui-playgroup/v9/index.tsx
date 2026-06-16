import React, { useMemo } from 'react';
import type { A2UIMessage } from '@boteai/a2ui-render';
import GalleryPlayground from '../shared/GalleryPlayground';
import showcaseMessages from './mock/showcase.json';
import { a2uiV9CustomComponents } from './remoteRegistry';
import { V9_GALLERY_ITEMS, V9_REMOTE_SHOWCASE_ID, V9_CUSTOM_COMPONENTS_GUIDE_PATH } from './gallery';
import type { GalleryItem } from '../shared/gallery';

const V9_PRESET_CATALOG_PATH = '/a2ui-preset-catalog';

const REMOTE_SHOWCASE_ITEM: GalleryItem = {
  id: V9_REMOTE_SHOWCASE_ID,
  label: '自定义组件示例集',
  description: '展示 4 个自定义组件：原生 DOM、React 桥接、Shadow 样式、Action 派发',
  category: 'special',
  messages: showcaseMessages as A2UIMessage[],
  guideUrl: V9_CUSTOM_COMPONENTS_GUIDE_PATH,
};

function withPresetCatalogLink(items: GalleryItem[]): GalleryItem[] {
  return items.map((item) => (
    item.id.startsWith('preset-')
      ? { ...item, guideUrl: V9_PRESET_CATALOG_PATH }
      : item
  ));
}

const A2UIPlaygroupV9: React.FC = () => {
  const galleryItems = useMemo(
    () => withPresetCatalogLink([REMOTE_SHOWCASE_ITEM, ...V9_GALLERY_ITEMS]),
    [],
  );

  return (
    <GalleryPlayground
      pageTitle="协议 v0.9"
      protocolVersion="0.9"
      galleryItems={galleryItems}
      customComponents={a2uiV9CustomComponents}
      injectAntdStylesInShadow
      peerPath="/a2ui-playgroup/v8"
      peerLabel="协议 0.8"
    />
  );
};

export default A2UIPlaygroupV9;
