# svelte-tool-dashboard

Minimal SvelteKit dashboard for daily multi-language developer news.

## Daily aggregation for gh-pages

The deploy workflow now runs a scheduled daily snapshot before building:

- `npm run snapshot:daily`
- writes `src/lib/data/daily-snapshot.json`
- keeps up to 180 deduplicated items
- homepage uses this snapshot automatically when live storage is empty

Configure feed URLs with environment variables:

`AGGREGATION_{CATEGORY}_{SOURCE}_FEED_URL`

Examples:

- `AGGREGATION_SVELTE_GITHUB_FEED_URL`
- `AGGREGATION_GENERAL_NEWS_YOUTUBE_FEED_URL`

Categories: `svelte`, `rust`, `go`, `ruby`, `html-css`, `cpp-csharp`, `general-news`  
Sources: `github`, `instagram`, `x`, `youtube`
