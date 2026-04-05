<script lang="ts">
  export let variant: 'default' | 'secondary' | 'muted' = 'default';
  export let className = '';

  const variantClass = variant === 'secondary' || variant === 'muted' ? 'tag' : 'pill';
</script>

<span class={`${variantClass} ${className}`.trim()} {...$$restProps}>
  <slot />
</span>
