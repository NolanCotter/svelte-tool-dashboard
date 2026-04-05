import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const sourceValidator = v.union(v.literal('github'), v.literal('instagram'), v.literal('x'), v.literal('youtube'));
const categoryValidator = v.union(
  v.literal('svelte'),
  v.literal('rust'),
  v.literal('go'),
  v.literal('ruby'),
  v.literal('html-css'),
  v.literal('cpp-csharp'),
  v.literal('general-news')
);
const kindValidator = v.union(v.literal('tool'), v.literal('startup'), v.literal('repo'));

const sourceItemValidator = v.object({
  id: v.string(),
  source: sourceValidator,
  category: categoryValidator,
  kind: kindValidator,
  title: v.string(),
  summary: v.string(),
  url: v.string(),
  author: v.optional(v.string()),
  publishedAt: v.string(),
  createdAt: v.string(),
  tags: v.array(v.string()),
  note: v.optional(v.string()),
  score: v.number()
});

export const listToolSources = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('toolSources').withIndex('by_publishedAt').order('desc').collect();
  }
});

export const replaceToolSources = mutation({
  args: {
    items: v.array(sourceItemValidator)
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('toolSources').collect();

    for (const item of existing) {
      await ctx.db.delete(item._id);
    }

    for (const item of args.items) {
      await ctx.db.insert('toolSources', item);
    }

    return { ok: true, count: args.items.length };
  }
});
