import { b as base } from "../../chunks/server.js";
import "../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
import { redirect } from "@sveltejs/kit";
import { l as listToolSourceItems, b as buildSourceSummary } from "../../chunks/tool-sources.js";
const load = async ({ locals }) => {
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
export {
  load
};
