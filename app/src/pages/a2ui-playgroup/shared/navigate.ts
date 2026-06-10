/** 打开开发指南（应用内 hash 路由）或外链 */
export function openGuideUrl(url: string) {
  if (typeof window === 'undefined') return;
  if (url.startsWith('http')) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  const normalized = url.startsWith('/') ? url : `/${url}`;
  window.open(`${window.location.origin}${window.location.pathname}#${normalized}`, '_blank', 'noopener,noreferrer');
}

/** hash 路由下跳转（Umi history.type = hash） */
export function navigateTo(path: string, searchParams?: Record<string, string>) {
  if (typeof window === 'undefined') return;
  if (searchParams) {
    const url = new URL(window.location.href);
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState(null, '', url.toString());
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  window.location.hash = normalized;
}
