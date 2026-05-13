<svelte:head>
  <title>ToolPulse — Global Language Tool Radar</title>
  <meta
    name="description"
    content="A global language-focused tool and update aggregator with a dedicated intake zone for submitting new language tool updates."
  />
</svelte:head>

<script lang="ts">
  import Badge from '$lib/components/ui/badge.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import { flip } from '$lib/actions/flip';
  import type { PageData } from './$types';

  export let data: PageData;
  let activeIndex = 0;
  let rapidTimer: ReturnType<typeof setInterval> | null = null;

  $: categories = data.sourceSummary.categoryOrder;
  $: activeCategory = categories[activeIndex] ?? 'general-news';
  $: activeItems = data.sourceSummary.byCategory[activeCategory] ?? [];
  $: activeLabel = data.sourceSummary.categoryLabels[activeCategory];

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

  function excerpt(text: string, length = 150) {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (normalized.length <= length) return normalized;
    return `${normalized.slice(0, length).trimEnd()}…`;
  }

  function shiftCategory(step: number) {
    if (!categories.length) return;
    activeIndex = (activeIndex + step + categories.length) % categories.length;
  }

  function startRapid(step: number) {
    stopRapid();
    shiftCategory(step);
    rapidTimer = setInterval(() => shiftCategory(step), 120);
  }

  function stopRapid() {
    if (rapidTimer) clearInterval(rapidTimer);
    rapidTimer = null;
  }
</script>

