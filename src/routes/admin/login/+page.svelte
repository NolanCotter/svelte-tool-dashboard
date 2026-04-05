<svelte:head>
  <title>Sign in | Svelte Tool Dashboard</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<script lang="ts">
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { authClient } from '$lib/auth-client';

  const returnTo = `${base}/admin`;

  let email = '';
  let password = '';
  let pending = false;
  let error = '';

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    pending = true;
    error = '';

    const normalizedEmail = email.trim().toLowerCase();

    try {
      await authClient.signIn.email({
        email: normalizedEmail,
        password,
        rememberMe: true,
        callbackURL: returnTo
      });
      await goto(returnTo);
      return;
    } catch {
      // Fall through to account bootstrap.
    }

    try {
      await authClient.signUp.email({
        name: 'Nolan Cotter',
        email: normalizedEmail,
        password,
        rememberMe: true,
        callbackURL: returnTo
      });
      await goto(returnTo);
    } catch {
      error = 'That email or password did not work.';
    } finally {
      pending = false;
    }
  }
</script>

<div class="page-shell">
  <main class="shell split-grid auth-grid" style="align-items: stretch;">
    <section class="card sign-in-card auth-hero">
      <div class="eyebrow">Protected entry</div>
      <h1 class="login-title">Sign in or recreate Nolan’s account</h1>
      <p class="login-note" style="max-width: 48ch; margin: 0;">
        Use the admin credentials to open the dashboard. If the account needs to be bootstrapped fresh, this form will sign up the user and continue into the workspace.
      </p>

      <div class="surface-list">
        <div class="surface-row" style="align-items:flex-start; background: rgba(255,255,255,0.54);">
          <div>
            <strong>Signals board access</strong>
            <p class="metric-detail">GitHub, Instagram, X, and YouTube lanes load after sign-in.</p>
          </div>
          <span class="tag">better-auth</span>
        </div>
        <div class="surface-row" style="align-items:flex-start; background: rgba(255,255,255,0.54);">
          <div>
            <strong>Daily refresh route</strong>
            <p class="metric-detail">The cron endpoint can keep the aggregation board up to date.</p>
          </div>
          <span class="tag">secure</span>
        </div>
        <div class="surface-row" style="align-items:flex-start; background: rgba(255,255,255,0.54);">
          <div>
            <strong>Minimal aesthetic</strong>
            <p class="metric-detail">Paper, ink, and motion-driven transitions keep the UI calm.</p>
          </div>
          <span class="tag">zen</span>
        </div>
      </div>
    </section>

    <form class="card login-card" onsubmit={submit}>
      <label class="surface-list" style="gap:14px; display:grid;">
        <span class="small-label">Email</span>
        <input class="input" bind:value={email} type="email" autocomplete="email" placeholder="Email address" required />
      </label>

      <label class="surface-list" style="gap:14px; display:grid; margin-top: 10px;">
        <span class="small-label">Password</span>
        <input class="input" bind:value={password} type="password" autocomplete="current-password" placeholder="Password" required />
      </label>

      {#if error}
        <p class="caption" style="color: var(--danger); margin: 0;">{error}</p>
      {/if}

      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-top: 6px; justify-content: space-between; align-items: center;">
        <a class="button-secondary" href={`${base}/`}>Back</a>
        <button class="button-primary" type="submit" disabled={pending}>
          {pending ? 'Signing in…' : 'Open workspace'}
        </button>
      </div>
    </form>
  </main>
</div>
