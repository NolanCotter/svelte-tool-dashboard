import * as universal from '../entries/pages/admin/_page.ts.js';
import * as server from '../entries/pages/admin/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/admin/+page.ts";
export { server };
export const server_id = "src/routes/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.DciNZpRP.js","_app/immutable/chunks/COzcJkHP.js","_app/immutable/chunks/foCw6UGp.js","_app/immutable/chunks/CF4I9gi4.js","_app/immutable/chunks/DA1a2D4D.js","_app/immutable/chunks/BBzQeNp9.js","_app/immutable/chunks/CsaB0XZs.js","_app/immutable/chunks/By76K7w7.js","_app/immutable/chunks/COd4c2_j.js","_app/immutable/chunks/BZ3nl2gh.js","_app/immutable/chunks/CsMN4QQA.js","_app/immutable/chunks/CD8yR_z2.js"];
export const stylesheets = ["_app/immutable/assets/4.B0Xkuus3.css"];
export const fonts = [];
