import { env } from '$env/dynamic/private';
import {
  toolCategoryLabels,
  toolCategoryOrder,
  toolSourceOrder,
  type ToolCategory,
  type ToolSourceItem,
  type ToolSourceKind,
  type ToolSourceName
} from './tool-sources';

function envKey(category: ToolCategory, source: ToolSourceName) {
  return `AGGREGATION_${category.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}_${source.toUpperCase()}_FEED_URL`;
}

const sourceConfigs: Array<{
  source: ToolSourceName;
  category: ToolCategory;
  feedUrl: string;
}> = toolCategoryOrder.flatMap((category) =>
  toolSourceOrder.map((source) => ({
    source,
    category,
    feedUrl: env[envKey(category, source)]?.trim() ?? ''
  }))
);

function getKind(title: string, summary: string): ToolSourceKind {
  const lower = `${title} ${summary}`.toLowerCase();

  if (lower.includes('repo') || lower.includes('github') || lower.includes('git')) {
    return 'repo';
  }

  if (lower.includes('startup') || lower.includes('founder') || lower.includes('company')) {
    return 'startup';
  }

  return 'tool';
}

function guessTags(text: string, category: ToolCategory) {
  const lower = text.toLowerCase();
  const tags = ['signals', toolCategoryLabels[category].toLowerCase()];

  if (lower.includes('kit')) tags.push('sveltekit');
  if (lower.includes('motion')) tags.push('motion');
  if (lower.includes('dashboard')) tags.push('dashboard');
  if (lower.includes('ui')) tags.push('ui');
  if (lower.includes('repo') || lower.includes('github') || lower.includes('git')) tags.push('repo');
  if (lower.includes('news') || lower.includes('launch')) tags.push('news');
  if (lower.includes('rust')) tags.push('rust');
  if (lower.includes('go ')) tags.push('go');
  if (lower.includes('ruby')) tags.push('ruby');
  if (lower.includes('css') || lower.includes('html')) tags.push('frontend');
  if (lower.includes('c++') || lower.includes('c#') || lower.includes('cpp')) tags.push('systems');

  return Array.from(new Set(tags));
}

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseEntry(
  source: ToolSourceName,
  category: ToolCategory,
  item: Record<string, unknown>,
  index: number
): ToolSourceItem | null {
  const title = asText(item.title) || asText(item.name) || asText(item.caption) || asText(item.headline);
  const summary = asText(item.summary) || asText(item.description) || asText(item.content) || asText(item.excerpt);
  const url = asText(item.url) || asText(item.link) || asText(item.permalink) || asText(item.href);
  const publishedAt = asText(item.publishedAt) || asText(item.pubDate) || asText(item.date) || new Date().toISOString();
  const author = asText(item.author) || asText(item.creator) || undefined;
  const score = Number(item.score ?? item.rank ?? 0);

  if (!title || !url) {
    return null;
  }

  const text = `${title} ${summary}`;

  return {
    id: `${category}-${source}-${index}-${Buffer.from(url).toString('base64url').slice(0, 18)}`,
    source,
    category,
    kind: getKind(title, summary),
    title,
    summary: summary || 'Minimal source note from the daily scan.',
    url,
    author,
    publishedAt,
    createdAt: new Date().toISOString(),
    tags: guessTags(text, category),
    note: asText(item.note) || undefined,
    score: Number.isFinite(score) ? score : 0
  };
}

async function fetchFeed(url: string) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json,text/xml,application/xml,text/plain,*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`Feed request failed with ${response.status}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  const body = await response.text();
  const trimmed = body.trim();

  if (contentType.includes('json') || trimmed.startsWith('[') || trimmed.startsWith('{')) {
    const json = JSON.parse(body);
    if (Array.isArray(json)) return json;
    if (Array.isArray(json.items)) return json.items;
    if (Array.isArray(json.entries)) return json.entries;
    return [];
  }

  const itemMatches = [...body.matchAll(/<(item|entry)[\s\S]*?<\/\1>/g)];
  return itemMatches.map((match) => {
    const chunk = match[0];
    const get = (tag: string) => {
      const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i');
      const found = chunk.match(regex)?.[1] ?? '';
      return found.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
    };

    return {
      title: get('title'),
      summary: get('description') || get('summary') || get('content'),
      url: get('link') || get('id'),
      author: get('author'),
      pubDate: get('pubDate') || get('updated') || get('published')
    };
  });
}

export async function collectDailyToolSnapshot() {
  const items: ToolSourceItem[] = [];

  for (const config of sourceConfigs) {
    if (!config.feedUrl) {
      continue;
    }

    const entries = await fetchFeed(config.feedUrl);

    for (const [index, entry] of entries.entries()) {
      const parsed = parseEntry(config.source, config.category, entry as Record<string, unknown>, index);
      if (parsed) {
        items.push(parsed);
      }
    }
  }

  return items
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 72);
}
