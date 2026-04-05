<script lang="ts">
  export let className = '';
</script>

<input class={`input ${className}`.trim()} {...$$restProps} />
