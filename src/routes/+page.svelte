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
    { label: 'Sources', value: '3' },
    { label: 'Update cadence', value: 'Daily' },
    { label: 'Mode', value: 'Dark' }
  ];

  const futureItems = [
    {
      title: 'GitHub release watcher',
      meta: 'Monitor repos and surface new Svelte tooling.'
    },
    {
      title: 'Startup launch ingest',
      meta: 'Collect fresh Svelte-adjacent product launches.'
    },
    {
      title: 'daily.dev sync',
      meta: 'Pull community picks into one clean feed.'
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
          A calm, minimal dashboard for aggregating new Svelte tools and libraries from GitHub,
          startup launches, and daily.dev, with a structure ready for daily automation.
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
        <h2 class="panel-title">Feed skeleton</h2>
        <p class="muted" style="margin-top: 8px; line-height: 1.6;">
          The feed starts empty on purpose. Daily jobs can normalize incoming items into this view
          without changing the layout.
        </p>
        <div class="feed-list" style="margin-top: 16px;">
          {#each futureItems as item}
            <div class="row">
              <div>
                <div>{item.title}</div>
                <div class="muted" style="margin-top: 4px; font-size: 0.92rem;">{item.meta}</div>
              </div>
              <span class="badge">planned</span>
            </div>
          {/each}
        </div>
      </div>
    </section>
  </main>
</div>
