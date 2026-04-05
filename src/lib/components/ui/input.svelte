<script lang="ts">
  let { value = $bindable(''), className = '', ...rest } = $props<{
    value?: string | number | undefined;
    className?: string;
  }>();
</script>

<input bind:value={value} class={`input ${className}`.trim()} {...rest} />
