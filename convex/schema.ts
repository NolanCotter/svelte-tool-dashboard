import { defineSchema, defineTable } from 'convex/server';
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

export default defineSchema({
  photoHistory: defineTable({
    id: v.string(),
    createdAt: v.string(),
    label: v.string(),
    note: v.string(),
    imageDataUrl: v.string(),
    mimeType: v.string(),
    observation: v.object({
      timestamp: v.optional(v.string()),
      upperArchVisible: v.boolean(),
      lowerArchVisible: v.boolean(),
      confidence: v.number(),
      visibleBrackets: v.number()
    }),
    metrics: v.object({
      score: v.number(),
      visibility: v.number(),
      confidence: v.number(),
      visibleBrackets: v.number(),
      status: v.union(v.literal('needs-review'), v.literal('steady'), v.literal('strong-signal'))
    }),
    analysisText: v.string()
  }).index('by_createdAt', ['createdAt']),
  toolSources: defineTable({
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
  }).index('by_createdAt', ['createdAt']).index('by_publishedAt', ['publishedAt'])
});
