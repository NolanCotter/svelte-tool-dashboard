import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import process from 'node:process';

const categories = ['svelte', 'rust', 'go', 'ruby', 'html-css', 'cpp-csharp', 'general-news'];
const sources = ['github', 'instagram', 'x', 'youtube'];
const outputPath = resolve(process.cwd(), 'src/lib/data/daily-snapshot.json');
const maxItems = 180;

function envKey(category, source) {
  return `AGGREGATION_${category.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}_${source.toUpperCase()}_FEED_URL`;
}

function asText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function getKind(title, summary) {
  const lower = `${title} ${summary}`.toLowerCase();
  if (lower.includes('repo') || lower.includes('github') || lower.includes('git')) return 'repo';
  if (lower.includes('startup') || lower.includes('founder') || lower.includes('company')) return 'startup';
  return 'tool';
}

function guessTags(text, category) {
  const lower = text.toLowerCase();
  const tags = ['signals', category];
  if (lower.includes('news') || lower.includes('launch')) tags.push('news');
  if (lower.includes('repo') || lower.includes('github') || lower.includes('git')) tags.push('repo');
  return Array.from(new Set(tags));
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url.trim());
    parsed.hash = '';
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return url.trim().replace(/\/$/, '');
  }
}

function normalizeTitle(title) {
  return title.toLowerCase().replace(/\s+/g, ' ').trim();
}

async function fetchFeed(url) {
  const response = await fetch(url, {
    headers: { accept: 'application/json,text/xml,application/xml,text/plain,*/*' }
  });
  if (!response.ok) throw new Error(`Feed request failed with ${response.status}`);
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
    const get = (tag) => {
      const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i');
      return (chunk.match(regex)?.[1] ?? '').replace(/<!\[CDATA\[|\]\]>/g, '').trim();
    };
    const rawLink = get('link');
    const atomHref = chunk.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ?? '';
    const fallbackLink = rawLink.match(/^https?:\/\//i) ? rawLink : atomHref;
    return {
      title: get('title'),
      summary: get('description') || get('summary') || get('content'),
      url: fallbackLink || get('id'),
      author: get('author'),
      pubDate: get('pubDate') || get('updated') || get('published')
    };
  });
}

function parseEntry(source, category, item) {
  const title = asText(item.title) || asText(item.name) || asText(item.caption) || asText(item.headline);
  const summary = asText(item.summary) || asText(item.description) || asText(item.content) || asText(item.excerpt);
  const url = asText(item.url) || asText(item.link) || asText(item.permalink) || asText(item.href);
  const publishedAt = asText(item.publishedAt) || asText(item.pubDate) || asText(item.date) || new Date().toISOString();
  const author = asText(item.author) || asText(item.creator) || undefined;
  const score = Number(item.score ?? item.rank ?? 0);
  if (!title || !url) return null;
  const text = `${title} ${summary}`;
  const stableId = Buffer.from(`${normalizeUrl(url)}::${normalizeTitle(title)}`).toString('base64url').slice(0, 22);
  return {
    id: `${category}-${source}-${stableId}`,
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

async function readCurrent() {
  try {
    const raw = await readFile(outputPath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

async function main() {
  const configs = categories.flatMap((category) =>
    sources.map((source) => ({
      source,
      category,
      feedUrl: process.env[envKey(category, source)]?.trim() ?? ''
    }))
  );

  const fetched = [];
  for (const config of configs) {
    if (!config.feedUrl) continue;
    try {
      const entries = await fetchFeed(config.feedUrl);
      for (const entry of entries) {
        const parsed = parseEntry(config.source, config.category, entry);
        if (parsed) fetched.push(parsed);
      }
    } catch (error) {
      console.warn(`Feed failed for ${config.category}/${config.source}:`, error?.message ?? error);
    }
  }

  const current = await readCurrent();
  const deduped = [];
  const seen = new Set();
  for (const item of [...fetched, ...current]) {
    const key = `${normalizeUrl(item.url)}::${normalizeTitle(item.title)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }
  const withTimestamps = deduped.map((item) => ({
    item,
    ts: Date.parse(item.publishedAt) || 0
  }));
  withTimestamps.sort((a, b) => b.ts - a.ts);
  const sorted = withTimestamps.map((entry) => entry.item);
  const items = sorted.slice(0, maxItems);

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 2), 'utf8');
  console.log(`Daily snapshot updated with ${items.length} items.`);
}

main().catch((error) => {
  console.error('Daily snapshot generation failed:', error);
  process.exitCode = 1;
});
