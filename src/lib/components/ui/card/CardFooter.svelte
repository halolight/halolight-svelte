<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    children: import('svelte').Snippet;
    class?: string;
  }

  const { children, class: className, ...rest }: Props = $props();
</script>

<div class={cn('flex items-center p-6 pt-0', className)} {...rest}>
  {@render children()}
</div>
