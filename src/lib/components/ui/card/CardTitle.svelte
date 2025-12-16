<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    children: import('svelte').Snippet;
    class?: string;
  }

  const { children, class: className, ...rest }: Props = $props();
</script>

<h3 class={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...rest}>
  {@render children()}
</h3>
