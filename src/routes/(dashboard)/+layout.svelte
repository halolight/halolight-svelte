<script lang="ts">
  import { AdminLayout, CommandMenu } from '$lib/components/layout';

  const { children } = $props();
</script>

<AdminLayout>
  {@render children()}
</AdminLayout>

<!-- 全局命令面板 (Ctrl/Cmd + K) -->
<CommandMenu />
