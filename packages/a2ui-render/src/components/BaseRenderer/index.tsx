export type {
  A2UIComponent,
  A2UICustomComponentRegistry,
  A2UICustomElementDefinition,
  ComponentRendererRegistry,
  RenderContext,
  ComponentRenderer,
  A2UIMessage,
} from './types';

export { getValueFromPath, resolveValue, resolveActionContext } from '../../utils';

export { DEFAULT_A2UI_LIT_STYLE_VARS } from './defaultA2uiLitStyleVars';
import _DEFAULT_A2UI_V08_THEME from './defaultA2uiV08Theme';
export const DEFAULT_A2UI_V08_THEME = _DEFAULT_A2UI_V08_THEME;
export {
  A2UI_THEME_PRESET_NAMES,
  A2UI_THEME_PRESETS,
  A2UI_THEME_PRESET_DEFINITIONS,
  resolveA2UIThemePresetDefinition,
  resolveA2UIThemePresetStyleVars,
  resolveA2UIThemePresetShadowCss,
  resolveA2UIThemePresetContainerClass,
} from './a2uiThemePresets';
export type {
  A2UIThemePreset,
  A2UILitStyleVars,
  A2UIThemePresetDefinition,
} from './a2uiThemePresets';
export { CYBER_THEME_SHADOW_CSS } from './themePresets/cyber.shadow.css';
export { PLATFORM_INTERCONNECT_THEME_SHADOW_CSS } from './themePresets/platformInterconnect.shadow.css';
export { DEEP_BLUE_WISDOM_THEME_SHADOW_CSS } from './themePresets/deepBlueWisdom.shadow.css';
export {
  mergeLitSurfaceStyleVars,
  A2UI_OFFICIAL_FROM_LEGACY_STYLE_VARS,
  DEPRECATED_A2UI_STYLE_VAR_KEYS,
} from './litStyleVars';

export {
  A2UI_EDITOR_SELECTED_CLASS,
  A2UI_EDITOR_SELECTION_SHADOW_CSS,
} from './editorSelectionHighlight';

export { default } from './LitSurfaceHost';
export { default as LitSurfaceHost } from './LitSurfaceHost';
export { A2UIParseErrorPanel, formatA2UIParseError } from './LitSurfaceHost';
export type { A2UIParseErrorInfo, LitSurfaceHostProps } from './LitSurfaceHost';
