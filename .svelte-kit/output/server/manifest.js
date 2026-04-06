export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "svelte-tool-dashboard/_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.CHlFIOpt.js",app:"_app/immutable/entry/app.BVUt2HHV.js",imports:["_app/immutable/entry/start.CHlFIOpt.js","_app/immutable/chunks/Ye5XXg07.js","_app/immutable/chunks/foCw6UGp.js","_app/immutable/chunks/CsMN4QQA.js","_app/immutable/chunks/CD8yR_z2.js","_app/immutable/entry/app.BVUt2HHV.js","_app/immutable/chunks/foCw6UGp.js","_app/immutable/chunks/DA1a2D4D.js","_app/immutable/chunks/COzcJkHP.js","_app/immutable/chunks/CD8yR_z2.js","_app/immutable/chunks/BBzQeNp9.js","_app/immutable/chunks/BZ3nl2gh.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/svelte-tool-dashboard/","/svelte-tool-dashboard/__data.json","/svelte-tool-dashboard/admin/","/svelte-tool-dashboard/admin/__data.json","/svelte-tool-dashboard/admin/login/","/svelte-tool-dashboard/admin/login/__data.json"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
