<script lang="ts">
  import type { CardProps } from './index.js';
  import { cn } from '$lib/utils/cn.js';

  interface Props extends CardProps {
    children: import('svelte').Snippet;
  }

  const { children, class: className, ...rest }: Props = $props();
</script>

<div class={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)} {...rest}>
  {@render children()}
</div>
