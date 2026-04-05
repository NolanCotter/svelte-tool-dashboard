<svelte:head>
  <title>Svelte Tool Dashboard</title>
  <meta name="description" content="Minimal multi-language developer signals workspace." />
</svelte:head>

<script lang="ts">
  import { flip } from '$lib/actions/flip';
  import { pretext } from '$lib/actions/pretext';
  import type { PageData } from './$types';

  export let data: PageData;

  function formatDate(value: string) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(value));
  }

  function formatClock(value: string) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(value));
  }

  function excerpt(text: string, length = 160) {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (normalized.length <= length) return normalized;
    return `${normalized.slice(0, length).trimEnd()}…`;
  }
</script>

<div class="page-shell">
  <main class="shell landing-grid">
    <section class="card hero-panel landing-hero zen-hero">
      <div class="hero-slab">
        <div class="hero-copy pretext-frame" style="max-width: 64ch;">
          <div class="eyebrow">Japanese minimalist signal board</div>
          <h1 class="hero-title" use:pretext={{ min: 34, max: 84 }}>Svelte Tool Dashboard</h1>
          <p class="lede" style="max-width: 58ch;">
            A calm workspace for Svelte, Rust, Go, Ruby, HTML/CSS, C/C++/C#, and general news feeds.
            Tap into the latest sources, then open the admin area when you want to review captures.
          </p>
          <div class="toolbar-row">
            <a class="button-primary" href={data.signInHref}>Sign in</a>
            <a class="button-secondary" href={data.signInHref}>Admin login</a>
          </div>
        </div>

        <div class="zen-stat-grid" style="max-width: 520px; width: 100%;">
          <article class="stat-chip zen-stat">
            <span class="nav-label">Sources active</span>
            <span class="value">{data.sourceSummary.sourceCount}</span>
            <span class="metric-detail">GitHub, Instagram, X, and YouTube lanes are wired into the dashboard.</span>
          </article>
          <article class="stat-chip zen-stat">
            <span class="nav-label">Language lanes</span>
            <span class="value">{data.sourceSummary.categoryCount}</span>
            <span class="metric-detail">Category lanes ready for the daily refresh.</span>
          </article>
          <article class="stat-chip zen-stat">
            <span class="nav-label">Tool snapshot</span>
            <span class="value">{data.sourceSummary.count}</span>
            <span class="metric-detail">{data.sourceSummary.count > 0 ? 'Latest signals are available below.' : 'No source items yet.'}</span>
          </article>
          <article class="stat-chip zen-stat">
            <span class="nav-label">Latest update</span>
            {#if data.sourceSummary.latest}
              <span class="value">{formatDate(data.sourceSummary.latest.publishedAt)}</span>
              <span class="metric-detail">{data.sourceSummary.latest.title}</span>
            {:else}
              <span class="value">—</span>
              <span class="metric-detail">Waiting for the first feed refresh.</span>
            {/if}
          </article>
        </div>
      </div>
    </section>

    <section class="card panel-card" in:flip={{ duration: 420 }}>
      <div class="section-kicker">Latest source</div>
      {#if data.sourceSummary.latest}
        <div style="display:grid; gap: 10px; margin-top: 10px;">
          <h2 class="panel-title" style="margin: 0;">{data.sourceSummary.latest.title}</h2>
          <p class="subtle" style="margin: 0; max-width: 72ch;">{excerpt(data.sourceSummary.latest.summary, 220)}</p>
          <div class="toolbar-row" style="margin-top: 4px;">
            <span class="pill">{data.sourceSummary.sourceLabels[data.sourceSummary.latest.source]}</span>
            <span class="pill">{data.sourceSummary.categoryLabels[data.sourceSummary.latest.category]}</span>
            <span class="pill">{formatDate(data.sourceSummary.latest.publishedAt)} · {formatClock(data.sourceSummary.latest.publishedAt)}</span>
            <a class="button-secondary" href={data.sourceSummary.latest.url} target="_blank" rel="noreferrer">Open source</a>
          </div>
        </div>
      {:else}
        <p class="subtle" style="margin: 0;">No source items yet. Add feed URLs and refresh the dashboard.</p>
      {/if}
    </section>

    <section class="card panel-card">
      <div class="section-kicker">Category lanes</div>
      <div class="surface-list" style="margin-top: 12px;">
        {#each data.sourceSummary.categoryOrder as category}
          <article class="stat-chip">
            <div style="display:flex; justify-content:space-between; gap: 12px; align-items:baseline;">
              <strong>{data.sourceSummary.categoryLabels[category]}</strong>
              <span class="caption">{data.sourceSummary.byCategory[category].length} items</span>
            </div>
            {#if data.sourceSummary.byCategory[category][0]}
              <p class="caption" style="margin: 8px 0 0;">
                {data.sourceSummary.byCategory[category][0].title} · {formatDate(data.sourceSummary.byCategory[category][0].publishedAt)}
              </p>
            {:else}
              <p class="caption" style="margin: 8px 0 0;">No items yet for this lane.</p>
            {/if}
          </article>
        {/each}
      </div>
    </section>

    <section class="card panel-card">
      <div class="section-kicker">Recent items</div>
      <div class="surface-list" style="margin-top: 12px;">
        {#each data.sourceItems.slice(0, 6) as item}
          <article class="stat-chip">
            <div style="display:flex; justify-content:space-between; gap: 12px; align-items:baseline;">
              <strong>{item.title}</strong>
              <span class="caption">{data.sourceSummary.sourceLabels[item.source]}</span>
            </div>
            <p class="caption" style="margin: 8px 0 0;">{excerpt(item.summary, 170)}</p>
            <div class="caption" style="margin-top: 8px; display:flex; gap: 8px; flex-wrap:wrap;">
              <span>{data.sourceSummary.categoryLabels[item.category]}</span>
              <span>·</span>
              <span>{formatDate(item.publishedAt)}</span>
              <span>·</span>
              <a href={item.url} target="_blank" rel="noreferrer">Open</a>
            </div>
          </article>
        {:else}
          <p class="subtle" style="margin: 0;">No recent items yet.</p>
        {/each}
      </div>
    </section>
  </main>
</div>
