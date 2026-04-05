<script lang="ts">
  export let value: string | number | undefined = '';
  export let className = '';
</script>

<input bind:value class={`input ${className}`.trim()} {...$$restProps} />
