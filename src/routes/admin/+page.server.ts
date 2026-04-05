import { redirect, fail } from '@sveltejs/kit';
import { analyzeBracesImage } from '$lib/server/vision';
import { buildDashboardSummary, listPhotoRecords, savePhotoRecord } from '$lib/server/photo-store';
import { buildSourceSummary, listToolSourceItems, toolCategoryLabels, toolCategoryOrder, toolSourceLabels } from '$lib/server/tool-sources';
import type { Actions, PageServerLoad } from './$types';

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

export const load: PageServerLoad = async () => {
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

export const actions: Actions = {
  capture: async ({ request }) => {
    const form = await request.formData();
    const imageDataUrl = String(form.get('imageDataUrl') ?? '').trim();
    const note = String(form.get('note') ?? '').trim();
    const mimeType = String(form.get('mimeType') ?? 'image/jpeg').trim() || 'image/jpeg';

    if (!imageDataUrl.startsWith('data:image/')) {
      return fail(400, { error: 'Add a photo first.' });
    }

    const base64 = imageDataUrl.split(',')[1] ?? '';
    if (!base64) {
      return fail(400, { error: 'Could not read the captured image.' });
    }

    let analysis;

    try {
      analysis = await analyzeBracesImage({ imageBase64: base64, mimeType, notes: note });
    } catch (error) {
      return fail(503, {
        error: error instanceof Error ? error.message : 'Could not analyze the photo.'
      });
    }

    try {
      await savePhotoRecord({
        id: crypto.randomUUID(),
        createdAt: analysis.parsed.timestamp ?? new Date().toISOString(),
        label: note || 'Capture',
        note,
        imageDataUrl,
        mimeType,
        observation: analysis.parsed,
        analysisText: analysis.rawText
      });
    } catch (error) {
      return fail(503, {
        error: error instanceof Error ? error.message : 'Could not save the photo.'
      });
    }

    throw redirect(303, '/admin');
  }
};
