import { p as private_env } from "./shared-server.js";
import { anyApi } from "convex/server";
import { ConvexHttpClient } from "convex/browser";
const toolSourceOrder = ["github", "instagram", "x", "youtube"];
const toolCategoryOrder = ["svelte", "rust", "go", "ruby", "html-css", "cpp-csharp", "general-news"];
const toolSourceLabels = {
  github: "GitHub",
  instagram: "Instagram",
  x: "X",
  youtube: "YouTube"
};
const toolCategoryLabels = {
  svelte: "Svelte",
  rust: "Rust",
  go: "Go",
  ruby: "Ruby",
  "html-css": "HTML/CSS",
  "cpp-csharp": "C/C++/C#",
  "general-news": "General News"
};
const convexUrl = private_env.CONVEX_URL?.trim() ?? "";
function getConvexClient() {
  return convexUrl ? new ConvexHttpClient(convexUrl) : null;
}
function resolveCategory(item) {
  return item.category ?? "general-news";
}
async function listToolSourceItems() {
  const client = getConvexClient();
  if (!client) {
    return [];
  }
  try {
    return await client.query(anyApi.toolSources.listToolSources, {});
  } catch {
    return [];
  }
}
function buildSourceSummary(items) {
  const bySource = {
    github: items.filter((item) => item.source === "github"),
    instagram: items.filter((item) => item.source === "instagram"),
    x: items.filter((item) => item.source === "x"),
    youtube: items.filter((item) => item.source === "youtube")
  };
  const byCategory = Object.fromEntries(
    toolCategoryOrder.map((category) => [
      category,
      items.filter((item) => resolveCategory(item) === category)
    ])
  );
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
export {
  toolCategoryOrder as a,
  buildSourceSummary as b,
  toolCategoryLabels as c,
  listToolSourceItems as l,
  toolSourceLabels as t
};
