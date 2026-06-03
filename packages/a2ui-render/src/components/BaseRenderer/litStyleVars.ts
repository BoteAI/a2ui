import type { CSSProperties } from 'react';
import type { A2UIProtocolVersion } from '../../compat/litRuntime';
import type { A2UIThemePreset } from './a2uiThemePresets';
import { resolveA2UIThemePresetStyleVars } from './a2uiThemePresets';
import { DEFAULT_A2UI_LIT_STYLE_VARS } from './defaultA2uiLitStyleVars';

export type { A2UILitStyleVars } from './a2uiThemePresets';

/** 统一为不带 -- 的 key */
function canonicalStyleVarRecord(vars: Record<string, string | number>): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  Object.entries(vars).forEach(([k, v]) => {
    const nk = k.startsWith('--') ? k.slice(2) : k;
    out[nk] = v;
  });
  return out;
}

/**
 * 官方 token ← 历史业务键。merge 时若官方键未显式传入，则用 legacy 键填充。
 * 每项为 [official, legacy]。
 */
export const A2UI_OFFICIAL_FROM_LEGACY_STYLE_VARS: ReadonlyArray<readonly [string, string]> = [
  ['a2ui-border-radius', 'a2ui-radius'],
  ['a2ui-button-background', 'a2ui-button-bg'],
  ['a2ui-button-border-radius', 'a2ui-radius'],
  ['a2ui-color-input', 'a2ui-input-bg'],
  ['a2ui-color-on-input', 'a2ui-input-text-color'],
  ['a2ui-textfield-padding', 'a2ui-input-padding'],
  ['a2ui-textfield-color-border-focus', 'a2ui-input-focus-border-color'],
  ['a2ui-textfield-border-radius', 'a2ui-radius'],
  ['a2ui-label-font-size', 'a2ui-input-label-font-size'],
  ['a2ui-card-background', 'a2ui-card-bg'],
  ['a2ui-card-border-radius', 'a2ui-card-radius'],
  ['a2ui-row-gap', 'a2ui-inline-gap'],
  ['a2ui-column-gap', 'a2ui-form-item-gap'],
  ['a2ui-slider-thumb-color', 'a2ui-slider-accent-color'],
  ['a2ui-color-on-primary', 'a2ui-button-text-color'],
];

/** v0.9：业务字号名 → 官方 font-size-*（与 DEFAULT 中官方键二选一即可） */
const V09_FONT_SIZE_FROM_TEXT_KEYS: ReadonlyArray<readonly [string, string]> = [
  ['a2ui-font-size-xs', 'a2ui-text-caption-size'],
  ['a2ui-font-size-s', 'a2ui-text-h5-size'],
  ['a2ui-font-size-m', 'a2ui-text-body-size'],
  ['a2ui-font-size-l', 'a2ui-text-h3-size'],
  ['a2ui-font-size-xl', 'a2ui-text-h2-size'],
  ['a2ui-font-size-2xl', 'a2ui-text-h1-size'],
];

function applyOfficialFromLegacy(
  vars: Record<string, string | number>,
  pairs: ReadonlyArray<readonly [string, string]>,
): Record<string, string | number> {
  const out = { ...vars };
  pairs.forEach(([official, legacy]) => {
    if (out[official] == null && out[legacy] != null) {
      out[official] = out[legacy];
    }
  });
  return out;
}

/** @deprecated 仅作文档：旧版 DEFAULT 中常见、请改用上表官方名的键 */
export const DEPRECATED_A2UI_STYLE_VAR_KEYS = [
  'a2ui-text-heading-color',
  'p-50',
  'a2ui-color-success',
  'a2ui-color-warning',
  'a2ui-color-error',
  'a2ui-radius',
  'a2ui-text-h1-size',
  'a2ui-text-h2-size',
  'a2ui-text-h3-size',
  'a2ui-text-h4-size',
  'a2ui-text-h5-size',
  'a2ui-text-body-size',
  'a2ui-text-caption-size',
  'a2ui-form-item-gap',
  'a2ui-input-font-size',
  'a2ui-input-height',
  'a2ui-input-padding',
  'a2ui-input-border-color',
  'a2ui-input-bg',
  'a2ui-input-text-color',
  'a2ui-input-placeholder-color',
  'a2ui-input-label-color',
  'a2ui-input-label-font-size',
  'a2ui-input-focus-border-color',
  'a2ui-input-focus-shadow',
  'a2ui-textarea-height',
  'a2ui-inline-gap',
  'a2ui-card-bg',
  'a2ui-card-border-color',
  'a2ui-card-border-width',
  'a2ui-card-radius',
  'a2ui-button-height',
  'a2ui-button-margin-top',
  'a2ui-button-border-color',
  'a2ui-button-bg',
  'a2ui-button-text-color',
  'a2ui-checkbox-accent-color',
  'a2ui-slider-accent-color',
  'a2ui-choice-selected-bg',
  'a2ui-choice-selected-text-color',
  'a2ui-option-hover-bg',
] as const;

/**
 * 合并默认主题、内置预设与业务 styleVars，写入 a2ui-surface 宿主 style，供官方 Lit adopted stylesheet 继承。
 * 优先级：DEFAULT < themePreset < styleVars
 */
export function mergeLitSurfaceStyleVars(
  styleVars?: Record<string, string | number>,
  protocolVersion: A2UIProtocolVersion = '0.8',
  themePreset?: A2UIThemePreset,
): Record<string, string | number> {
  const presetVars = resolveA2UIThemePresetStyleVars(themePreset) as Record<string, string | number>;
  let merged = canonicalStyleVarRecord({
    ...DEFAULT_A2UI_LIT_STYLE_VARS,
    ...presetVars,
    ...(styleVars ?? {}),
  });
  const primary = merged['a2ui-color-primary'];
  if (primary != null) {
    merged['p-50'] = primary;
  }
  merged = applyOfficialFromLegacy(merged, A2UI_OFFICIAL_FROM_LEGACY_STYLE_VARS);
  if (protocolVersion === '0.9') {
    merged = applyOfficialFromLegacy(merged, V09_FONT_SIZE_FROM_TEXT_KEYS);
  }
  return merged;
}

export function toCssVarStyle(styleVars?: Record<string, string | number>): CSSProperties | undefined {
  if (!styleVars) return undefined;
  const style: Record<string, string | number> = {};
  Object.entries(styleVars).forEach(([key, value]) => {
    const cssVarName = key.startsWith('--') ? key : `--${key}`;
    style[cssVarName] = value;
  });
  return style as CSSProperties;
}

export function applyCssVars(element: HTMLElement, styleVars?: Record<string, string | number>) {
  if (!styleVars) return;
  Object.entries(styleVars).forEach(([key, value]) => {
    const cssVarName = key.startsWith('--') ? key : `--${key}`;
    element.style.setProperty(cssVarName, String(value));
  });
}
