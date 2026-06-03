import { CYBER_THEME_SHADOW_CSS } from './themePresets/cyber.shadow.css';
import { PLATFORM_INTERCONNECT_THEME_SHADOW_CSS } from './themePresets/platformInterconnect.shadow.css';
import { DEEP_BLUE_WISDOM_THEME_SHADOW_CSS } from './themePresets/deepBlueWisdom.shadow.css';

/** A2UI Lit 官方 token 与扩展键的值表 */
export type A2UILitStyleVars = Record<string, string | number>;

/** 单套内置主题的完整定义 */
export type A2UIThemePresetDefinition = {

  /** 相对 DEFAULT 的 CSS 变量覆盖 */
  styleVars: Partial<A2UILitStyleVars>;

  /**
   * 注入 a2ui-surface 子树各 ShadowRoot 的补充 CSS。
   * 选择器可用 :host(a2ui-card)、.a2ui-button 等；颜色建议配合 styleVars 中的 var(--a2ui-*)。
   */
  shadowCss?: string;

  /** 挂在 .a2ui-renderer-container 上的修饰 class，用于 Light DOM（如解析失败面板） */
  containerClass?: string;
};

/**
 * 内置 A2UI Lit 表面主题预设名。
 * - default：与 DEFAULT_A2UI_LIT_STYLE_VARS 一致
 * - conversation
 * - cyber：炫彩科技，变量 + shadowCss
 * - platformInterconnect：平台互联，变量 + shadowCss
 * - deepBlueWisdom：深蓝智慧，变量 + shadowCss
 */
export const A2UI_THEME_PRESET_NAMES = [
  'default',
  'conversation',
  'cyber',
  'platformInterconnect',
  'deepBlueWisdom',
] as const;

export type A2UIThemePreset = (typeof A2UI_THEME_PRESET_NAMES)[number];

export const A2UI_THEME_PRESET_DEFINITIONS: Record<
  A2UIThemePreset,
  A2UIThemePresetDefinition
