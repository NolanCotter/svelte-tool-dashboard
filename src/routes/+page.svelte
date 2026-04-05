<svelte:head>
  <title>Svelte Tool Dashboard</title>
  <meta name="description" content="Minimal multi-language developer signals workspace." />
</svelte:head>

<script lang="ts">
  import { flip } from '$lib/actions/flip';
  import { pretext } from '$lib/actions/pretext';
  import {
    toolCategoryLabels,
    toolCategoryOrder,
    toolSourceLabels,
    type ToolCategory,
    type ToolSourceItem
  } from '$lib/server/tool-sources';
  import type { PageData } from './$types';

  export let data: PageData;

  let activeCategory: ToolCategory = 'svelte';

  $: activeItems = data.sourceSummary.byCategory[activeCategory] ?? [];
  $: activeLabel = toolCategoryLabels[activeCategory];
  $: latestItem = data.sourceSummary.latest;

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

  function selectCategory(category: ToolCategory) {
    activeCategory = category;
  }

  function sourceLabel(item: ToolSourceItem) {
    return toolSourceLabels[item.source];
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
            Tap a lane to flip the preview card while the layout stays soft, quiet, and fast.
          </p>
          <div class="toolbar-row">
            <a class="button-primary" href={data.signInHref}>Sign in</a>
            <a class="button-secondary" href="/admin/login">Admin login</a>
          </div>
        </div>

        <div class="zen-stat-grid" style="max-width: 480px; width: 100%;">
          <article class="stat-chip zen-stat">
            <span class="nav-label">Category lanes</span>
            <strong>{toolCategoryOrder.length}</strong>
            <p class="metric-detail">Seven language-focused filters keep the feed steady and easy to scan.</p>
          </article>
          <article class="stat-chip zen-stat">
            <span class="nav-label">Source lanes</span>
            <strong>{data.sourceSummary.sourceCount || 4}</strong>
            <p class="metric-detail">GitHub, Instagram, X, and YouTube remain the four live source channels.</p>
          </article>
          <article class="stat-chip zen-stat">
            <span class="nav-label">Latest update</span>
            <strong>{latestItem ? formatDate(latestItem.publishedAt) : 'Pending'}</strong>
            <p class="metric-detail">Newest item, if available, leads the board with the cleanest rhythm.</p>
          </article>
          <article class="stat-chip zen-stat">
            <span class="nav-label">Motion</span>
            <strong>Flip</strong>
            <p class="metric-detail">The selected lane transitions with a crisp page-flip animation.</p>
          </article>
        </div>
      </div>

      <div class="meta-grid landing-features">
        <article class="feature-card">
          <span class="nav-label">Latest signal</span>
          {#if latestItem}
            <strong>{latestItem.title}</strong>
            <p class="metric-detail">
              {sourceLabel(latestItem)} · {toolCategoryLabels[latestItem.category]} · {formatDate(latestItem.publishedAt)}
            </p>
          {:else}
            <strong>No source items yet</strong>
            <p class="metric-detail">Refresh the daily source lanes to populate the board.</p>
          {/if}
        </article>
        <article class="feature-card">
          <span class="nav-label">Design note</span>
          <strong>Whitespace-first, with subdued contrast and steady rhythm.</strong>
          <p class="metric-detail">The landing page stays minimal while the feed board carries the active category state.</p>
        </article>
      </div>
    </section>

    <section class="card content-card zen-panel">
      <div style="display:flex; justify-content:space-between; gap: 16px; align-items:flex-start; flex-wrap: wrap;">
        <div>
          <div class="section-kicker">Category filters</div>
          <h2 class="panel-title" style="margin-top: 8px;">Multi-language lanes</h2>
          <p class="subtle" style="max-width: 58ch; margin: 10px 0 0;">
            Select a category to flip the preview board. Each lane stays separated so Svelte, Rust, Go,
            Ruby, HTML/CSS, C/C++/C#, and general news remain easy to skim.
          </p>
        </div>
        <div class="source-rail">
          {#each toolCategoryOrder as category}
            <button class={`source-tab ${activeCategory === category ? 'is-active' : ''}`} type="button" onclick={() => selectCategory(category)}>
              {toolCategoryLabels[category]}
            </button>
          {/each}
        </div>
      </div>

      {#key activeCategory}
        <article class="source-card card" use:flip>
          <div class="source-card__header">
            <div>
              <div class="eyebrow">{activeLabel}</div>
              <h3 class="panel-title" style="margin-top: 8px;" use:pretext={{ min: 24, max: 42 }}>{activeLabel} feed</h3>
              <p class="subtle" style="margin: 8px 0 0; max-width: 46ch;">
                {activeItems.length
                  ? `${activeItems.length} items are currently cached for this lane.`
                  : 'No items have been cached for this lane yet.'}
              </p>
            </div>
            <span class="source-chip">{activeItems[0]?.publishedAt ? formatDate(activeItems[0].publishedAt) : 'pending'}</span>
          </div>

          {#if activeItems.length}
            <div class="source-list">
              {#each activeItems.slice(0, 4) as item}
                <a class="source-item" href={item.url} target="_blank" rel="noreferrer">
                  <div class="source-item__head">
                    <div style="display:grid; gap: 6px; flex: 1;">
                      <div class="source-item__meta">
                        <span class="source-badge">{sourceLabel(item)}</span>
                        <span class="source-badge">{item.score > 0 ? `score ${Math.round(item.score)}` : 'fresh scan'}</span>
                      </div>
                      <h4 class="source-item__title">{item.title}</h4>
                    </div>
                    <span class="tag">{formatDate(item.publishedAt)}</span>
                  </div>
                  <p class="source-item__summary">{excerpt(item.summary, 220)}</p>
                  <div class="source-item__meta">
                    <div class="metric-detail">
                      {item.author ? `${item.author} · ` : ''}{formatClock(item.publishedAt)}
                    </div>
                    <div style="display:flex; flex-wrap:wrap; gap: 8px;">
                      {#each item.tags as tag}
                        <span class="tag">{tag}</span>
                      {/each}
                    </div>
                  </div>
                </a>
              {/each}
            </div>
          {:else}
            <div class="source-empty">
              <strong>Waiting for the first feed pull</strong>
              <p class="metric-detail" style="margin: 0;">
                The refresh route will populate this lane as soon as the category-specific source URLs are configured.
              </p>
            </div>
          {/if}
        </article>
      {/key}
    </section>
  </main>
</div>
