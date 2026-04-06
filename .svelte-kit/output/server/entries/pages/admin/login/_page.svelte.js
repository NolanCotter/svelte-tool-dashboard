import { g as sanitize_props, i as rest_props, j as fallback, k as attributes, l as clsx, s as slot, b as bind_props, h as head, e as escape_html } from "../../../../chunks/renderer.js";
import { b as base } from "../../../../chunks/server.js";
import "../../../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/utils.js";
import "../../../../chunks/exports.js";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/auth-client.js";
import { B as Button } from "../../../../chunks/button.js";
function Card($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["className"]);
  $$renderer.component(($$renderer2) => {
    let className = fallback($$props["className"], "");
    $$renderer2.push(`<div${attributes({ class: clsx(`card ${className}`.trim()), ...$$restProps })}><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { className });
  });
}
function Input($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = "", className = "", $$slots, $$events, ...rest } = $$props;
    $$renderer2.push(`<input${attributes({ value, class: clsx(`input ${className}`.trim()), ...rest }, void 0, void 0, void 0, 4)}/>`);
    bind_props($$props, { value });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let email = "";
    let password = "";
    let pending = false;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("18c6u1m", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Sign in | Svelte Tool Dashboard</title>`);
        });
        $$renderer4.push(`<meta name="robots" content="noindex,nofollow"/>`);
      });
      $$renderer3.push(`<div class="page-shell"><main class="shell split-grid auth-grid" style="align-items: stretch;">`);
      Card($$renderer3, {
        className: "sign-in-card auth-hero",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="eyebrow">Protected entry</div> <h1 class="login-title">Sign in or recreate Nolan’s account</h1> <p class="login-note" style="max-width: 48ch; margin: 0;">Use the admin credentials to open the dashboard. If the account needs to be bootstrapped fresh, this form will sign up the user and continue into the workspace.</p> <div class="surface-list"><div class="surface-row" style="align-items:flex-start; background: rgba(255,255,255,0.54);"><div><strong>Signals board access</strong> <p class="metric-detail">GitHub, Instagram, X, and YouTube lanes load after sign-in.</p></div> <span class="tag">better-auth</span></div> <div class="surface-row" style="align-items:flex-start; background: rgba(255,255,255,0.54);"><div><strong>Daily refresh route</strong> <p class="metric-detail">The cron endpoint can keep the aggregation board up to date.</p></div> <span class="tag">secure</span></div> <div class="surface-row" style="align-items:flex-start; background: rgba(255,255,255,0.54);"><div><strong>Minimal aesthetic</strong> <p class="metric-detail">Paper, ink, and motion-driven transitions keep the UI calm.</p></div> <span class="tag">zen</span></div></div>`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> <form class="card login-card"><label class="surface-list" style="gap:14px; display:grid;"><span class="small-label">Email</span> `);
      Input($$renderer3, {
        type: "email",
        autocomplete: "email",
        placeholder: "Email address",
        required: true,
        get value() {
          return email;
        },
        set value($$value) {
          email = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></label> <label class="surface-list" style="gap:14px; display:grid; margin-top: 10px;"><span class="small-label">Password</span> `);
      Input($$renderer3, {
        type: "password",
        autocomplete: "current-password",
        placeholder: "Password",
        required: true,
        get value() {
          return password;
        },
        set value($$value) {
          password = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></label> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div style="display:flex; flex-wrap:wrap; gap:12px; margin-top: 6px; justify-content: space-between; align-items: center;">`);
      Button($$renderer3, {
        href: `${base}/`,
        variant: "secondary",
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->Back`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Button($$renderer3, {
        type: "submit",
        disabled: pending,
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->${escape_html("Open workspace")}`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div></form></main></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
