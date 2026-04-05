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
      title: 'neohtop',
      meta: 'GitHub Trending · Rust, Tauri, and Svelte · desktop system monitoring',
      badge: 'GitHub',
      href: 'https://github.com/Abdenasser/neohtop'
    },
    {
      title: 'daisyUI',
      meta: 'GitHub Trending · Tailwind CSS component library · strong adoption',
      badge: 'GitHub',
      href: 'https://github.com/saadeghi/daisyui'
    },
    {
      title: 'layerchart',
      meta: 'GitHub Trending · composable Svelte charts · clean data viz',
      badge: 'GitHub',
      href: 'https://github.com/techniq/layerchart'
    },
    {
      title: 'kener',
      meta: 'GitHub Trending · batteries-included status pages · polished ops UI',
      badge: 'GitHub',
      href: 'https://github.com/rajnandan1/kener'
    },
    {
      title: 'networking-toolbox',
      meta: 'GitHub Trending · offline-first networking utilities · practical toolset',
      badge: 'GitHub',
      href: 'https://github.com/Lissy93/networking-toolbox'
    },
    {
      title: 'Svelte Summit 2026 on Instagram',
      meta: 'Instagram · sveltelife reel · conference energy and community signal',
      badge: 'Instagram',
      href: 'https://www.instagram.com/reel/DTm_6NpiQSZ/'
    },
    {
      title: 'This Week in Svelte teaser',
      meta: 'X · SvelteSociety · new episode announcement and runes discussion',
      badge: 'X',
      href: 'https://x.com/SvelteSociety/status/1831714914140065851'
    },
    {
      title: 'How did Svelte do in State of JavaScript 2025?!',
      meta: 'YouTube · Kev and Jeppe · ecosystem snapshot and survey talk',
      badge: 'YouTube',
      href: 'https://www.youtube.com/watch?v=AuCo3vhL7SQ'
    },
    {
      title: 'Svelte 5 in 2026: Runes-First Engineering for Developers',
      meta: 'YouTube · framework overview with a 2026 angle',
      badge: 'YouTube',
      href: 'https://www.youtube.com/watch?v=h7CftX7yTio'
    },
    {
      title: 'Flumio',
      meta: 'daily.dev · workflow automation startup · featured in the April 2026 Svelte roundup',
      badge: 'daily.dev',
      href: 'https://app.daily.dev/posts/what-s-new-in-svelte-april-2026-qmrljmssi'
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
          A calm, minimal dashboard for aggregating new Svelte tools and libraries from
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
          The feed now highlights current Svelte signals from GitHub, X, Instagram, YouTube,
          and daily.dev without changing the quiet layout.
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
