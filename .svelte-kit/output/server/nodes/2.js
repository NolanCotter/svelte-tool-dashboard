import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.EqM-p5G3.js","_app/immutable/chunks/COzcJkHP.js","_app/immutable/chunks/foCw6UGp.js","_app/immutable/chunks/CF4I9gi4.js","_app/immutable/chunks/DA1a2D4D.js","_app/immutable/chunks/By76K7w7.js","_app/immutable/chunks/BBzQeNp9.js","_app/immutable/chunks/CsMN4QQA.js","_app/immutable/chunks/CD8yR_z2.js","_app/immutable/chunks/Ye5XXg07.js","_app/immutable/chunks/DiDa_BQB.js"];
export const stylesheets = [];
export const fonts = [];
