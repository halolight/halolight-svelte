<script lang="ts">
  import type { InputProps } from './index.js';
  import { cn } from '$lib/utils/cn.js';

  interface Props extends InputProps {
    value?: string;
    oninput?: (event: Event) => void;
    onchange?: (event: Event) => void;
    onblur?: (event: Event) => void;
    onfocus?: (event: Event) => void;
  }

  let {
    type = 'text',
    id,
    name,
    value = $bindable(''),
    placeholder,
    disabled = false,
    readonly = false,
    required = false,
    autocomplete,
    maxlength,
    minlength,
    pattern,
    class: className,
    oninput,
    onchange,
    onblur,
    onfocus,
    ...rest
  }: Props = $props();

  const inputClass = cn(
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    className
  );
</script>

<input
  {type}
  {id}
  {name}
  bind:value
  {placeholder}
  {disabled}
  {readonly}
  {required}
  autocomplete={autocomplete as any}
  {maxlength}
  {minlength}
  {pattern}
  class={inputClass}
  {oninput}
  {onchange}
  {onblur}
  {onfocus}
  {...rest}
/>
