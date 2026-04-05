<script lang="ts">
  type InputProps = {
    value?: string | number | undefined;
    className?: string;
    [key: string]: unknown;
  };

  let { value = $bindable(''), className = '', ...rest }: InputProps = $props();
</script>

<input bind:value={value} class={`input ${className}`.trim()} {...rest} />
