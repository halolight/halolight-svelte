<script lang="ts">
  import { page } from '$app/stores';
  import ConfigurableDashboard from '$lib/components/dashboard/configurable-dashboard.svelte';
  import { useScrollRestore } from '$lib/keep-alive';

  // Enable scroll restoration for this page
  $effect(() => {
    const pathname = $page.url.pathname;
    useScrollRestore(pathname);
  });
</script>

<svelte:head>
  <title>仪表盘 - {import.meta.env.PUBLIC_APP_TITLE || 'Admin Pro'}</title>
  <meta name="description" content="系统仪表盘" />
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">仪表盘</h1>
      <p class="text-muted-foreground">欢迎回来！以下是您的系统概览。</p>
    </div>
  </div>

  <ConfigurableDashboard />
</div>
