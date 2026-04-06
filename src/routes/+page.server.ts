import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { buildSourceSummary, listToolSourceItems } from '$lib/server/tool-sources';
import dailySnapshot from '$lib/data/daily-snapshot.json';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(303, `${base}/admin`);
  }

  const liveItems = await listToolSourceItems();
  const dailySnapshotItems = Array.isArray(dailySnapshot.items) ? dailySnapshot.items : [];
  const sourceItems = liveItems.length ? liveItems : dailySnapshotItems;
  const sourceSummary = buildSourceSummary(sourceItems);

  return {
    signInHref: `${base}/admin/login?returnTo=${encodeURIComponent(`${base}/admin`)}`,
    sourceItems,
    sourceSummary
  };
};