<div class="dashboard-page">
  <main class="dashboard-shell">
    <header class="hero">
      <div>
        <p class="eyebrow">Global language tool intelligence</p>
        <h1>ToolPulse</h1>
        <p class="hero-lede">
          Track daily launches, updates, and ecosystem movement across programming languages with a news-style,
          high-signal interface.
        </p>
      </div>
      <div class="hero-actions">
        <Button href={data.signInHref}>Open Admin Workspace</Button>
        <Badge variant="secondary">{data.sourceSummary.count} indexed updates</Badge>
      </div>
    </header>

    <section class="panel intake-panel" id="update-intake-zone">
      <div class="panel-head">
        <h2>Language Update Intake Zone</h2>
        <Badge>Intake Target</Badge>
      </div>
      <p class="panel-copy">
        This is the dedicated submit point for new tool entries and language-specific update notes. Keep this zone
        pinned in your workflow.
      </p>

      <div class="intake-grid">
        <label>
          Language
          <input placeholder="e.g. TypeScript" aria-label="Language input" />
        </label>
        <label>
          Tool Name
          <input placeholder="e.g. VitePress" aria-label="Tool name input" />
        </label>
        <label>
          Update Type
          <select aria-label="Update type selector">
            <option>Release</option>
            <option>Breaking Change</option>
            <option>Security Advisory</option>
            <option>Ecosystem News</option>
          </select>
        </label>
        <label class="wide">
          Source URL
          <input placeholder="https://..." aria-label="Source URL input" />
        </label>
        <label class="wide">
          Update Summary
          <textarea rows="4" placeholder="Paste the exact update context for aggregation..."></textarea>
        </label>
      </div>
      <div class="intake-actions">
        <button type="button" class="primary">Queue update (UI placeholder)</button>
        <span class="muted">Backend hook target: #update-intake-zone</span>
      </div>
    </section>

    <section class="panel feed-panel">
      <div class="panel-head">
        <h2>{activeLabel}</h2>
        <div class="controls">
          <button
            class="control"
            type="button"
            onmousedown={() => startRapid(-1)}
            onmouseup={stopRapid}
            onmouseleave={stopRapid}
            ontouchstart={() => startRapid(-1)}
            ontouchend={stopRapid}
          >
            ◀
          </button>
          <button
            class="control"
            type="button"
            onmousedown={() => startRapid(1)}
            onmouseup={stopRapid}
            onmouseleave={stopRapid}
            ontouchstart={() => startRapid(1)}
            ontouchend={stopRapid}
          >
            ▶
          </button>
        </div>
      </div>

      {#key activeCategory}
        <div class="feed-grid" use:flip={{ duration: 0.3, distance: 24, turns: 4 }}>
          {#if activeItems.length}
            {#each activeItems.slice(0, 9) as item}
              <a class="feed-item" href={item.url} target="_blank" rel="noreferrer">
                <div class="item-head">
                  <strong>{item.title}</strong>
                  <Badge>{data.sourceSummary.sourceLabels[item.source]}</Badge>
                </div>
                <p>{excerpt(item.summary)}</p>
                <div class="item-meta">
                  <span>{formatDate(item.publishedAt)}</span>
                  <span>{formatClock(item.publishedAt)}</span>
                </div>
              </a>
            {/each}
          {:else}
            <p class="empty">No updates in this language lane yet.</p>
          {/if}
        </div>
      {/key}
    </section>
  </main>
</div>

<style>
  .dashboard-page {
    min-height: 100vh;
    padding: clamp(18px, 4vw, 48px);
    background:
      radial-gradient(circle at top left, #243b91 0%, transparent 45%),
      radial-gradient(circle at 80% 10%, #6a3093 0%, transparent 40%),
      #090e1f;
    color: #eef2ff;
  }
  .dashboard-shell {
    max-width: 1180px;
    margin: 0 auto;
    display: grid;
    gap: 22px;
  }
  .hero,
  .panel {
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 22px;
    background: rgba(10, 16, 35, 0.72);
    backdrop-filter: blur(14px);
  }
  .hero {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    padding: clamp(22px, 2.5vw, 34px);
    flex-wrap: wrap;
  }
  .eyebrow {
    margin: 0 0 8px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 0.75rem;
    color: rgba(238, 242, 255, 0.65);
  }
  h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.4rem);
    letter-spacing: -0.04em;
  }
  .hero-lede {
    margin: 10px 0 0;
    max-width: 64ch;
    line-height: 1.65;
    color: rgba(238, 242, 255, 0.82);
  }
  .hero-actions {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    flex-wrap: wrap;
  }
  .panel {
    padding: clamp(18px, 2.3vw, 26px);
  }
  .panel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
  }
  h2 {
    margin: 0;
    font-size: clamp(1.15rem, 2vw, 1.6rem);
  }
  .panel-copy {
    margin: 10px 0 16px;
    color: rgba(238, 242, 255, 0.78);
    line-height: 1.55;
  }
  .intake-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  label {
    display: grid;
    gap: 8px;
    font-size: 0.88rem;
    color: rgba(238, 242, 255, 0.86);
  }
  input,
  select,
  textarea {
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    color: #f8faff;
    border-radius: 12px;
    padding: 10px 12px;
  }
  .wide {
    grid-column: 1 / -1;
  }
  .intake-actions {
    margin-top: 14px;
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }
  .primary {
    border: none;
    border-radius: 999px;
    background: linear-gradient(135deg, #7c8bff, #61d3ff);
    color: #091127;
    font-weight: 700;
    padding: 10px 16px;
    cursor: pointer;
  }
  .muted {
    color: rgba(238, 242, 255, 0.6);
    font-size: 0.85rem;
  }
  .controls {
    display: flex;
    gap: 8px;
  }
  .control {
    width: 34px;
    height: 34px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.28);
    background: rgba(255, 255, 255, 0.08);
    color: #eef2ff;
    cursor: pointer;
  }
  .feed-grid {
    margin-top: 14px;
    display: grid;
    gap: 10px;
  }
  .feed-item {
    display: grid;
    gap: 8px;
    padding: 14px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.04);
    transition: transform 160ms ease, border-color 160ms ease;
  }
  .feed-item:hover {
    transform: translateY(-2px);
    border-color: rgba(126, 212, 255, 0.65);
  }
  .item-head {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: flex-start;
  }
  .feed-item p {
    margin: 0;
    color: rgba(238, 242, 255, 0.8);
    line-height: 1.5;
  }
  .item-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: rgba(238, 242, 255, 0.65);
  }
  .empty {
    margin: 6px 0 2px;
    color: rgba(238, 242, 255, 0.75);
  }

  @media (max-width: 800px) {
    .intake-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
