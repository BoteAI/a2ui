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
