<script lang="ts">
export let variant: 'default' | 'secondary' | 'ghost' = 'default';
export let type: 'button' | 'submit' | 'reset' = 'button';
export let disabled = false;
export let href: string | undefined = undefined;
export let className = '';
export let target: string | undefined = undefined;
export let rel: string | undefined = undefined;

  const variantClass = variant === 'secondary' ? 'button-secondary' : 'button-primary';
</script>

{#if href}
  <a
    href={disabled ? undefined : href}
    target={target}
    rel={rel}
    class={`${variantClass} ${className}`.trim()}
    aria-disabled={disabled}
  >
    <slot />
  </a>
{:else}
  <button type={type} disabled={disabled} class={`${variantClass} ${className}`.trim()} {...$$restProps}>
    <slot />
  </button>
{/if}
