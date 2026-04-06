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
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/admin/login",
				pattern: /^\/admin\/login\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
