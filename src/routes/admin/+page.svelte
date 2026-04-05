<svelte:head>
  <title>Svelte Tool Dashboard</title>
</svelte:head>

<script lang="ts">
  import { tick } from 'svelte';
  import { Drawer } from 'vaul-svelte';
  import { flip } from '$lib/actions/flip';
  import { pretext } from '$lib/actions/pretext';
  import { toolCategoryLabels, toolCategoryOrder, toolSourceLabels, type ToolCategory, type ToolSourceItem, type ToolSourceName } from '$lib/server/tool-sources';

  type RecordItem = {
    id: string;
    createdAt: string;
    dayLabel: string;
    timeLabel: string;
    label: string;
    note: string;
    imageDataUrl: string;
    observation: {
      upperArchVisible: boolean;
      lowerArchVisible: boolean;
      confidence: number;
      visibleBrackets: number;
    };
    metrics: {
      score: number;
      visibility: number;
      confidence: number;
      visibleBrackets: number;
      status: 'needs-review' | 'steady' | 'strong-signal';
    };
    analysisText: string;
  };

  export let data: {
    records: RecordItem[];
    summary: {
      count: number;
      averageScore: number;
      status: 'needs-review' | 'steady' | 'strong-signal';
      latest: unknown;
    };
    series: Array<{
      label: string;
      score: number;
      confidence: number;
      brackets: number;
      visibility: number;
      status: 'needs-review' | 'steady' | 'strong-signal';
    }>;
    latest: RecordItem | null;
    sourceItems: ToolSourceItem[];
    sourceSummary: {
      count: number;
      latest: ToolSourceItem | null;
      bySource: Record<ToolSourceName, ToolSourceItem[]>;
      byCategory: Record<ToolCategory, ToolSourceItem[]>;
      sourceCount: number;
      categoryCount: number;
      categoryOrder: ToolCategory[];
    };
  };

  export let form: { error?: string } | undefined;

  const chartWidth = 780;
  const chartHeight = 240;
  const chartPadding = 26;
  let cameraOpen = false;
  let settingsOpen = false;
  let openingCamera = false;
  let stream: MediaStream | null = null;
  let videoElement: HTMLVideoElement | null = null;
  let canvasElement: HTMLCanvasElement | null = null;
  let capturedImage = '';
  let mimeType = 'image/jpeg';
  let note = '';
  let cameraError = '';
  let uploadError = '';
  let captureBusy = false;
  let activeCategory: ToolCategory = 'svelte';

  $: hasRecords = data.summary.count > 0;
  $: activeItems = data.sourceSummary.byCategory[activeCategory] ?? [];
  $: activeCategoryLabel = toolCategoryLabels[activeCategory];
  $: activeCategoryCount = activeItems.length;

  function scalePoints(values: number[], maxValue = 100, minValue = 0) {
    if (!values.length) {
      return '';
    }

    if (values.length === 1) {
      const singleX = chartPadding + (chartWidth - chartPadding * 2) / 2;
      const singleY =
        chartHeight -
        chartPadding -
        ((values[0] - minValue) / (maxValue - minValue || 1)) * (chartHeight - chartPadding * 2);
      return `${singleX},${singleY}`;
    }

    return values
      .map((value, index) => {
        const x = chartPadding + (index * (chartWidth - chartPadding * 2)) / (values.length - 1);
        const y =
          chartHeight -
          chartPadding -
          ((value - minValue) / (maxValue - minValue || 1)) * (chartHeight - chartPadding * 2);
        return `${x},${y}`;
      })
      .join(' ');
  }

  function statusLabel(status: string) {
    return status.replace(/-/g, ' ');
  }

  function percent(value: number) {
    return `${Math.round(value)}%`;
  }

  function excerpt(text: string, length = 150) {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (normalized.length <= length) return normalized;
    return `${normalized.slice(0, length).trimEnd()}…`;
  }

  function sourceTypeLabel(item: ToolSourceItem) {
    return item.kind.toUpperCase();
  }

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

  function openCategory(category: ToolCategory) {
    activeCategory = category;
  }

  $: scorePoints = scalePoints(data.series.map((entry) => entry.score));
  $: confidencePoints = scalePoints(data.series.map((entry) => entry.confidence));

  async function startCamera() {
    if (stream || openingCamera) return;
    openingCamera = true;
    cameraError = '';

    try {
      await tick();

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access is not available on this device.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment'
        },
        audio: false
      });

      stream = mediaStream;

      if (videoElement) {
        videoElement.srcObject = mediaStream;
        await videoElement.play();
      }
    } catch (error) {
      cameraError = error instanceof Error ? error.message : 'Camera access failed.';
    } finally {
      openingCamera = false;
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    stream = null;

    if (videoElement) {
      videoElement.srcObject = null;
    }
  }

  $: if (cameraOpen) {
    void startCamera();
  } else {
    stopCamera();
    capturedImage = '';
    mimeType = 'image/jpeg';
    cameraError = '';
    uploadError = '';
    note = '';
  }

  async function captureFrame() {
    if (!videoElement || !canvasElement) {
      return;
    }

    captureBusy = true;
    uploadError = '';

    try {
      const width = videoElement.videoWidth || 1280;
      const height = videoElement.videoHeight || 720;
      const context = canvasElement.getContext('2d');

      if (!context) {
        throw new Error('Could not initialize the capture canvas.');
      }

      canvasElement.width = width;
      canvasElement.height = height;
      context.drawImage(videoElement, 0, 0, width, height);
      capturedImage = canvasElement.toDataURL('image/jpeg', 0.92);
      mimeType = 'image/jpeg';
    } catch (error) {
      uploadError = error instanceof Error ? error.message : 'Capture failed.';
    } finally {
      captureBusy = false;
    }
  }

  async function handleFileUpload(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    uploadError = '';
    mimeType = file.type || 'image/jpeg';

    const reader = new FileReader();
    reader.onload = () => {
      capturedImage = String(reader.result ?? '');
    };
    reader.onerror = () => {
      uploadError = 'Could not read the uploaded file.';
    };
    reader.readAsDataURL(file);
  }
