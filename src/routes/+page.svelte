<svelte:head>
  <title>svelte-tool-dashboard</title>
  <meta
    name="description"
    content="A minimal SvelteKit dashboard for tracking new Svelte tools and libraries."
  />
</svelte:head>

<script lang="ts">
  import { sources } from '$lib/data/sources';

  const stats = [
    { label: 'Sources', value: '5' },
    { label: 'Update cadence', value: 'Daily' },
    { label: 'Mode', value: 'Dark' }
  ];

  const feedItems = [
    {
      title: 'SvelteKit OpenTelemetry',
      meta: 'X · @dummdidumm_ · tracing now lands in instrumentation.server.ts',
      badge: 'X',
      href: 'https://x.com/dummdidumm_/status/1998166728174608449'
    },
    {
      title: 'Rust image compressor + SvelteKit',
      meta: 'X · @leerob · a coding-agent build experiment with SvelteKit in the loop',
      badge: 'X',
      href: 'https://x.com/leerob/status/2005700621463330888'
    },
    {
      title: 'Svelte AI Elements',
      meta: 'X · @Sikandar_Bhide · an in-progress Svelte 5 UI set with animated bits',
      badge: 'X',
      href: 'https://animation-svelte.vercel.app'
    },
    {
      title: 'SvelteKit form library',
      meta: 'Instagram · syntax_fm · auto-generates client-side HTML for forms',
      badge: 'Instagram',
      href: 'https://www.instagram.com/reel/DRNWXMvEVdi/'
    },
    {
      title: 'Brand-new SvelteKit deployment',
      meta: 'Instagram · munyadesign_ · a fresh SvelteKit build walkthrough',
      badge: 'Instagram',
      href: 'https://www.instagram.com/p/DJEDEGvvBv4/'
    },
    {
      title: 'lluambo.com',
      meta: 'Instagram · Svelte + SvelteKit portfolio site with a quiet visual language',
      badge: 'Instagram',
      href: 'https://www.instagram.com/reel/DTLZkHkjWyn/'
    },
    {
      title: 'Advent of Svelte 2025 · fork',
      meta: 'YouTube Shorts · Svelte Society · preloading and tab switching',
      badge: 'YouTube',
      href: 'https://www.youtube.com/shorts/WHvNIr6Xhmw'
    },
    {
      title: 'Advent of Svelte 2025 · hydratable',
      meta: 'YouTube Shorts · CSP-aware hydration and timing details',
      badge: 'YouTube',
      href: 'https://www.youtube.com/shorts/tO5aa2vlLQg'
    },
    {
      title: 'How did Svelte do in the State of JavaScript 2025?!',
      meta: 'YouTube · Svelte ecosystem snapshot and survey talk',
      badge: 'YouTube',
      href: 'https://www.youtube.com/watch?v=AuCo3vhL7SQ'
    },
    {
      title: 'Svelte 5 in 2026: Runes-First Engineering for Developers',
      meta: 'YouTube · a clean 2026 framework overview',
      badge: 'YouTube',
      href: 'https://www.youtube.com/watch?v=h7CftX7yTio'
    }
  ];
</script>

<div class="page-shell">
  <main class="shell">
    <section class="card topbar">
      <div style="max-width: 68ch;">
        <div class="eyebrow">Svelte tool watch</div>
        <h1>svelte-tool-dashboard</h1>
        <p class="lede">
          A calm, minimal dashboard for aggregating new Svelte signals from
          GitHub, X, Instagram, YouTube, and daily.dev, with a structure ready for daily automation.
        </p>
        <div class="toolbar">
          <a class="button primary" href="#feed">Open feed</a>
          <a class="button" href="#sources">View sources</a>
        </div>
      </div>

      <div class="meta-grid" aria-label="project stats">
        {#each stats as stat}
          <div class="meta">
            <span class="muted">{stat.label}</span>
            <span class="meta-value">{stat.value}</span>
          </div>
        {/each}
      </div>
    </section>

    <section class="grid" style="grid-template-columns: repeat(12, minmax(0, 1fr));">
      <div class="card panel" id="sources" style="grid-column: span 5;">
        <h2 class="panel-title">Sources</h2>
        <p class="muted" style="margin-top: 8px; line-height: 1.6;">
          The first pass keeps the source list explicit so later automations can add fetchers without
          changing the UI structure.
        </p>
        <div class="source-list" style="margin-top: 16px;">
          {#each sources as source}
            <div class="row">
              <div>
                <div>{source.label}</div>
                <div class="muted" style="margin-top: 4px; font-size: 0.92rem;">{source.description}</div>
              </div>
              <span class="badge">{source.kind}</span>
            </div>
          {/each}
        </div>
      </div>

      <div class="card panel" id="feed" style="grid-column: span 7;">
        <h2 class="panel-title">Curated feed</h2>
        <p class="muted" style="margin-top: 8px; line-height: 1.6;">
          A second, quieter batch of Svelte discoveries from X, Instagram, YouTube,
          GitHub, and daily.dev, held in the same restrained layout.
        </p>
        <div class="feed-list" style="margin-top: 16px;">
          {#each feedItems as item}
            <div class="row">
              <div>
                <div class="row-title">
                  <a href={item.href} target="_blank" rel="noreferrer" style="color: inherit; text-decoration: none;">{item.title}</a>
                </div>
                <div class="muted" style="margin-top: 4px; font-size: 0.92rem;">{item.meta}</div>
              </div>
              <span class="badge">{item.badge}</span>
            </div>
          {/each}
        </div>
      </div>
    </section>
  </main>
</div>
