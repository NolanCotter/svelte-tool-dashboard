<svelte:head>
  <title>Svelte Tool Dashboard</title>
  <meta name="description" content="Minimal multi-language developer signals workspace." />
</svelte:head>

<script lang="ts">
  import { base } from '$app/paths';
  import { flip } from '$lib/actions/flip';
  import { pretext } from '$lib/actions/pretext';
  import type { PageData } from './$types';

  type ToolCategory = PageData['toolCategoryOrder'][number];
  type ToolSourceItem = PageData['sourceItems'][number];

  export let data: PageData;

  let activeCategory: ToolCategory = 'svelte';

  $: activeItems = data.sourceSummary.byCategory[activeCategory] ?? [];
  $: activeLabel = data.toolCategoryLabels[activeCategory];
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
    return data.toolSourceLabels[item.source];
  }

  type CuratedPick = {
    title: string;
    meta: string;
    source: string;
    href: string;
  };

  const curatedPicks: Record<ToolCategory, CuratedPick[]> = {
  "rust": [
    {
      "title": "rust-lang/rust",
      "meta": "GitHub · Empowering everyone to build reliable and efficient software.",
      "source": "GitHub",
      "href": "https://github.com/rust-lang/rust"
    },
    {
      "title": "Rust on X",
      "meta": "X · live search for Rust chatter, releases, and conference threads.",
      "source": "X",
      "href": "https://x.com/search?q=%23rust%20lang%3Aen&src=typed_query&f=live"
    },
    {
      "title": "Rust 2026 on YouTube",
      "meta": "YouTube · Rust 2026: $400K Salaries, Java, AI & Why It's Not Everywhere (Yet).",
      "source": "YouTube",
      "href": "https://www.youtube.com/watch?v=nOSxuaDgl3s"
    }
  ],
  "go": [
    {
      "title": "golang/go",
      "meta": "GitHub · The Go programming language.",
      "source": "GitHub",
      "href": "https://github.com/golang/go"
    },
    {
      "title": "Go on X",
      "meta": "X · live search for Go releases, tooling, and ecosystem notes.",
      "source": "X",
      "href": "https://x.com/search?q=golang%20lang%3Aen&src=typed_query&f=live"
    },
    {
      "title": "Should you learn Go in 2026?",
      "meta": "YouTube · Melkey keeps it practical and current.",
      "source": "YouTube",
      "href": "https://www.youtube.com/watch?v=xW_9zzXZWrA"
    }
  ],
  "ruby": [
    {
      "title": "rails/rails",
      "meta": "GitHub · Ruby on Rails.",
      "source": "GitHub",
      "href": "https://github.com/rails/rails"
    },
    {
      "title": "Ruby on X",
      "meta": "X · live search for Ruby on Rails and Ruby ecosystem updates.",
      "source": "X",
      "href": "https://x.com/search?q=Ruby%20on%20Rails%20lang%3Aen&src=typed_query&f=live"
    },
    {
      "title": "RubyConfTH 2026 keynote",
      "meta": "YouTube · Irina Nazarova on startups on Rails in 2026.",
      "source": "YouTube",
      "href": "https://www.youtube.com/watch?v=8Ak3NbvtS7w"
    }
  ],
  "html-css": [
    {
      "title": "tailwindlabs/tailwindcss",
      "meta": "GitHub · Utility-first CSS for rapid UI development.",
      "source": "GitHub",
      "href": "https://github.com/tailwindlabs/tailwindcss"
    },
    {
      "title": "CSS on X",
      "meta": "X · live search for CSS and frontend design signals.",
      "source": "X",
      "href": "https://x.com/search?q=CSS%20lang%3Aen&src=typed_query&f=live"
    },
    {
      "title": "10 new CSS features for 2026",
      "meta": "YouTube · Better Stack keeps the CSS lane sharp.",
      "source": "YouTube",
      "href": "https://www.youtube.com/watch?v=svqu6FDiMAs"
    }
  ],
  "cpp-csharp": [
    {
      "title": "dotnet/runtime",
      "meta": "GitHub · .NET runtime for cloud, mobile, desktop, and IoT.",
      "source": "GitHub",
      "href": "https://github.com/dotnet/runtime"
    },
    {
      "title": ".NET and C# on X",
      "meta": "X · live search for .NET, C#, and systems tooling updates.",
      "source": "X",
      "href": "https://x.com/search?q=%23dotnet%20lang%3Aen&src=typed_query&f=live"
    },
    {
      "title": "Modular Code with Examples in C#",
      "meta": "YouTube · Ian Cooper from NDC London 2026.",
      "source": "YouTube",
      "href": "https://www.youtube.com/watch?v=ayJ_WJ-8zHo"
    }
  ],
  "general-news": [
    {
      "title": "Developer news on X",
      "meta": "X · live search for current ecosystem chatter and launch threads.",
      "source": "X",
      "href": "https://x.com/search?q=developer%20news%20lang%3Aen&src=typed_query&f=live"
    },
    {
      "title": "GitHub Trending",
      "meta": "GitHub · a quiet pulse of what is moving right now.",
      "source": "GitHub",
      "href": "https://github.com/trending"
    },
    {
      "title": "The unhinged world of tech in 2026",
      "meta": "YouTube · Fireship keeps the broader news lane light and current.",
      "source": "YouTube",
      "href": "https://www.youtube.com/watch?v=EKOU3JWDNLI"
    }
  ]
};
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
            <a class="button-secondary" href={`${base}/admin/login`}>Admin login</a>
          </div>
        </div>
...