</script>

<div class="dashboard-grid zen-grid">
  {#if form?.error}
    <div class="card" style="border: 1px solid rgba(155, 73, 66, 0.34); color: var(--danger);">{form.error}</div>
  {/if}

  <header class="hero-panel card zen-hero">
    <div class="hero-slab">
      <div class="hero-copy pretext-frame" style="max-width: 68ch;">
        <div class="eyebrow">Japanese minimalist signal board</div>
        <h1 class="hero-title" use:pretext={{ min: 34, max: 84 }}>Svelte Tool Dashboard</h1>
        <p class="lede" style="max-width: 60ch;">
          A Japanese-minimal dashboard for discovering Svelte, Rust, Go, Ruby, HTML/CSS, C/C++/C#, and general news signals from GitHub, X, Instagram, and YouTube, with a calm layout and fast page-flip transitions.
        </p>
        <div class="toolbar-row">
          <span class="pill">Whitespace-first layout</span>
          <span class="pill">motion.dev transitions</span>
          <span class="pill">pretext sizing</span>
          <span class="pill">daily source refresh</span>
        </div>
      </div>

      <div class="zen-stat-grid" style="max-width: 520px; width: 100%;">
        <article class="stat-chip zen-stat">
          <span class="nav-label">Sources active</span>
          <span class="value">{data.sourceSummary.sourceCount || 4}</span>
          <span class="metric-detail">GitHub, Instagram, X, and YouTube lanes are wired into the dashboard.</span>
        </article>
        <article class="stat-chip zen-stat">
          <span class="nav-label">Language lanes</span>
          <span class="value">{data.sourceSummary.categoryCount || 0}</span>
          <span class="metric-detail">Language lanes ready for the daily refresh.</span>
        </article>
        <article class="stat-chip zen-stat">
          <span class="nav-label">Tool snapshot</span>
          <span class="value">{hasRecords ? Math.round(data.summary.averageScore) : '—'}</span>
          <span class="metric-detail">Existing analysis timeline still loads beneath the new source board.</span>
        </article>
        <article class="stat-chip zen-stat">
          <span class="nav-label">Refresh cadence</span>
          <span class="value">Daily</span>
          <span class="metric-detail">Automated refresh runs every day through the Vercel cron route.</span>
        </article>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-card">
        <span class="nav-label">Latest source</span>
        {#if data.sourceSummary.latest}
          <strong>{data.sourceSummary.latest.title}</strong>
          <div class="metric-detail">{toolSourceLabels[data.sourceSummary.latest.source]} · {toolCategoryLabels[data.sourceSummary.latest.category ?? 'general-news']} · {formatDate(data.sourceSummary.latest.publishedAt)}</div>
        {:else}
          <strong>No source items yet</strong>
          <div class="metric-detail">Add category-specific feed URLs to the refresh route and the dashboard will populate automatically.</div>
        {/if}
      </div>
      <div class="meta-card">
        <span class="nav-label">Workspace status</span>
        {#if hasRecords}
          <strong>Existing timeline preserved</strong>
          <div class="metric-detail">The old analysis archive remains available below the source board.</div>
        {:else}
          <strong>Empty archive</strong>
          <div class="metric-detail">No captured entries are stored yet.</div>
        {/if}
      </div>
    </div>
  </header>

  <section class="card content-card zen-panel">
    <div style="display:flex; justify-content:space-between; gap: 16px; align-items:flex-start; flex-wrap: wrap;">
      <div>
        <div class="section-kicker">Live aggregation</div>
        <h2 class="panel-title" style="margin-top: 8px;">Language board</h2>
        <p class="subtle" style="max-width: 58ch; margin: 10px 0 0;">
          Each language lane stays visually quiet, but the selected board flips quickly when you move between categories.
        </p>
      </div>
      <div class="source-rail">
        {#each toolCategoryOrder as category}
          <button class={`source-tab ${activeCategory === category ? 'is-active' : ''}`} type="button" onclick={() => openCategory(category)}>
            {toolCategoryLabels[category]} · {data.sourceSummary.byCategory[category].length}
          </button>
        {/each}
      </div>
    </div>

    {#key activeCategory}
      <article class="source-card card" use:flip>
        <div class="source-card__header">
          <div>
            <div class="eyebrow">{activeCategoryLabel}</div>
            <h3 class="panel-title" style="margin-top: 8px;" use:pretext={{ min: 24, max: 42 }}>{activeCategoryLabel} feed</h3>
            <p class="subtle" style="margin: 8px 0 0; max-width: 46ch;">
              {activeCategoryCount ? `${activeCategoryCount} items are currently cached for this lane.` : 'No items have been cached for this lane yet.'}
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
                      <span class="source-badge">{sourceTypeLabel(item)}</span>
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
              The refresh route is wired, and the lane will populate once the category-specific source URLs are configured.
            </p>
          </div>
        {/if}
      </article>
    {/key}
  </section>

  <section class="grid-two">
    <article class="card content-card chart-card">
      <div style="display:flex; justify-content:space-between; gap: 16px; align-items:flex-start;">
        <div>
          <div class="section-kicker">Archive signal</div>
          <h2 class="panel-title" style="margin-top: 8px;">Timeline pulse</h2>
          <p class="subtle" style="max-width: 54ch; margin: 10px 0 0;">
            The legacy analysis archive still renders beneath the source board, keeping the app’s existing history intact.
          </p>
        </div>
        <div class="toolbar-row" style="justify-content:flex-end;">
          <button class="button-secondary" type="button" onclick={() => (settingsOpen = true)}>Settings</button>
          <button class="button-primary" type="button" onclick={() => (cameraOpen = true)}>Take photo</button>
        </div>
      </div>

      {#if data.series.length}
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} class="chart-frame" role="img" aria-label="Archive timeline chart">
          <defs>
            <linearGradient id="score-line" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stop-color="#2f3b31" />
              <stop offset="100%" stop-color="#6f806f" />
            </linearGradient>
          </defs>
          <polyline points={scorePoints} fill="none" stroke="url(#score-line)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          <polyline points={confidencePoints} fill="none" stroke="rgba(23,20,17,0.2)" stroke-width="3" stroke-dasharray="5 8" stroke-linecap="round" stroke-linejoin="round" />
          {#each data.series as entry, index}
            <circle
              cx={chartPadding + (index * (chartWidth - chartPadding * 2)) / (data.series.length - 1 || 1)}
              cy={chartHeight - chartPadding - ((entry.score - 0) / 100) * (chartHeight - chartPadding * 2)}
              r="4.5"
              fill="#fff"
              stroke="#2f3b31"
              stroke-width="2"
            />
          {/each}
        </svg>

        <div class="surface-list" style={`grid-template-columns: repeat(${Math.min(data.series.length, 4)}, minmax(0, 1fr)); display:grid; gap: 12px;`}>
          {#each data.series.slice(-4) as entry}
            <div class="surface-row" style="display:grid; gap:6px; align-items:start; background: rgba(255,255,255,0.5);">
              <div style="display:flex; justify-content:space-between; gap:12px; align-items:baseline;">
                <strong>{entry.label}</strong>
                <span class="tag">{statusLabel(entry.status)}</span>
              </div>
              <div class="metric-detail">Score {entry.score} · Confidence {entry.confidence}% · {entry.brackets} brackets</div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="empty-state" style="margin-top: 12px;">
          <div class="eyebrow">Empty history</div>
          <h1>No photos yet</h1>
          <p class="lede">The legacy archive stays quiet until a real frame is captured.</p>
          <div class="toolbar-row">
            <button class="button-primary" type="button" onclick={() => (cameraOpen = true)}>Take first photo</button>
            <label class="button-secondary" style="position:relative; overflow:hidden;">
              Upload photo
              <input class="input" type="file" accept="image/*" capture="environment" style="position:absolute; inset:0; opacity:0; cursor:pointer;" onchange={handleFileUpload} />
            </label>
          </div>
        </div>
      {/if}

      {#if data.latest}
        <div class="surface-row pulse-line" style="align-items:flex-start; gap: 14px; background: rgba(255,255,255,0.5);">
          <img src={data.latest.imageDataUrl} alt={data.latest.label} style="width: 118px; height: 118px; object-fit: cover; border-radius: 22px; border: 1px solid rgba(35,31,27,0.1);" />
          <div style="flex: 1; display:grid; gap: 10px;">
            <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
              <div class="history-title">
                <strong>{data.latest.label}</strong>
                <p class="metric-detail">{data.latest.dayLabel} · {data.latest.timeLabel}</p>
              </div>
              <span class="tag">{statusLabel(data.latest.metrics.status)}</span>
            </div>
            <div class="metric-detail">
              Visibility {percent(data.latest.metrics.visibility * 100)} · Confidence {percent(data.latest.metrics.confidence * 100)} · {data.latest.metrics.visibleBrackets} brackets
            </div>
            <div class="caption">{excerpt(data.latest.analysisText, 180)}</div>
          </div>
        </div>
      {/if}
    </article>

    <article class="card content-card">
      <div class="section-kicker">Recent captures</div>
      <h2 class="panel-title" style="margin-top: 8px;">Archive list</h2>
      <p class="subtle" style="max-width: 48ch; margin-top: 10px;">
        The existing record history remains in place while the new source board handles discovery.
      </p>

      <div class="history-grid" style="margin-top: 18px;">
        {#if data.records.length}
          {#each data.records as record}
            <div class="history-row" style="background: rgba(255,255,255,0.5);">
              <img src={record.imageDataUrl} alt={record.label} />
              <div class="history-copy">
                <div class="history-head">
                  <div class="history-title">
                    <strong>{record.label}</strong>
                    <p class="metric-detail">{record.dayLabel} · {record.timeLabel}</p>
                  </div>
                  <span class="tag">{statusLabel(record.metrics.status)}</span>
                </div>
                <div class="metric-detail">
                  Visibility {percent(record.metrics.visibility * 100)} · Confidence {percent(record.metrics.confidence * 100)} · {record.metrics.visibleBrackets} brackets
                </div>
                <div class="caption">{excerpt(record.analysisText, 170)}</div>
                {#if record.note}
                  <div class="surface-row" style="padding: 12px 14px; border-radius: 18px; background: rgba(255,255,255,0.54);">
                    <span class="nav-label">Note</span>
                    <span class="body-copy">{record.note}</span>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        {:else}
          <div class="surface-row" style="justify-content:flex-start; background: rgba(255,255,255,0.54);">No photos have been saved yet.</div>
        {/if}
      </div>
    </article>
  </section>

  <Drawer.Root bind:open={cameraOpen} direction="bottom" shouldScaleBackground>
    <Drawer.Portal>
      <Drawer.Overlay class="drawer-overlay" />
      <Drawer.Content class="drawer-content">
        <div class="drawer-handle"></div>
        <form class="drawer-panel card" method="post" action="?/capture">
          <div style="display:flex; justify-content:space-between; gap:16px; align-items:flex-start;">
            <div>
              <div class="section-kicker">Capture</div>
              <h2 class="panel-title" style="margin-top: 8px;">Take a frame</h2>
              <p class="subtle" style="max-width: 48ch; margin-top: 10px;">Use the camera, capture a frame, and save it with Gemini analysis.</p>
            </div>
            <Drawer.Close class="button-secondary" type="button">Close</Drawer.Close>
          </div>

          <div class="split-grid" style="align-items: start; margin-top: 18px;">
            <div style="display:grid; gap: 12px;">
              <video bind:this={videoElement} autoplay playsinline muted class="camera-preview"></video>
              <canvas bind:this={canvasElement} hidden></canvas>
              {#if cameraError}
                <p class="caption" style="color: var(--danger); margin: 0;">{cameraError}</p>
              {/if}
              {#if uploadError}
                <p class="caption" style="color: var(--danger); margin: 0;">{uploadError}</p>
              {/if}
              <div style="display:flex; flex-wrap:wrap; gap:12px;">
                <button class="button-primary" type="button" disabled={captureBusy} onclick={captureFrame}>
                  {captureBusy ? 'Capturing…' : 'Capture frame'}
                </button>
                <label class="button-secondary" style="position:relative; overflow:hidden;">
                  Upload instead
                  <input class="input" type="file" accept="image/*" capture="environment" style="position:absolute; inset:0; opacity:0; cursor:pointer;" onchange={handleFileUpload} />
                </label>
              </div>
            </div>

            <div style="display:grid; gap: 12px;">
              {#if capturedImage}
                <img src={capturedImage} alt="Captured preview" class="captured-preview" />
              {:else}
                <div class="captured-preview empty-preview">
                  <span class="eyebrow">No frame yet</span>
                  <p class="subtle" style="margin: 10px 0 0;">Capture a frame or upload a photo to continue.</p>
                </div>
              {/if}

              <label class="surface-list" style="gap:14px; display:grid; margin-top: 6px;">
                <span class="small-label">Note</span>
                <input class="input" bind:value={note} placeholder="Optional label like after lunch or evening check-in" />
              </label>

              <input type="hidden" name="imageDataUrl" value={capturedImage} />
              <input type="hidden" name="mimeType" value={mimeType} />

              <button class="button-primary" type="submit" disabled={!capturedImage}>
                Save photo and analyze
              </button>
            </div>
          </div>
        </form>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>

  <Drawer.Root bind:open={settingsOpen} direction="right" shouldScaleBackground>
    <Drawer.Portal>
      <Drawer.Overlay class="drawer-overlay" />
      <Drawer.Content class="drawer-shell-right">
        <section class="card drawer-panel-right">
          <div style="display:flex; justify-content:space-between; gap:16px; align-items:flex-start;">
            <div>
              <div class="section-kicker">Settings</div>
              <h2 class="panel-title" style="margin-top: 8px;">Workspace controls</h2>
              <p class="subtle" style="max-width: 34ch; margin-top: 10px;">Capture defaults, privacy signals, and the current dashboard state.</p>
            </div>
            <Drawer.Close class="button-secondary" type="button">Close</Drawer.Close>
          </div>

          <div class="meta-grid">
            <div class="meta-card">
              <span class="nav-label">Capture mode</span>
              <strong>Rear camera</strong>
              <div class="metric-detail">Optimized for close-up progress photos.</div>
            </div>
            <div class="meta-card">
              <span class="nav-label">Analysis flow</span>
              <strong>Gemini review</strong>
              <div class="metric-detail">Records are stored after each analysis pass.</div>
            </div>
          </div>

          <div class="surface-list">
            <div class="surface-row" style="background: rgba(255,255,255,0.54);">
              <div>
                <strong>Account</strong>
                <p class="metric-detail">Private admin dashboard</p>
              </div>
              <span class="tag">secure</span>
            </div>
            <div class="surface-row" style="background: rgba(255,255,255,0.54);">
              <div>
                <strong>Typography</strong>
                <p class="metric-detail">Inter with Japanese sans support</p>
              </div>
              <span class="tag">locked in</span>
            </div>
            <div class="surface-row" style="background: rgba(255,255,255,0.54);">
              <div>
                <strong>Theme</strong>
                <p class="metric-detail">Paper, ink, and quiet green accents</p>
              </div>
              <span class="tag">zen</span>
            </div>
          </div>

          <div class="surface-row" style="align-items:flex-start; background: rgba(255,255,255,0.54);">
            <div>
              <strong>Latest capture</strong>
              {#if data.latest}
                <p class="metric-detail" style="margin-top: 6px;">{data.latest.dayLabel} · {data.latest.timeLabel}</p>
                <p class="caption" style="margin: 8px 0 0;">{excerpt(data.latest.analysisText, 120)}</p>
              {:else}
                <p class="metric-detail" style="margin-top: 6px;">No capture is stored yet.</p>
              {/if}
            </div>
          </div>

          <div class="toolbar-row" style="justify-content:space-between; margin-top: auto;">
            <button class="button-secondary" type="button" onclick={() => (cameraOpen = true)}>Open camera</button>
            <span class="pill">Admin dashboard</span>
          </div>
        </section>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
</div>
