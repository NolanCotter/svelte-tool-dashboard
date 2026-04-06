<svelte:head>
  <title>Signals Notebook</title>
  <meta name="description" content="A clean, fast-flipping daily multi-language developer news notebook." />
</svelte:head>

<script lang="ts">
  import Badge from '$lib/components/ui/badge.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import { flip } from '$lib/actions/flip';
  import { pretext } from '$lib/actions/pretext';
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

  function excerpt(text: string, length = 160) {
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
    rapidTimer = setInterval(() => shiftCategory(step), 110);
  }

  function stopRapid() {
    if (rapidTimer) clearInterval(rapidTimer);
    rapidTimer = null;
  }

  function wheelFlip(event: WheelEvent) {
    event.preventDefault();
    shiftCategory(event.deltaY > 0 ? 1 : -1);
  }
</script>

<div class="jp-page">
  <main class="jp-shell">
    <header class="jp-hero">
      <div class="jp-copy">
        <div class="jp-kicker">letterbox typograph × pretext</div>
        <h1 class="jp-title" use:pretext={{ min: 36, max: 110, maxLines: 2 }}>Signals Notebook</h1>
        <p class="jp-lede">
          Daily Svelte, Rust, Go, Ruby, HTML/CSS, C/C++/C#, and general developer news in a clean, quiet reading space.
        </p>
      </div>
      <div class="jp-actions">
        <Button href={data.signInHref}>Open admin</Button>
        <Badge variant="secondary">{data.sourceSummary.count} cached items</Badge>
      </div>
    </header>

    <section class="jp-panel" onwheel={wheelFlip}>
      <div class="jp-panel-head">
        <div class="jp-kicker">fast page-flip board</div>
        <div class="jp-controls">
          <button
            class="jp-control"
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
            class="jp-control"
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
        <article class="jp-card" use:flip={{ duration: 0.28, distance: 26, turns: 4, immediate: true }}>
          <div class="jp-meta">
            <h2 class="jp-card-title">{activeLabel}</h2>
            <span>{activeItems.length} items</span>
          </div>

          {#if activeItems.length}
            {#each activeItems.slice(0, 8) as item}
              <a class="jp-item" href={item.url} target="_blank" rel="noreferrer">
                <strong>{item.title}</strong>
                <p>{excerpt(item.summary, 180)}</p>
                <div class="jp-item-meta">
                  <span>{data.sourceSummary.sourceLabels[item.source]}</span>
                  <span>{formatDate(item.publishedAt)} · {formatClock(item.publishedAt)}</span>
                </div>
              </a>
            {/each}
          {:else}
            <p class="jp-empty">No items in this lane yet.</p>
          {/if}
        </article>
      {/key}
    </section>
  </main>
</div>

<style>
  .jp-page {
    min-height: 100vh;
    padding: clamp(20px, 5vw, 64px);
    background: #f8f7f3;
    color: #1f1b16;
  }
  .jp-shell {
    max-width: 1080px;
    margin: 0 auto;
    display: grid;
    gap: clamp(28px, 4vw, 46px);
  }
  .jp-hero {
    display: grid;
    gap: 20px;
    border-bottom: 1px solid rgba(31, 27, 22, 0.15);
    padding-bottom: 24px;
  }
  .jp-copy {
    display: grid;
    gap: 12px;
  }
  .jp-kicker {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 0.68rem;
    opacity: 0.58;
  }
  .jp-title {
    margin: 0;
    line-height: 0.95;
    letter-spacing: -0.04em;
  }
  .jp-lede {
    margin: 0;
    max-width: 62ch;
    line-height: 1.8;
    opacity: 0.82;
  }
  .jp-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }
  .jp-panel {
    display: grid;
    gap: 18px;
    padding-top: 6px;
  }
  .jp-panel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }
  .jp-controls {
    display: flex;
    gap: 8px;
  }
  .jp-control {
    border: 1px solid rgba(31, 27, 22, 0.2);
    background: #fff;
    color: inherit;
    border-radius: 999px;
    width: 34px;
    height: 34px;
    cursor: pointer;
  }
  .jp-card {
    display: grid;
    gap: 12px;
    background: #fff;
    border: 1px solid rgba(31, 27, 22, 0.1);
    border-radius: 20px;
    padding: clamp(16px, 2.2vw, 24px);
  }
  .jp-meta {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: baseline;
  }
  .jp-card-title {
    margin: 0;
    font-size: clamp(1.1rem, 1.8vw, 1.4rem);
    letter-spacing: -0.02em;
  }
  .jp-item {
    display: grid;
    gap: 8px;
    padding: 12px 0;
    border-top: 1px solid rgba(31, 27, 22, 0.08);
  }
  .jp-item p {
    margin: 0;
    line-height: 1.65;
    opacity: 0.75;
  }
  .jp-item-meta {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    font-size: 0.78rem;
    opacity: 0.62;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .jp-empty {
    margin: 0;
    opacity: 0.62;
  }
</style>
