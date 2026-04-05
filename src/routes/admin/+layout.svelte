<script lang="ts">
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { authClient } from '$lib/auth-client';

  export let data: { admin: boolean; user: { email: string } | null };

  async function signOut() {
    await authClient.signOut();
    await goto(`${base}/`);
  }
</script>

<svelte:head>
  <title>Svelte Tool Dashboard</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="page-shell" data-vaul-drawer-wrapper>
  <main class="shell">
    <header class="topbar card">
      <div class="hero-copy" style="max-width: 70ch;">
        <div class="eyebrow">Private dashboard</div>
        <h1 class="panel-title" style="font-size: clamp(1.9rem, 3vw, 3.2rem);">Svelte Tool Dashboard</h1>
        <p class="lede" style="margin: 0; max-width: 62ch;">
          A minimal workspace for Svelte discovery, source aggregation, and a calm archive that keeps the interface focused.
        </p>
      </div>

      <div class="topbar-meta">
        <span class="pill">{data.user?.email ?? 'signed in'}</span>
        <div class="topbar-actions">
          <a class="button-secondary" href={`${base}/`}>Landing</a>
          <button class="button-primary" type="button" onclick={signOut}>Sign out</button>
        </div>
      </div>
    </header>

    <slot />
  </main>
</div>