> = {

  /** 默认主题 */
  default: { styleVars: {} },

  /** 对话标准 */
  conversation: {
    styleVars: {
      'a2ui-color-background': '#fafafa',
      'a2ui-color-on-background': '#262626',
      'a2ui-color-surface': '#ffffff',
      'a2ui-color-on-surface': '#262626',
      'a2ui-color-primary': '#1677ff',
      'a2ui-color-on-primary': '#ffffff',
      'a2ui-color-secondary': '#f5f5f5',
      'a2ui-color-on-secondary': '#434343',
      'a2ui-color-border': '#e8e8e8',
      'a2ui-color-input': '#ffffff',
      'a2ui-color-on-input': '#262626',
      'a2ui-border-radius': '12px',
      'a2ui-grid-base': '12px',
      'a2ui-spacing-m': '12px',
      'a2ui-row-gap': '12px',
      'a2ui-column-gap': '12px',
      'a2ui-font-size-m': '14px',
      'a2ui-font-size-s': '13px',
      'a2ui-button-background': '#ffffff',
      'a2ui-button-border-radius': '20px',
      'a2ui-button-padding': '10px 20px',
      'a2ui-textfield-padding': '10px 14px',
      'a2ui-textfield-border-radius': '12px',
      'a2ui-textfield-color-border-focus': '#1677ff',
      'a2ui-label-font-size': '12px',
      'a2ui-card-background': '#ffffff',
      'a2ui-card-padding': '16px',
      'a2ui-card-border-radius': '12px',
      'a2ui-checkbox-gap': '10px',
      'a2ui-slider-thumb-color': '#1677ff',
      'a2ui-slider-track-color': '#f0f0f0',
      'a2ui-parse-error-border': 'rgba(255, 77, 79, 0.45)',
      'a2ui-parse-error-bg': 'rgba(255, 77, 79, 0.08)',
      'a2ui-parse-error-link': '#1677ff',
    },
  },

  /** 炫彩科技：对齐 beijing-travel-cyber.pen — 深紫底、玻璃卡片、Chip、渐变 CTA */
  cyber: {
    containerClass: 'a2ui-renderer-container--theme-cyber',
    styleVars: {
      'a2ui-color-background': '#070b18',
      'a2ui-color-on-background': '#f1f5f9',
      'a2ui-color-surface': '#0f172a',
      'a2ui-color-on-surface': '#f1f5f9',
      'a2ui-color-primary': '#00e5ff',
      'a2ui-color-on-primary': '#061018',
      'a2ui-color-secondary': '#1a2236',
      'a2ui-color-on-secondary': '#94a3b8',
      'a2ui-color-border': 'rgba(0, 229, 255, 0.4)',
      'a2ui-color-input': '#0f172a',
      'a2ui-color-on-input': '#f1f5f9',
      'a2ui-border-radius': '10px',
      'a2ui-grid-base': '8px',
      'a2ui-spacing-m': '16px',
      'a2ui-row-gap': '16px',
      'a2ui-column-gap': '12px',
      'a2ui-font-size-2xl': '24px',
      'a2ui-font-size-m': '14px',
      'a2ui-font-size-s': '12px',
      'a2ui-font-size-xs': '11px',
      'a2ui-label-font-size': '11px',
      'a2ui-button-border-radius': '999px',
      'a2ui-button-padding': '12px 24px',
      'a2ui-button-margin': '0',
      'a2ui-button-font-weight': '700',
      'a2ui-card-background': 'transparent',
      'a2ui-card-border-radius': '18px',
      'a2ui-card-padding': '26px',
      'a2ui-textfield-padding': '12px 14px',
      'a2ui-textfield-border-radius': '10px',
      'a2ui-textfield-color-border-focus': '#00e5ff',
      'a2ui-choicepicker-gap': '8px',
      'a2ui-choicepicker-chip-padding': '10px 12px',
      'a2ui-choicepicker-chip-border-radius': '10px',
      'a2ui-text-caption-color': '#94a3b8',
      'a2ui-checkbox-gap': '10px',
      'a2ui-checkbox-size': '18px',
      'a2ui-slider-thumb-color': '#00e5ff',
      'a2ui-slider-track-color': '#334155',
      'a2ui-parse-error-border': 'rgba(236, 72, 153, 0.5)',
      'a2ui-parse-error-bg': 'rgba(124, 58, 237, 0.15)',
      'a2ui-parse-error-text': '#f1f5f9',
      'a2ui-parse-error-title': '#f472b6',
      'a2ui-parse-error-link': '#00e5ff',
      'a2ui-parse-error-pre-bg': 'rgba(0, 229, 255, 0.08)',
      'a2ui-parse-error-pre-text': '#94a3b8',
    },
    shadowCss: CYBER_THEME_SHADOW_CSS,
  },

  /** 平台互联：对齐 beijing-travel-platform-interconnect.pen — 浅紫蓝底、白卡片、蓝绿 CTA */
  platformInterconnect: {
    containerClass: 'a2ui-renderer-container--theme-platform-interconnect',
    styleVars: {
      'a2ui-color-background': '#f5f7ff',
      'a2ui-color-on-background': '#2a2b33',
      'a2ui-color-surface': '#ffffff',
      'a2ui-color-on-surface': '#2a2b33',
      'a2ui-color-primary': '#0f89fc',
      'a2ui-color-on-primary': '#ffffff',
      'a2ui-color-secondary': '#ebefff',
      'a2ui-color-on-secondary': '#9092a3',
      'a2ui-color-border': 'rgba(15, 137, 252, 0.35)',
      'a2ui-color-input': '#ffffff',
      'a2ui-color-on-input': '#414352',
      'a2ui-border-radius': '12px',
      'a2ui-grid-base': '8px',
      'a2ui-spacing-m': '16px',
      'a2ui-row-gap': '16px',
      'a2ui-column-gap': '12px',
      'a2ui-font-size-2xl': '24px',
      'a2ui-font-size-m': '14px',
      'a2ui-font-size-s': '12px',
      'a2ui-font-size-xs': '11px',
      'a2ui-label-font-size': '11px',
      'a2ui-button-border-radius': '12px',
      'a2ui-button-padding': '12px 24px',
      'a2ui-button-margin': '0',
      'a2ui-button-font-weight': '700',
      'a2ui-card-background': 'transparent',
      'a2ui-card-border-radius': '12px',
      'a2ui-card-padding': '26px',
      'a2ui-textfield-padding': '12px 14px',
      'a2ui-textfield-border-radius': '12px',
      'a2ui-textfield-color-border-focus': '#0f89fc',
      'a2ui-choicepicker-gap': '8px',
      'a2ui-choicepicker-chip-padding': '10px 12px',
      'a2ui-choicepicker-chip-border-radius': '12px',
      'a2ui-text-caption-color': '#9092a3',
      'a2ui-checkbox-gap': '10px',
      'a2ui-checkbox-size': '18px',
      'a2ui-slider-thumb-color': '#0f89fc',
      'a2ui-slider-track-color': '#ebefff',
      'a2ui-parse-error-border': 'rgba(15, 137, 252, 0.45)',
      'a2ui-parse-error-bg': 'rgba(235, 239, 255, 0.9)',
      'a2ui-parse-error-text': '#414352',
      'a2ui-parse-error-title': '#0f89fc',
      'a2ui-parse-error-link': '#0f89fc',
      'a2ui-parse-error-pre-bg': 'rgba(15, 137, 252, 0.06)',
      'a2ui-parse-error-pre-text': '#9092a3',
    },
    shadowCss: PLATFORM_INTERCONNECT_THEME_SHADOW_CSS,
  },

  /** 深蓝智慧：对齐 beijing-travel-deep-blue-wisdom.pen — 深蓝底、白卡片、蓝紫渐变 CTA */
  deepBlueWisdom: {
    containerClass: 'a2ui-renderer-container--theme-deep-blue-wisdom',
    styleVars: {
      'a2ui-color-background': '#0a1628',
      'a2ui-color-on-background': '#e8eef7',
      'a2ui-color-surface': '#ffffff',
      'a2ui-color-on-surface': '#2a2b33',
      'a2ui-color-primary': '#32acff',
      'a2ui-color-on-primary': '#ffffff',
      'a2ui-color-secondary': '#eef4fc',
      'a2ui-color-on-secondary': '#9092a3',
      'a2ui-color-border': 'rgba(50, 172, 255, 0.45)',
      'a2ui-color-input': '#ffffff',
      'a2ui-color-on-input': '#414352',
      'a2ui-border-radius': '12px',
      'a2ui-grid-base': '8px',
      'a2ui-spacing-m': '16px',
      'a2ui-row-gap': '16px',
      'a2ui-column-gap': '12px',
      'a2ui-font-size-2xl': '24px',
      'a2ui-font-size-m': '14px',
      'a2ui-font-size-s': '12px',
      'a2ui-font-size-xs': '11px',
      'a2ui-label-font-size': '11px',
      'a2ui-button-border-radius': '12px',
      'a2ui-button-padding': '12px 24px',
      'a2ui-button-margin': '0',
      'a2ui-button-font-weight': '700',
      'a2ui-card-background': 'transparent',
      'a2ui-card-border-radius': '12px',
      'a2ui-card-padding': '26px',
      'a2ui-textfield-padding': '12px 14px',
      'a2ui-textfield-border-radius': '12px',
      'a2ui-textfield-color-border-focus': '#32acff',
      'a2ui-choicepicker-gap': '8px',
      'a2ui-choicepicker-chip-padding': '10px 12px',
      'a2ui-choicepicker-chip-border-radius': '12px',
      'a2ui-text-caption-color': '#9092a3',
      'a2ui-checkbox-gap': '10px',
      'a2ui-checkbox-size': '18px',
      'a2ui-slider-thumb-color': '#32acff',
      'a2ui-slider-track-color': '#eef4fc',
      'a2ui-parse-error-border': 'rgba(172, 140, 255, 0.5)',
      'a2ui-parse-error-bg': 'rgba(15, 40, 71, 0.92)',
      'a2ui-parse-error-text': '#e8eef7',
      'a2ui-parse-error-title': '#ac8cff',
      'a2ui-parse-error-link': '#32acff',
      'a2ui-parse-error-pre-bg': 'rgba(50, 172, 255, 0.1)',
      'a2ui-parse-error-pre-text': '#94a3b8',
    },
    shadowCss: DEEP_BLUE_WISDOM_THEME_SHADOW_CSS,
  },
};

