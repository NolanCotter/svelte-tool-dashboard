# svelte-tool-dashboard

A minimal SvelteKit dashboard for tracking new Svelte tools and libraries from GitHub, startups, and daily.dev.

## Goals
- Aggregate new tool announcements from multiple sources
- Normalize items into a single feed
- Support daily automation updates
- Keep the UI calm, minimal, and dark by default

## Structure
- `src/routes/+page.svelte` — dashboard shell and source overview
- `src/lib/data/sources.ts` — source definitions for GitHub, startups, and daily.dev
- `src/lib/server/ingest.ts` — ingestion placeholder for future scheduled jobs
- `src/routes/api/ingest/+server.ts` — API stub for refresh workflows

## Next steps
- Wire source fetchers for GitHub releases, startup launch feeds, and daily.dev
- Add storage for normalized tool records
- Schedule daily refreshes and incremental updates
- Expand item detail views and filtering
