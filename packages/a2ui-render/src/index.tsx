// 导出基础渲染器
import BaseRenderer from './components/BaseRenderer';

export { BaseRenderer as Renderer };
export { default as BaseRenderer } from './components/BaseRenderer';

// 导出扩展渲染器
export { default as BoteRenderer } from './components/BoteRenderer';

export {
  LitSurfaceHost,
  A2UIParseErrorPanel,
  formatA2UIParseError,
  DEFAULT_A2UI_LIT_STYLE_VARS,
  DEFAULT_A2UI_V08_THEME,
  A2UI_THEME_PRESET_NAMES,
  A2UI_THEME_PRESETS,
  A2UI_THEME_PRESET_DEFINITIONS,
  resolveA2UIThemePresetDefinition,
  resolveA2UIThemePresetStyleVars,
  resolveA2UIThemePresetShadowCss,
  resolveA2UIThemePresetContainerClass,
  CYBER_THEME_SHADOW_CSS,
  PLATFORM_INTERCONNECT_THEME_SHADOW_CSS,
  DEEP_BLUE_WISDOM_THEME_SHADOW_CSS,
  mergeLitSurfaceStyleVars,
  A2UI_OFFICIAL_FROM_LEGACY_STYLE_VARS,
  DEPRECATED_A2UI_STYLE_VAR_KEYS,
} from './components/BaseRenderer';
export type {
  A2UIParseErrorInfo,
  LitSurfaceHostProps,
  A2UIThemePreset,
  A2UILitStyleVars,
  A2UIThemePresetDefinition,
} from './components/BaseRenderer';

// 导出类型和工具函数
export type {
  A2UIComponent,
  A2UICustomComponentRegistry,
  A2UICustomElementDefinition,
  ComponentRendererRegistry,
  RenderContext,
  ComponentRenderer,
  A2UIMessage,
} from './components/BaseRenderer';


export {
  getValueFromPath,
  setValueAtPath,
  resolveValue,
  resolveActionContext,
  replaceParamsValue,
  normalizeToLitProtocolMessages,
  normalizeSurfaceId,
  componentsToProtocolMessages,
  DEFAULT_A2UI_SURFACE_ID,
  inferProtocolVersionFromMessages,
  pickCustomComponents,
  // 响应式工具
  useResponsive,
  getDeviceType,
  isMobile,
  isTablet,
  isDesktop,
  isMobileDevice,
  getResponsiveStyle,
  getResponsiveSpacing,
  getResponsiveFontSize,
  BREAKPOINTS,
  type DeviceType,
} from './utils';


export {
  loadRemoteA2UICustomRegistry,
  loadRemoteA2UICustomRegistries,
} from './remote/loadRemoteA2UICustomRegistry';
