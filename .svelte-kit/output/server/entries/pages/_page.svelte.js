import { h as head, e as escape_html, a as ensure_array_like, c as attr, b as bind_props } from "../../chunks/renderer.js";
import { B as Badge } from "../../chunks/badge.js";
import { B as Button } from "../../chunks/button.js";
import "@chenglou/pretext";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    function formatDate(value) {
      return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value));
    }
    function formatClock(value) {
      return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
    }
    function excerpt(text, length = 160) {
      const normalized = text.replace(/\s+/g, " ").trim();
      if (normalized.length <= length) return normalized;
      return `${normalized.slice(0, length).trimEnd()}…`;
    }
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Svelte Tool Dashboard</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Minimal multi-language developer signals workspace."/>`);
    });
    $$renderer2.push(`<div class="page-shell"><main class="shell landing-grid"><section class="card hero-panel landing-hero zen-hero"><div class="hero-slab"><div class="hero-copy pretext-frame" style="max-width: 64ch;"><div class="eyebrow">Japanese minimalist signal board</div> <h1 class="hero-title">Svelte Tool Dashboard</h1> <p class="lede" style="max-width: 58ch;">A calm workspace for Svelte, Rust, Go, Ruby, HTML/CSS, C/C++/C#, and general news feeds.
            Tap into the latest sources, then open the admin area when you want to review captures.</p> <div class="toolbar-row">`);
    Button($$renderer2, {
      href: data.signInHref,
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->Sign in`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Button($$renderer2, {
      href: data.signInHref,
      variant: "secondary",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->Admin login`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div> <div class="zen-stat-grid" style="max-width: 520px; width: 100%;"><article class="stat-chip zen-stat"><span class="nav-label">Sources active</span> <span class="value">${escape_html(data.sourceSummary.sourceCount)}</span> <span class="metric-detail">GitHub, Instagram, X, and YouTube lanes are wired into the dashboard.</span></article> <article class="stat-chip zen-stat"><span class="nav-label">Language lanes</span> <span class="value">${escape_html(data.sourceSummary.categoryCount)}</span> <span class="metric-detail">Category lanes ready for the daily refresh.</span></article> <article class="stat-chip zen-stat"><span class="nav-label">Tool snapshot</span> <span class="value">${escape_html(data.sourceSummary.count)}</span> <span class="metric-detail">${escape_html(data.sourceSummary.count > 0 ? "Latest signals are available below." : "No source items yet.")}</span></article> <article class="stat-chip zen-stat"><span class="nav-label">Latest update</span> `);
    if (data.sourceSummary.latest) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="value">${escape_html(formatDate(data.sourceSummary.latest.publishedAt))}</span> <span class="metric-detail">${escape_html(data.sourceSummary.latest.title)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span class="value">—</span> <span class="metric-detail">Waiting for the first feed refresh.</span>`);
    }
    $$renderer2.push(`<!--]--></article></div></div></section> <section class="card panel-card"><div class="section-kicker">Latest source</div> `);
    if (data.sourceSummary.latest) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div style="display:grid; gap: 10px; margin-top: 10px;"><h2 class="panel-title" style="margin: 0;">${escape_html(data.sourceSummary.latest.title)}</h2> <p class="subtle" style="margin: 0; max-width: 72ch;">${escape_html(excerpt(data.sourceSummary.latest.summary, 220))}</p> <div class="toolbar-row" style="margin-top: 4px;">`);
      Badge($$renderer2, {
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(data.sourceSummary.sourceLabels[data.sourceSummary.latest.source])}`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Badge($$renderer2, {
        variant: "secondary",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(data.sourceSummary.categoryLabels[data.sourceSummary.latest.category])}`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Badge($$renderer2, {
        variant: "muted",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(formatDate(data.sourceSummary.latest.publishedAt))} · ${escape_html(formatClock(data.sourceSummary.latest.publishedAt))}`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        href: data.sourceSummary.latest.url,
        variant: "secondary",
        target: "_blank",
        rel: "noreferrer",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Open source`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<p class="subtle" style="margin: 0;">No source items yet. Add feed URLs and refresh the dashboard.</p>`);
    }
    $$renderer2.push(`<!--]--></section> <section class="card panel-card"><div class="section-kicker">Category lanes</div> <div class="surface-list" style="margin-top: 12px;"><!--[-->`);
    const each_array = ensure_array_like(data.sourceSummary.categoryOrder);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let category = each_array[$$index];
      $$renderer2.push(`<article class="stat-chip"><div style="display:flex; justify-content:space-between; gap: 12px; align-items:baseline;"><strong>${escape_html(data.sourceSummary.categoryLabels[category])}</strong> <span class="caption">${escape_html(data.sourceSummary.byCategory[category].length)} items</span></div> `);
      if (data.sourceSummary.byCategory[category][0]) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="caption" style="margin: 8px 0 0;">${escape_html(data.sourceSummary.byCategory[category][0].title)} · ${escape_html(formatDate(data.sourceSummary.byCategory[category][0].publishedAt))}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<p class="caption" style="margin: 8px 0 0;">No items yet for this lane.</p>`);
      }
      $$renderer2.push(`<!--]--></article>`);
    }
    $$renderer2.push(`<!--]--></div></section> <section class="card panel-card"><div class="section-kicker">Recent items</div> <div class="surface-list" style="margin-top: 12px;">`);
    const each_array_1 = ensure_array_like(data.sourceItems.slice(0, 6));
    if (each_array_1.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let item = each_array_1[$$index_1];
        $$renderer2.push(`<article class="stat-chip"><div style="display:flex; justify-content:space-between; gap: 12px; align-items:baseline;"><strong>${escape_html(item.title)}</strong> <span class="caption">${escape_html(data.sourceSummary.sourceLabels[item.source])}</span></div> <p class="caption" style="margin: 8px 0 0;">${escape_html(excerpt(item.summary, 170))}</p> <div class="caption" style="margin-top: 8px; display:flex; gap: 8px; flex-wrap:wrap;"><span>${escape_html(data.sourceSummary.categoryLabels[item.category])}</span> <span>·</span> <span>${escape_html(formatDate(item.publishedAt))}</span> <span>·</span> <a${attr("href", item.url)} target="_blank" rel="noreferrer">Open</a></div></article>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<p class="subtle" style="margin: 0;">No recent items yet.</p>`);
    }
    $$renderer2.push(`<!--]--></div></section></main></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
