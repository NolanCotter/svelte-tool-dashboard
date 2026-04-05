import { env } from '$env/dynamic/private';
import { anyApi } from 'convex/server';
import { ConvexHttpClient } from 'convex/browser';
import { calculateBracesMetrics, summarizeObservation, type BracesMetrics } from './metrics';
import type { BracesObservation } from './vision';

export type PhotoRecord = {
  id: string;
  createdAt: string;
  label: string;
  note: string;
  imageDataUrl: string;
  mimeType: string;
  observation: BracesObservation;
  metrics: BracesMetrics;
  analysisText: string;
};

const convexUrl = env.CONVEX_URL?.trim() ?? '';

function getConvexClient() {
  return convexUrl ? new ConvexHttpClient(convexUrl) : null;
}

export async function listPhotoRecords() {
  const client = getConvexClient();

  if (!client) {
    return [] as PhotoRecord[];
  }

  try {
    return (await client.query(anyApi.photoHistory.listPhotos, {})) as PhotoRecord[];
  } catch {
    return [] as PhotoRecord[];
  }
}

export async function savePhotoRecord(record: Omit<PhotoRecord, 'metrics'> & { observation: BracesObservation }) {
  const client = getConvexClient();

  if (!client) {
    throw new Error('CONVEX_URL is required for photo storage.');
  }

  const metrics = calculateBracesMetrics(record.observation);
  const nextRecord: PhotoRecord = { ...record, metrics };
  await client.mutation(anyApi.photoHistory.savePhoto, nextRecord);
  return nextRecord;
}

export function buildDashboardSummary(records: PhotoRecord[]) {
  const observations = records.map((record) => record.observation);
  const summary = summarizeObservation(observations);
  const last = records.at(-1) ?? null;

  return {
    count: records.length,
    averageScore: summary.averageScore,
    latest: last,
    status: last ? last.metrics.status : 'needs-review'
  };
}
