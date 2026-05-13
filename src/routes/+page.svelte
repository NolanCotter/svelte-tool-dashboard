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
  $: latestItem = data.sourceSummary.latest;
  $: briefingDate = formatDate(new Date().toISOString());

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
        <p class="eyebrow">Automated language intelligence desk</p>
        <h1>ToolPulse Daily Briefing</h1>
        <p class="hero-lede">
          A newsroom-style pulse of launches, releases, and ecosystem movement across language lanes, refreshed by
          your AI agent.
        </p>
      </div>

      <div class="hero-actions">
        <Badge variant="secondary">Today’s Briefing · {briefingDate}</Badge>
        <Badge>{data.sourceSummary.count} total updates indexed</Badge>
        {#if latestItem}
          <p class="latest">
            Latest filed: <strong>{data.sourceSummary.sourceLabels[latestItem.source]}</strong> at
            {formatClock(latestItem.publishedAt)}
          </p>
        {/if}
        <Button href={data.signInHref}>Open Admin Workspace</Button>
      </div>
    </header>

    <section class="panel intake-panel" id="update-intake-zone">
      <div class="panel-head">
        <div>
          <p class="panel-kicker">Newsroom Control Desk</p>
          <h2>File a language update</h2>
        </div>
        <Badge>Agent Intake</Badge>
      </div>
      <p class="panel-copy">
        Queue verified language updates for the next automated briefing cycle. Keep entries concise, source-backed,
        and publication-ready.
      </p>

      <div class="intake-grid">
        <label>
          Language lane
          <input placeholder="e.g. TypeScript" aria-label="Language input" />
        </label>
        <label>
          Tool / project
          <input placeholder="e.g. VitePress" aria-label="Tool name input" />
        </label>
        <label>
          Update class
          <select aria-label="Update type selector">
            <option>Release</option>
            <option>Breaking Change</option>
            <option>Security Advisory</option>
            <option>Ecosystem News</option>
          </select>
        </label>
        <label>
          Source link
          <input placeholder="https://..." aria-label="Source URL input" />
        </label>
        <label class="wide">
          Briefing note
          <textarea rows="4" placeholder="Paste the exact update context for aggregation..."></textarea>
        </label>
      </div>
      <div class="intake-actions">
        <button type="button" class="primary">Publish to queue (UI placeholder)</button>
        <span class="muted">Backend hook target: #update-intake-zone</span>
      </div>
    </section>

    <section class="panel feed-panel" aria-live="polite">
      <div class="panel-head">
        <div>
          <p class="panel-kicker">Live language lane</p>
          <h2>{activeLabel}</h2>
        </div>
        <div class="controls" aria-label="Browse language lanes">
          <button
            class="control"
            type="button"
            aria-label="Previous lane"
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
            aria-label="Next lane"
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
            {#each activeItems.slice(0, 9) as item, index}
              <a class="feed-item" href={item.url} target="_blank" rel="noreferrer">
                <div class="item-head">
                  <strong>{item.title}</strong>
                  <Badge>{data.sourceSummary.sourceLabels[item.source]}</Badge>
                </div>
                <p>{excerpt(item.summary)}</p>
                <div class="item-meta">
                  <span>Filed {formatDate(item.publishedAt)} · {formatClock(item.publishedAt)}</span>
                  {#if index === 0}
                    <span class="status-pill">Latest</span>
                  {:else}
                    <span class="status-pill queued">Queued</span>
                  {/if}
                </div>
              </a>
            {/each}
          {:else}
            <p class="empty">No updates filed for this lane yet.</p>
          {/if}
        </div>
      {/key}
    </section>
  </main>
</div>

<style>
  .dashboard-page {
    min-height: 100vh;
    padding: clamp(16px, 4vw, 48px);
    background:
      radial-gradient(circle at top left, rgba(51, 88, 211, 0.5) 0%, transparent 42%),
      radial-gradient(circle at 84% 8%, rgba(120, 46, 187, 0.45) 0%, transparent 40%),
      #070c1b;
    color: #eef2ff;
  }
  .dashboard-shell {
    max-width: 1180px;
    margin: 0 auto;
    display: grid;
    gap: 18px;
  }
  .hero,
  .panel {
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 22px;
    background: linear-gradient(180deg, rgba(16, 24, 49, 0.84), rgba(9, 14, 32, 0.8));
    backdrop-filter: blur(16px);
    box-shadow: 0 24px 70px rgba(6, 10, 24, 0.45);
  }
  .hero {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    padding: clamp(20px, 2.5vw, 34px);
    flex-wrap: wrap;
  }
  .eyebrow,
  .panel-kicker {
    margin: 0 0 8px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(179, 194, 255, 0.76);
  }
  h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.3rem);
    letter-spacing: -0.04em;
  }
  .hero-lede {
    margin: 10px 0 0;
    max-width: 65ch;
    line-height: 1.65;
    color: rgba(238, 242, 255, 0.85);
  }
  .hero-actions {
    display: grid;
    gap: 10px;
    align-content: start;
    justify-items: start;
  }
  .latest {
    margin: 0;
    font-size: 0.88rem;
    color: rgba(219, 228, 255, 0.85);
  }
  .panel {
    padding: clamp(16px, 2.3vw, 24px);
  }
  .panel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
  }
  h2 {
    margin: 0;
    font-size: clamp(1.2rem, 2vw, 1.7rem);
  }
  .panel-copy {
    margin: 10px 0 16px;
    color: rgba(231, 238, 255, 0.78);
    line-height: 1.6;
  }
  .intake-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  label {
    display: grid;
    gap: 8px;
    font-size: 0.9rem;
    color: rgba(236, 242, 255, 0.9);
  }
  input,
  select,
  textarea {
    border: 1px solid rgba(168, 183, 255, 0.3);
    background: rgba(255, 255, 255, 0.06);
    color: #f8faff;
    border-radius: 12px;
    padding: 11px 12px;
    font-size: 0.94rem;
    transition: border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease;
  }
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible,
  .control:focus-visible,
  .primary:focus-visible,
  .feed-item:focus-visible {
    outline: none;
    border-color: #80b8ff;
    box-shadow: 0 0 0 3px rgba(108, 171, 255, 0.25);
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
    border: 1px solid rgba(168, 213, 255, 0.8);
    border-radius: 999px;
    background: linear-gradient(135deg, #7286ff, #4bcaff 60%, #90ebff);
    color: #091127;
    font-weight: 800;
    letter-spacing: 0.01em;
    padding: 11px 18px;
    cursor: pointer;
    transition: transform 160ms ease, box-shadow 160ms ease;
  }
  .primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 22px rgba(86, 179, 255, 0.35);
  }
  .muted {
    color: rgba(238, 242, 255, 0.62);
    font-size: 0.83rem;
  }
  .controls {
    display: flex;
    gap: 8px;
  }
  .control {
    width: 38px;
    height: 38px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.24);
    background: rgba(255, 255, 255, 0.08);
    color: #eef2ff;
    cursor: pointer;
    transition: background-color 120ms ease, transform 120ms ease;
  }
  .control:hover {
    background: rgba(138, 188, 255, 0.24);
    transform: translateY(-1px);
  }
  .feed-grid {
    margin-top: 14px;
    display: grid;
    gap: 10px;
  }
  .feed-item {
    display: grid;
    gap: 9px;
    padding: 15px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03));
    transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
    text-decoration: none;
    color: inherit;
  }
  .feed-item:hover {
    transform: translateY(-2px);
    border-color: rgba(126, 212, 255, 0.7);
    box-shadow: 0 12px 24px rgba(8, 16, 36, 0.38);
  }
  .item-head {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: flex-start;
  }
  .feed-item p {
    margin: 0;
    color: rgba(238, 242, 255, 0.82);
    line-height: 1.5;
  }
  .item-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    font-size: 0.8rem;
    color: rgba(238, 242, 255, 0.7);
  }
  .status-pill {
    border-radius: 999px;
    padding: 2px 9px;
    background: rgba(117, 210, 255, 0.24);
    color: #bcf0ff;
    font-weight: 600;
  }
  .queued {
    background: rgba(158, 169, 255, 0.18);
    color: #d1d9ff;
  }
  .empty {
    margin: 6px 0 2px;
    color: rgba(238, 242, 255, 0.75);
    border: 1px dashed rgba(172, 186, 255, 0.5);
    border-radius: 12px;
    padding: 14px;
    background: rgba(255, 255, 255, 0.03);
  }

  @media (max-width: 800px) {
    .dashboard-shell {
      gap: 14px;
    }
    .intake-grid {
      grid-template-columns: 1fr;
    }
    .panel-head {
      align-items: flex-start;
      flex-wrap: wrap;
    }
  }
</style>
