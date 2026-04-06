import { g as sanitize_props, i as rest_props, j as fallback, c as attr, m as attr_class, l as clsx, s as slot, k as attributes, b as bind_props } from "./renderer.js";
function Button($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "variant",
    "type",
    "disabled",
    "href",
    "className",
    "target",
    "rel"
  ]);
  $$renderer.component(($$renderer2) => {
    let variant = fallback($$props["variant"], "default");
    let type = fallback($$props["type"], "button");
    let disabled = fallback($$props["disabled"], false);
    let href = $$props["href"];
    let className = fallback($$props["className"], "");
    let target = $$props["target"];
    let rel = $$props["rel"];
    const variantClass = variant === "secondary" ? "button-secondary" : "button-primary";
    if (href) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<a${attr("href", disabled ? void 0 : href)}${attr("target", target)}${attr("rel", rel)}${attr_class(clsx(`${variantClass} ${className}`.trim()))}${attr("aria-disabled", disabled)}><!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]--></a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<button${attributes({
        type,
        disabled,
        class: clsx(`${variantClass} ${className}`.trim()),
        ...$$restProps
      })}><!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]--></button>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { variant, type, disabled, href, className, target, rel });
  });
}
export {
  Button as B
};
