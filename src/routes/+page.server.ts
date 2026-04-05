import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
  buildSourceSummary,
  listToolSourceItems,
  toolCategoryLabels,
  toolCategoryOrder,
  toolSourceLabels
} from '$lib/server/tool-sources';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(303, '/admin');
  }

  const sourceItems = await listToolSourceItems();
  const sourceSummary = buildSourceSummary(sourceItems);

  return {
    signInHref: '/admin/login?returnTo=' + encodeURIComponent('/admin'),
    sourceItems,
    sourceSummary,
    toolCategoryLabels,
    toolCategoryOrder,
    toolSourceLabels
  };
};
