import { sources } from '$lib/data/sources';

export type ToolRecord = {
  title: string;
  sourceId: string;
  url: string;
  summary: string;
  tags: string[];
  publishedAt: string;
};

export async function buildDailyToolFeed(): Promise<{ sources: typeof sources; items: ToolRecord[] }> {
  return {
    sources,
    items: []
  };
}
