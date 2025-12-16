<script lang="ts">
  import { cn } from '$lib/utils/cn';

  interface Props {
    class?: string;
  }

  let { class: className }: Props = $props();

  const currentYear = new Date().getFullYear();
</script>

<footer
  class={cn(
    'flex h-14 items-center justify-between border-t border-border bg-background px-4 text-sm text-muted-foreground',
    className
  )}
>
  <div class="flex items-center gap-4">
    <span>&copy; {currentYear} Halolight. 保留所有权利。</span>
  </div>
  <div class="flex items-center gap-4">
    <a
      href="https://halolight.docs.h7ml.cn"
      target="_blank"
      rel="noopener noreferrer"
      class="hover:text-foreground transition-colors"
    >
      在线文档
    </a>
    <a href="/privacy" class="hover:text-foreground transition-colors">隐私政策</a>
    <a href="/terms" class="hover:text-foreground transition-colors">服务条款</a>
    <a
      href="https://github.com/halolight/halolight-svelte"
      target="_blank"
      rel="noopener noreferrer"
      class="hover:text-foreground transition-colors"
    >
      GitHub
    </a>
  </div>
</footer>
