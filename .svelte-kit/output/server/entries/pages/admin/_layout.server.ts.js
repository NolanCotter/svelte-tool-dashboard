import { b as building } from "../../../chunks/environment.js";
import { b as base } from "../../../chunks/server.js";
import "../../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import { redirect } from "@sveltejs/kit";
const load = async ({ locals, url }) => {
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
export {
  load
};
