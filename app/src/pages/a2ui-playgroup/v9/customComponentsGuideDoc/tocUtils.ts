import type React from 'react';

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

/** 与 GitHub 类似的 heading slug，支持中文 */
export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

/** 按文档顺序解析 Markdown 标题，生成唯一 id */
export function extractHeadings(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const slugCounts = new Map<string, number>();

  markdown.split('\n').forEach((line) => {
    const match = line.match(/^(#{1,4})\s+(.+)$/);
    if (!match) return;

    const level = match[1].length;
    const text = stripInlineMarkdown(match[2]);
    const base = slugifyHeading(text);
    const count = slugCounts.get(base) ?? 0;
    slugCounts.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count}`;

    items.push({ id, text, level });
  });

  return items;
}

export function flattenHeadingText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(flattenHeadingText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return flattenHeadingText((children as React.ReactElement).props.children);
  }
  return '';
}
