<script lang="ts">
  export let className = '';
</script>

<div class={`card ${className}`.trim()} {...$$restProps}>
  <slot />
</div>
