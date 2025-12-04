<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    children: import('svelte').Snippet;
    class?: string;
  }

  const { children, class: className, ...rest }: Props = $props();
</script>

<p class={cn('text-sm text-muted-foreground', className)} {...rest}>
  {@render children()}
</p>
