<script lang="ts">
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';

  // 支持 PUBLIC_GA_ID 环境变量
  const GA_ID = env.PUBLIC_GA_ID;

  /**
   * Google Analytics 组件
   * 通过环境变量 PUBLIC_GA_ID 控制，大陆部署可留空禁用
   */
  onMount(() => {
    if (!GA_ID) return;

    // 动态加载 gtag.js
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // 初始化 gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', GA_ID);

    return () => {
      // 清理脚本（可选，通常不需要）
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  });
</script>

<!-- 扩展 Window 类型以包含 dataLayer -->
<svelte:head>
  <script>
    // 确保 dataLayer 初始化
    window.dataLayer = window.dataLayer || [];
  </script>
</svelte:head>
