/** 根据 path 设置对象中的值，返回新对象（不可变更新） */
export const setValueAtPath = (
  obj: Record<string, any>,
  path: string,
  value: any
): Record<string, any> => {
  const keys = path.split('/').filter(Boolean);
  if (keys.length === 0) return obj;
  const result = { ...obj };
  let current: Record<string, any> = result;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const k = keys[i];
    const next = current[k] && typeof current[k] === 'object' ? { ...current[k] } : {};
    current[k] = next;
    current = next;
  }
  const lastKey = keys[keys.length - 1];
  if (!lastKey) return obj;
  current[lastKey] = value;
  return result;
};

// 工具函数：从dataModel中根据path获取值
export const getValueFromPath = (dataModel: Record<string, any>, path: string): any => {
  if (!path || path === '/') {
    return dataModel;
  }
  const keys = path.split('/').filter(Boolean);
  let value = dataModel;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  return value;
};

// 解析值对象（literalString/literalNumber/literalBoolean/path）
export const resolveValue = (valueObj: any, dataModel: Record<string, any>): any => {
  if (!valueObj || typeof valueObj !== 'object') {
    return valueObj;
  }
  if ('literalString' in valueObj) {
    return valueObj.literalString;
  }
  if ('literalNumber' in valueObj) {
    return valueObj.literalNumber;
  }
  if ('literalBoolean' in valueObj) {
    return valueObj.literalBoolean;
  }
  if ('path' in valueObj) {
    return getValueFromPath(dataModel, valueObj.path);
  }
  if ('literalArray' in valueObj) {
    return valueObj.literalArray;
  }
  return valueObj;
};

// 按点号路径从对象取值，如 loopItem.name -> dataModel.loopItem?.name
const getValueByDotPath = (obj: Record<string, any>, path: string): any => {
  if (!path || !obj) return undefined;
  const keys = path.trim().split('.');
  let v: any = obj;
  for (const k of keys) {
    if (v != null && typeof v === 'object' && k in v) v = v[k];
    else return undefined;
  }
  return v;
};

// 替换字符串中的 ${path} 为 dataModel 中的值，如 ${loopItem.name}
export const replaceParamsValue = (contentStr: string | undefined, dataModel: Record<string, any> = {}): string => {
  if (typeof contentStr !== 'string' || !contentStr) return '';
  return contentStr.replace(/\$\{([^}]+)\}/g, (_, path) => {
    const val = getValueByDotPath(dataModel, path);
    return val === undefined || val === null ? '' : String(val);
  });
};

// 解析action的context
export const resolveActionContext = (context: any[], dataModel: Record<string, any>): Record<string, any> => {
  const resolved: Record<string, any> = {};
  if (Array.isArray(context)) {
    context.forEach((item) => {
      if (item.key && item.value) {
        resolved[item.key] = resolveValue(item.value, dataModel);
      }
    });
  }
  return resolved;
};

// 导出响应式工具函数
export {
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
} from './responsive';

export {
  normalizeToLitProtocolMessages,
  normalizeSurfaceId,
  componentsToProtocolMessages,
  DEFAULT_A2UI_SURFACE_ID,
  inferProtocolVersionFromMessages,
  pickCustomComponents,
} from './toProtocolMessages';

export { computeMessagesDigest, isMessagesAppendOnly } from './messagesDigest';
