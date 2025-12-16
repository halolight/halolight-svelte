<script lang="ts">
  import { cn, type WithElementRef } from '$lib/utils.js';
  import type { HTMLImgAttributes } from 'svelte/elements';
  import { avatarVariants } from './index.js';

  interface Props extends WithElementRef<HTMLImgAttributes, HTMLImageElement> {
    src?: string;
    alt?: string;
    class?: string;
  }

  let { src, alt, class: className, ref = $bindable(null), ...restProps }: Props = $props();

  const { image } = avatarVariants();
</script>

{#if src}
  <img bind:this={ref} {src} {alt} class={cn(image(), className)} {...restProps} />
{/if}
