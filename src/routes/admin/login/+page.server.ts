import { base } from '$app/paths';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

function optional(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : '';
}

export const load: PageServerLoad = async ({ locals, url }) => {
  const defaultReturnTo = `${base}/admin`;
  const returnTo = url.searchParams.get('returnTo') ?? defaultReturnTo;

  if (locals.user) {
    throw redirect(303, returnTo.startsWith(base) ? returnTo : defaultReturnTo);
  }

  return {
    returnTo: returnTo.startsWith(base) ? returnTo : defaultReturnTo,
    adminEmail: optional(env.ADMIN_EMAIL)
  };
};
