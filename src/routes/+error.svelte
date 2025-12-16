<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { Home, RefreshCw } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  // 错误信息
  const status = $derived($page.status);
  const error = $derived($page.error);

  // 错误标题和描述
  const errorInfo = $derived.by(() => {
    switch (status) {
      case 404:
        return {
          title: '页面未找到',
          description: '抱歉，您访问的页面不存在。',
          icon: '🔍',
        };
      case 403:
        return {
          title: '访问被拒绝',
          description: '抱歉，您没有权限访问此页面。',
          icon: '🔒',
        };
      case 500:
        return {
          title: '服务器错误',
          description: '抱歉，服务器遇到了问题。',
          icon: '⚠️',
        };
      default:
        return {
          title: '出错了',
          description: error?.message || '抱歉，发生了未知错误。',
          icon: '❌',
        };
    }
  });

  /**
   * 返回首页
   */
  function goHome() {
    goto('/');
  }

  /**
   * 刷新页面
   */
  function refreshPage() {
    window.location.reload();
  }
</script>

<svelte:head>
  <title>{status} - {errorInfo.title}</title>
  <meta name="description" content={errorInfo.description} />
</svelte:head>

<div
  class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8"
>
  <div class="max-w-md w-full text-center">
    <!-- 错误图标 -->
    <div
      class="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 mb-8"
    >
      <span class="text-4xl">{errorInfo.icon}</span>
    </div>

    <!-- 错误信息 -->
    <div class="space-y-4">
      <h1 class="text-6xl font-bold text-gray-900 dark:text-white">{status}</h1>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">{errorInfo.title}</h2>
      <p class="text-lg text-gray-600 dark:text-gray-400">{errorInfo.description}</p>

      {#if (error as any)?.stack && import.meta.env.DEV}
        <div class="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
          <pre class="text-sm text-gray-700 dark:text-gray-300 overflow-auto">{(error as any)
              .stack}</pre>
        </div>
      {/if}
    </div>

    <!-- 操作按钮 -->
    <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <Button onclick={goHome} variant="outline" class="w-full sm:w-auto">
        <Home class="mr-2 h-4 w-4" />
        返回首页
      </Button>
      <Button onclick={refreshPage} variant="default" class="w-full sm:w-auto">
        <RefreshCw class="mr-2 h-4 w-4" />
        刷新页面
      </Button>
    </div>

    <!-- 额外信息 -->
    <div class="mt-8 text-sm text-gray-500 dark:text-gray-400">
      <p>如果问题持续存在，请联系技术支持。</p>
      <p class="mt-2">
        错误代码: <span class="font-mono">{status}</span>
      </p>
    </div>
  </div>
</div>

<style>
  :global(html) {
    height: 100%;
  }
  :global(body) {
    min-height: 100%;
  }
</style>