/** 各预设 styleVars 覆盖表（兼容旧导出） */
export const A2UI_THEME_PRESETS: Record<
  A2UIThemePreset,
  Partial<A2UILitStyleVars>
> = Object.fromEntries(
  Object.entries(A2UI_THEME_PRESET_DEFINITIONS).map(([name, def]) => [
    name,
    def.styleVars,
  ]),
) as Record<A2UIThemePreset, Partial<A2UILitStyleVars>>;

export function resolveA2UIThemePresetDefinition(
  preset?: A2UIThemePreset,
): A2UIThemePresetDefinition {
  if (!preset || preset === 'default') {
    return A2UI_THEME_PRESET_DEFINITIONS.default;
  }
  return A2UI_THEME_PRESET_DEFINITIONS[preset];
}

/** 取预设 styleVars 覆盖；default 或未传时返回空对象 */
export function resolveA2UIThemePresetStyleVars(
  preset?: A2UIThemePreset,
): Partial<A2UILitStyleVars> {
  return { ...resolveA2UIThemePresetDefinition(preset).styleVars };
}

/** 合并预设 shadowCss 与业务 themePresetCss */
export function resolveA2UIThemePresetShadowCss(
  preset?: A2UIThemePreset,
  themePresetCss?: string,
): string {
  const base = resolveA2UIThemePresetDefinition(preset).shadowCss?.trim() ?? '';
  const extra = themePresetCss?.trim() ?? '';
  if (!base && !extra) return '';
  return [base, extra].filter(Boolean).join('\n');
}

/** 预设容器 class，用于 Light DOM */
export function resolveA2UIThemePresetContainerClass(
  preset?: A2UIThemePreset,
): string | undefined {
  return resolveA2UIThemePresetDefinition(preset).containerClass;
}
