import { building } from '$app/environment';
import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const loginPath = `${base}/admin/login`;

  if (building) {
    return { admin: true, user: null };
  }

  if (url.pathname === loginPath) {
    return { admin: false, user: null };
  }

  if (!locals.user) {
    throw redirect(303, `${loginPath}?returnTo=${encodeURIComponent(url.pathname)}`);
  }

  return {
    admin: true,
    user: locals.user
  };
};
