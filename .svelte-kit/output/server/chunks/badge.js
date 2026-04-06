import { g as sanitize_props, i as rest_props, j as fallback, k as attributes, l as clsx, s as slot, b as bind_props } from "./renderer.js";
function Badge($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["variant", "className"]);
  $$renderer.component(($$renderer2) => {
    let variant = fallback($$props["variant"], "default");
    let className = fallback($$props["className"], "");
    const variantClass = variant === "secondary" || variant === "muted" ? "tag" : "pill";
    $$renderer2.push(`<span${attributes({
      class: clsx(`${variantClass} ${className}`.trim()),
      ...$$restProps
    })}><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></span>`);
    bind_props($$props, { variant, className });
  });
}
export {
  Badge as B
};
