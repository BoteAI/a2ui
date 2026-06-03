/**
 * 默认主题：与 @a2ui/lit v0.9 basic catalog adopted stylesheet 对齐的 CSS 变量名。
 * 经 mergeLitSurfaceStyleVars 写入 a2ui-surface 宿主 style，继承进各组件 shadow。
 *
 *   themePreset="conversation"
 *   或 styleVars={{ ...DEFAULT_A2UI_LIT_STYLE_VARS, ...userTheme }}
 *
 * 历史业务键（a2ui-button-bg、a2ui-input-* 等）仍可通过 styleVars 传入，
 * 由 litStyleVars 在运行时桥接到本表同名官方 token。
 */
export const DEFAULT_A2UI_LIT_STYLE_VARS: Record<string, string | number> = {
  // 语义色
  'a2ui-color-background': '#f5f5f5',
  'a2ui-color-on-background': '#1f1f1f',
  'a2ui-color-surface': '#ffffff',
  'a2ui-color-on-surface': '#1f1f1f',
  'a2ui-color-primary': '#1677ff',
  'a2ui-color-on-primary': '#ffffff',
  'a2ui-color-secondary': '#f0f0f0',
  'a2ui-color-on-secondary': '#1f1f1f',
  'a2ui-color-border': '#d9d9d9',
  'a2ui-color-input': '#ffffff',
  'a2ui-color-on-input': '#1f1f1f',
  'a2ui-border-radius': '8px',
  'a2ui-border-width': '1px',

  // 字号阶梯 → Text h1–h5 / body / caption
  'a2ui-font-size-2xl': '28px',
  'a2ui-font-size-xl': '24px',
  'a2ui-font-size-l': '22px',
  'a2ui-font-size-m': '16px',
  'a2ui-font-size-s': '14px',
  'a2ui-font-size-xs': '12px',

  // 间距与布局
  'a2ui-grid-base': '8px',
  'a2ui-spacing-m': '8px',
  'a2ui-row-gap': '8px',
  'a2ui-column-gap': '10px',

  // Button（default 变体；primary 变体用 color-primary / color-on-primary）
  'a2ui-button-background': '#ffffff',
  'a2ui-button-border-radius': '8px',
  'a2ui-button-padding': '8px 16px',
  'a2ui-button-margin': '0',

  // TextField
  'a2ui-textfield-padding': '6px 12px',
  'a2ui-textfield-border-radius': '8px',
  'a2ui-textfield-color-border-focus': '#1677ff',
  'a2ui-label-font-size': '12px',

  // Card
  'a2ui-card-background': '#ffffff',
  'a2ui-card-padding': '12px 16px',
  'a2ui-card-border-radius': '8px',

  // Checkbox / Slider
  'a2ui-checkbox-gap': '8px',
  'a2ui-checkbox-size': '16px',
  'a2ui-slider-thumb-color': '#1677ff',
  'a2ui-slider-track-color': '#f0f0f0',

  // 解析失败面板（本包 index.less，非 @a2ui/lit）
  'a2ui-parse-error-border': 'rgba(255, 77, 79, 0.45)',
  'a2ui-parse-error-bg': 'rgba(255, 77, 79, 0.08)',
  'a2ui-parse-error-text': '#434343',
  'a2ui-parse-error-title': '#cf1322',
  'a2ui-parse-error-link': '#1677ff',
  'a2ui-parse-error-pre-bg': 'rgba(0, 0, 0, 0.04)',
  'a2ui-parse-error-pre-text': '#595959',
};
