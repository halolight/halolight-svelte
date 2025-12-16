<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { startMockServiceWorker } from '$lib/mocks/browser.js';
  import { uiSettingsStore } from '$lib/stores/ui-settings.svelte.js';
  import GoogleAnalytics from '$lib/components/google-analytics.svelte';

  const { children } = $props();

  // 初始化主题
  function initTheme() {
    const theme = uiSettingsStore.theme;
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system - 跟随系统
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }

  // 启动 Mock Service Worker 并初始化主题
  onMount(async () => {
    if (import.meta.env.DEV) {
      await startMockServiceWorker();
    }
    initTheme();
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<GoogleAnalytics />

{@render children()}
