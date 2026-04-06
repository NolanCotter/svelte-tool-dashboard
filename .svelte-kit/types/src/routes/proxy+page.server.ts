// @ts-nocheck
import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { buildSourceSummary, listToolSourceItems } from '$lib/server/tool-sources';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  if (locals.user) {
    throw redirect(303, `${base}/admin`);
  }

  const sourceItems = await listToolSourceItems();
  const sourceSummary = buildSourceSummary(sourceItems);

  return {
    signInHref: `${base}/admin/login?returnTo=${encodeURIComponent(`${base}/admin`)}`,
    sourceItems,
    sourceSummary
  };
};
