<script lang="ts">
  import type { CardProps } from './index.js';
  import { cn } from '$lib/utils/cn.js';

  interface Props extends CardProps {
    children: import('svelte').Snippet;
  }

  const { children, class: className, ...rest }: Props = $props();
</script>

<div class={cn('flex flex-col space-y-1.5 p-6', className)} {...rest}>
  {@render children()}
</div>
