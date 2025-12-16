<script lang="ts">
  import { cn, type WithElementRef } from '$lib/utils.js';
  import type { HTMLAttributes } from 'svelte/elements';
  import { avatarVariants, type AvatarVariants } from './index.js';

  interface Props
    extends WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, AvatarVariants {
    children?: import('svelte').Snippet;
    class?: string;
  }

  let {
    children,
    size = 'default',
    class: className,
    ref = $bindable(null),
    ...restProps
  }: Props = $props();

  const { root } = avatarVariants({ size });
</script>

<div bind:this={ref} class={cn(root(), className)} {...restProps}>
  {@render children?.()}
</div>
