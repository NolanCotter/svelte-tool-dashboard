// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { buildDashboardSummary, listPhotoRecords } from '$lib/server/photo-store';
import { buildSourceSummary, listToolSourceItems, toolCategoryLabels, toolCategoryOrder, toolSourceLabels } from '$lib/server/tool-sources';
import type { PageServerLoad } from './$types';

function labelDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

function clockTime(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(date));
}

export const load = async () => {
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

;null as any as PageServerLoad;