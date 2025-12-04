<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Sheet, SheetContent } from '$lib/components/ui/sheet';
  import { Toaster } from '$lib/components/ui/sonner';
  import { TooltipProvider } from '$lib/components/ui/tooltip';
  import AppFooter from './AppFooter.svelte';
  import AppHeader from './AppHeader.svelte';
  import AppSidebar from './AppSidebar.svelte';
  import TabBar from './TabBar.svelte';
  import { layoutStore } from '$lib/stores/layout.svelte.js';
  import { uiSettingsStore } from '$lib/stores/ui-settings.svelte.js';
  import { cn } from '$lib/utils/cn';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  // 响应式侧边栏宽度
  const sidebarWidth = $derived(layoutStore.sidebarCollapsed ? 64 : 180);

  // 是否显示页脚
  const showFooter = $derived(uiSettingsStore.showFooter ?? true);

  /**
   * 处理移动端侧边栏状态变化
   */
  function handleMobileSidebarChange(open: boolean) {
    layoutStore.setMobileSidebarOpen(open);
  }
</script>

<TooltipProvider>
  <div class="flex h-screen overflow-hidden bg-background">
    <!-- 桌面端侧边栏 -->
    <AppSidebar class="hidden lg:flex shrink-0" />

    <!-- 主内容区域 -->
    <div
      class={cn(
        'flex-1 flex flex-col h-screen overflow-hidden transition-[margin-left] duration-200 ease-in-out',
        'lg:ml-[var(--sidebar-width)]'
      )}
      style:--sidebar-width="{sidebarWidth}px"
    >
      <!-- 头部 -->
      <AppHeader />

      <!-- 标签栏 -->
      <TabBar />

      <!-- 页面内容 -->
      <main class="flex-1 min-h-0 overflow-auto px-4 py-5 lg:px-6 lg:py-6">
        {@render children()}
      </main>

      <!-- 页脚 -->
      {#if showFooter}
        <AppFooter />
      {/if}
    </div>

    <!-- 移动端侧边栏 Overlay -->
    <Sheet open={layoutStore.mobileSidebarOpen} onOpenChange={handleMobileSidebarChange}>
      <SheetContent
        side="left"
        class="p-0 w-[180px] max-w-[180px] bg-sidebar border-r border-border"
      >
        <AppSidebar fixed={false} forceExpanded={true} expandedWidth={180} />
      </SheetContent>
    </Sheet>
  </div>

  <!-- Toast 通知容器 -->
  <Toaster />
</TooltipProvider>

<style>
  /* 移动端隐藏侧边栏 margin */
  @media (max-width: 1023px) {
    div[style*='--sidebar-width'] {
      margin-left: 0 !important;
    }
  }
</style>
