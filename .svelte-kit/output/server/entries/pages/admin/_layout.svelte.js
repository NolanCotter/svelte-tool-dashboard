import { h as head, e as escape_html, s as slot, b as bind_props } from "../../../chunks/renderer.js";
import { b as base } from "../../../chunks/server.js";
import "../../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import { g as goto } from "../../../chunks/client.js";
import { a as authClient } from "../../../chunks/auth-client.js";
import { B as Button } from "../../../chunks/button.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    async function signOut() {
      await authClient.signOut();
      await goto();
    }
    head("1qg5d05", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Svelte Tool Dashboard</title>`);
      });
      $$renderer3.push(`<meta name="robots" content="noindex,nofollow"/>`);
    });
    $$renderer2.push(`<div class="page-shell" data-vaul-drawer-wrapper=""><main class="shell"><header class="topbar card"><div class="hero-copy" style="max-width: 70ch;"><div class="eyebrow">Private dashboard</div> <h1 class="panel-title" style="font-size: clamp(1.9rem, 3vw, 3.2rem);">Svelte Tool Dashboard</h1> <p class="lede" style="margin: 0; max-width: 62ch;">A minimal workspace for Svelte discovery, source aggregation, and a calm archive that keeps the interface focused.</p></div> <div class="topbar-meta"><span class="pill">${escape_html(data.user?.email ?? "signed in")}</span> <div class="topbar-actions">`);
    Button($$renderer2, {
      href: `${base}/`,
      variant: "secondary",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->Landing`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    Button($$renderer2, {
      type: "button",
      onclick: signOut,
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->Sign out`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div></header> <!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></main></div>`);
    bind_props($$props, { data });
  });
}
export {
  _layout as default
};
