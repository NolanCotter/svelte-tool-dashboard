import { json } from '@sveltejs/kit';
import { buildDailyToolFeed } from '$lib/server/ingest';

export async function GET() {
  const payload = await buildDailyToolFeed();
  return json(payload);
}
