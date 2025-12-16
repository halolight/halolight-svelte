<script lang="ts">
  import { cn, type WithElementRef } from '$lib/utils.js';
  import type { HTMLAttributes } from 'svelte/elements';
  import { avatarVariants } from './index.js';

  interface Props extends WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children?: import('svelte').Snippet;
    class?: string;
  }

  let { children, class: className, ref = $bindable(null), ...restProps }: Props = $props();

  const { fallback } = avatarVariants();
</script>

<div bind:this={ref} class={cn(fallback(), className)} {...restProps}>
  {@render children?.()}
</div>
