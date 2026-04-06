import "@sveltejs/kit";
import { p as private_env } from "../../../chunks/shared-server.js";
import { anyApi } from "convex/server";
import { ConvexHttpClient } from "convex/browser";
import { l as listToolSourceItems, b as buildSourceSummary, t as toolSourceLabels, a as toolCategoryOrder, c as toolCategoryLabels } from "../../../chunks/tool-sources.js";
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function calculateBracesMetrics(observation) {
  const confidence = clamp(observation.confidence, 0, 1);
  const visibility = clamp(
    ((observation.upperArchVisible ? 0.5 : 0) + (observation.lowerArchVisible ? 0.5 : 0) + Math.min(observation.visibleBrackets / 12, 0.5)) / 1.5,
    0,
    1
  );
  const score = Math.round((confidence * 0.65 + visibility * 0.35) * 100);
  const status = score >= 74 ? "strong-signal" : score >= 46 ? "steady" : "needs-review";
  return {
    score,
    visibility: Number(visibility.toFixed(2)),
    confidence: Number(confidence.toFixed(2)),
    visibleBrackets: Math.max(0, Math.round(observation.visibleBrackets)),
    status
  };
}
function summarizeObservation(observations) {
  if (!observations.length) {
    return {
      averageScore: 0,
      averageConfidence: 0,
      averageVisibility: 0,
      totalVisibleBrackets: 0,
      status: "needs-review"
    };
  }
  const metrics = observations.map(calculateBracesMetrics);
  const averageScore = metrics.reduce((sum, item) => sum + item.score, 0) / metrics.length;
  const averageConfidence = metrics.reduce((sum, item) => sum + item.confidence, 0) / metrics.length;
  const averageVisibility = metrics.reduce((sum, item) => sum + item.visibility, 0) / metrics.length;
  const totalVisibleBrackets = metrics.reduce((sum, item) => sum + item.visibleBrackets, 0);
  const status = averageScore >= 74 ? "strong-signal" : averageScore >= 46 ? "steady" : "needs-review";
  return {
    averageScore: Number(averageScore.toFixed(2)),
    averageConfidence: Number(averageConfidence.toFixed(2)),
    averageVisibility: Number(averageVisibility.toFixed(2)),
    totalVisibleBrackets,
    status
  };
}
const convexUrl = private_env.CONVEX_URL?.trim() ?? "";
function getConvexClient() {
  return convexUrl ? new ConvexHttpClient(convexUrl) : null;
}
async function listPhotoRecords() {
  const client = getConvexClient();
  if (!client) {
    return [];
  }
  try {
    return await client.query(anyApi.photoHistory.listPhotos, {});
  } catch {
    return [];
  }
}
function buildDashboardSummary(records) {
  const observations = records.map((record) => record.observation);
  const summary = summarizeObservation(observations);
  const last = records.at(-1) ?? null;
  return {
    count: records.length,
    averageScore: summary.averageScore,
    latest: last,
    status: last ? last.metrics.status : "needs-review"
  };
}
function labelDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(date));
}
function clockTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(date));
}
const load = async () => {
  const [records, sourceItems] = await Promise.all([listPhotoRecords(), listToolSourceItems()]);
  const summary = buildDashboardSummary(records);
  const sourceSummary = buildSourceSummary(sourceItems);
  const history = [...records].reverse().map((record) => ({
    ...record,
    dayLabel: labelDate(record.createdAt),
    timeLabel: clockTime(record.createdAt)
  }));
  const series = records.slice(-8).map((record) => ({
    label: labelDate(record.createdAt),
    score: record.metrics.score,
    confidence: Math.round(record.metrics.confidence * 100),
    brackets: record.metrics.visibleBrackets,
    visibility: Math.round(record.metrics.visibility * 100),
    status: record.metrics.status
  }));
  return {
    records: history,
    summary,
    series,
    latest: history[0] ?? null,
    sourceItems,
    sourceSummary,
    toolCategoryLabels,
    toolCategoryOrder,
    toolSourceLabels
  };
};
export {
  load
};
