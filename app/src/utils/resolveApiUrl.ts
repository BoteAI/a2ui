/**
 * 简化版 resolveApiUrl：将 API 路径解析为完整 URL
 * 原始版本来自 @boteteam/utils，此版本移除了对 @lingxiteam/security 等业务依赖
 */

const API_BASE = process.env.REACT_APP_REQ_PREFIX
  ? `${process.env.REACT_APP_REQ_PREFIX}/bote`
  : '/api/bote';

/**
 * 将 API 路径解析为完整可访问 URL
 * @param apiPath API 路径，可含 query 参数
 */
export const resolveApiUrl = (apiPath: string): string => {
  if (apiPath.startsWith('http://') || apiPath.startsWith('https://')) {
    return apiPath;
  }

  const base = API_BASE.replace(/\/$/, '');
  const path = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;
  const resolved = `${base}${path}`;

  if (typeof window !== 'undefined') {
    return new URL(resolved, window.location.href).href;
  }
  return resolved;
};
