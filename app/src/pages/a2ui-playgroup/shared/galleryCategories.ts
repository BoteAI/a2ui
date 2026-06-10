import type { GalleryCategoryId } from './gallery';

export type GalleryCategoryDef = {
  id: GalleryCategoryId;
  label: string;
};

export const GALLERY_CATEGORIES: GalleryCategoryDef[] = [
  { id: 'all', label: '全部组件' },
  { id: 'card', label: '卡片展示' },
  { id: 'form', label: '表单交互' },
  { id: 'data', label: '数据报表' },
  { id: 'special', label: '特殊场景' },
];

export const GALLERY_CATEGORY_LABELS: Record<Exclude<GalleryCategoryId, 'all'>, string> = {
  card: '卡片展示',
  form: '表单交互',
  data: '数据报表',
  special: '特殊场景',
};
