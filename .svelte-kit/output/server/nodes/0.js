import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.Bmxc7M73.js","_app/immutable/chunks/COzcJkHP.js","_app/immutable/chunks/foCw6UGp.js","_app/immutable/chunks/CF4I9gi4.js"];
export const stylesheets = ["_app/immutable/assets/0.D6Qx3N94.css"];
export const fonts = [];
