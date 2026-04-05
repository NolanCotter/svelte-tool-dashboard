import { env } from '$env/dynamic/private';
import { anyApi } from 'convex/server';
import { ConvexHttpClient } from 'convex/browser';

export type ToolSourceName = 'github' | 'instagram' | 'x' | 'youtube';
export type ToolCategory = 'svelte' | 'rust' | 'go' | 'ruby' | 'html-css' | 'cpp-csharp' | 'general-news';
export type ToolSourceKind = 'tool' | 'startup' | 'repo';

export const toolSourceOrder: ToolSourceName[] = ['github', 'instagram', 'x', 'youtube'];
export const toolCategoryOrder: ToolCategory[] = ['svelte', 'rust', 'go', 'ruby', 'html-css', 'cpp-csharp', 'general-news'];

export const toolSourceLabels: Record<ToolSourceName, string> = {
  github: 'GitHub',
  instagram: 'Instagram',
  x: 'X',
  youtube: 'YouTube'
};

export const toolCategoryLabels: Record<ToolCategory, string> = {
  svelte: 'Svelte',
  rust: 'Rust',
  go: 'Go',
  ruby: 'Ruby',
  'html-css': 'HTML/CSS',
  'cpp-csharp': 'C/C++/C#',
  'general-news': 'General News'
};

export type ToolSourceItem = {
  id: string;
  source: ToolSourceName;
  category: ToolCategory;
  kind: ToolSourceKind;
  title: string;
  summary: string;
  url: string;
  author?: string;
  publishedAt: string;
  createdAt: string;
  tags: string[];
  note?: string;
  score: number;
};

const convexUrl = env.CONVEX_URL?.trim() ?? '';

function getConvexClient() {
  return convexUrl ? new ConvexHttpClient(convexUrl) : null;
}

function resolveCategory(item: ToolSourceItem) {
  return item.category ?? 'general-news';
}

export async function listToolSourceItems() {
  const client = getConvexClient();

  if (!client) {
    return [] as ToolSourceItem[];
  }

  try {
    return (await client.query(anyApi.toolSources.listToolSources, {})) as ToolSourceItem[];
  } catch {
    return [] as ToolSourceItem[];
  }
}

export async function replaceToolSourceItems(items: ToolSourceItem[]) {
  const client = getConvexClient();

  if (!client) {
    throw new Error('CONVEX_URL is required for tool source storage.');
  }

  return await client.mutation(anyApi.toolSources.replaceToolSources, { items });
}

export function buildSourceSummary(items: ToolSourceItem[]) {
  const bySource = {
    github: items.filter((item) => item.source === 'github'),
    instagram: items.filter((item) => item.source === 'instagram'),
    x: items.filter((item) => item.source === 'x'),
    youtube: items.filter((item) => item.source === 'youtube')
  };

  const byCategory = Object.fromEntries(
    toolCategoryOrder.map((category) => [
      category,
      items.filter((item) => resolveCategory(item) === category)
    ])
  ) as Record<ToolCategory, ToolSourceItem[]>;

  const latest = [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0] ?? null;

  return {
    count: items.length,
    latest,
    bySource,
    byCategory,
    sourceCount: Object.values(bySource).filter((list) => list.length > 0).length,
    categoryCount: Object.values(byCategory).filter((list) => list.length > 0).length,
    categoryOrder: toolCategoryOrder,
    sourceOrder: toolSourceOrder,
    categoryLabels: toolCategoryLabels,
    sourceLabels: toolSourceLabels
  };
}
