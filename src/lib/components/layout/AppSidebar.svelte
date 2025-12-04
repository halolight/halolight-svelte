<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { ChevronDown, ChevronLeft } from 'lucide-svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import { Button } from '$lib/components/ui/button';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
  import { primaryNav, secondaryNav, type NavItem } from '$lib/config/menu';
  import { layoutStore } from '$lib/stores/layout.svelte.js';
  import { cn } from '$lib/utils/cn';

  interface Props {
    expandedWidth?: number;
    collapsedWidth?: number;
    fixed?: boolean;
    /** 强制展开模式（用于移动端 Sheet） */
    forceExpanded?: boolean;
    class?: string;
  }

  let {
    expandedWidth = 180,
    collapsedWidth = 64,
    fixed = true,
    forceExpanded = false,
    class: className,
  }: Props = $props();

  // 展开的菜单组
  let openGroups = new SvelteSet<string>();

  // 如果 forceExpanded 为 true，始终显示展开状态
  const collapsed = $derived(forceExpanded ? false : layoutStore.sidebarCollapsed);
  const activePath = $derived($page.url.pathname);
  const sidebarWidth = $derived(
    forceExpanded ? `${expandedWidth}px` : collapsed ? `${collapsedWidth}px` : `${expandedWidth}px`
  );

  const allNavItems = $derived([...primaryNav, ...secondaryNav]);

  /**
   * 判断菜单项是否激活
   */
  function isActive(item: NavItem, path: string): boolean {
    if (item.to) return path === item.to || path.startsWith(`${item.to}/`);
    return item.children?.some((child) => isActive(child, path)) ?? false;
  }

  /**
   * 切换菜单组展开状态
   */
  function toggleGroup(key: string, open?: boolean) {
    if (open === true) {
      openGroups.add(key);
    } else if (open === false) {
      openGroups.delete(key);
    } else if (openGroups.has(key)) {
      openGroups.delete(key);
    } else {
      openGroups.add(key);
    }
  }

  /**
   * 处理导航
   */
  function handleNavigate(href: string | undefined) {
    if (!href || activePath === href) return;
    goto(href);
    layoutStore.closeMobileSidebar();
  }

  /**
   * 切换侧边栏折叠状态
   */
  function toggleSidebar() {
    layoutStore.toggleSidebar();
  }
</script>

<aside
  class={cn(
    fixed ? 'fixed left-0 top-0 h-screen max-lg:hidden' : 'relative h-full',
    'z-40 border-r border-border bg-sidebar',
    'flex flex-col transition-[width] duration-200 ease-in-out',
    className
  )}
  style:width={sidebarWidth}
>
  <!-- Logo -->
  <div class="flex h-16 items-center justify-between border-b border-border px-4">
    {#if !collapsed}
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span class="text-sm font-bold text-primary-foreground">A</span>
        </div>
        <span class="font-semibold text-sidebar-foreground">Admin Pro</span>
      </div>
    {:else}
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary mx-auto">
        <span class="text-sm font-bold text-primary-foreground">A</span>
      </div>
    {/if}
  </div>

  <!-- 导航菜单 -->
  <ScrollArea class="flex-1 py-4">
    <nav class="space-y-1 px-2">
      {#each allNavItems as item (item.to || item.title)}
        {@const hasChildren = (item.children?.length ?? 0) > 0}
        {@const key = item.to ?? item.title}
        {@const active = isActive(item, activePath)}
        {@const hasActiveChild =
          item.children?.some((child) => isActive(child, activePath)) ?? false}
        {@const isOpen = openGroups.has(key) || (!collapsed && hasActiveChild)}

        <div class="space-y-1 relative">
          {#if hasChildren}
            <!-- 有子菜单的项 -->
            <button
              type="button"
              class={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70'
              )}
              onclick={() => toggleGroup(key)}
            >
              {#if item.icon}
                <item.icon class="h-5 w-5 shrink-0" />
              {/if}
              {#if !collapsed}
                <span class="truncate">{item.title}</span>
                {#if item.badge}
                  <span class="ml-auto rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {item.badge}
                  </span>
                {/if}
                <ChevronDown
                  class={cn(
                    'ml-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                    isOpen && 'rotate-180'
                  )}
                />
              {/if}
            </button>
            <!-- 子菜单 -->
            {#if !collapsed && isOpen}
              <div class="mt-1 space-y-1 border-l border-border/60 pl-2 ml-4">
                {#each item.children as child (child.to || child.title)}
                  {@const childActive = isActive(child, activePath)}
                  <button
                    type="button"
                    class={cn(
                      'relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      childActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/70'
                    )}
                    onclick={() => handleNavigate(child.to)}
                  >
                    {#if child.icon}
                      <child.icon class="h-4 w-4 shrink-0" />
                    {/if}
                    <span class="truncate">{child.title}</span>
                    {#if childActive}
                      <div class="absolute left-0 h-6 w-1 rounded-r-full bg-primary"></div>
                    {/if}
                  </button>
                {/each}
              </div>
            {/if}
          {:else if collapsed}
            <!-- 折叠状态下带 Tooltip -->
            <Tooltip>
              <TooltipTrigger
                class={cn(
                  'relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70'
                )}
                onclick={() => handleNavigate(item.to)}
              >
                {#if item.icon}
                  <item.icon class="h-5 w-5 shrink-0" />
                {/if}
                {#if active}
                  <div class="absolute left-0 h-8 w-1 rounded-r-full bg-primary"></div>
                {/if}
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                {item.title}
              </TooltipContent>
            </Tooltip>
          {:else}
            <!-- 展开状态下的链接 -->
            <button
              type="button"
              class={cn(
                'relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70'
              )}
              onclick={() => handleNavigate(item.to)}
            >
              {#if item.icon}
                <item.icon class="h-5 w-5 shrink-0" />
              {/if}
              <span class="truncate">{item.title}</span>
              {#if item.badge}
                <span class="ml-auto rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {item.badge}
                </span>
              {/if}
              {#if active}
                <div class="absolute left-0 h-8 w-1 rounded-r-full bg-primary"></div>
              {/if}
            </button>
          {/if}
        </div>
      {/each}
    </nav>
  </ScrollArea>

  <!-- 折叠按钮 - 在移动端 Sheet 中隐藏 -->
  {#if !forceExpanded}
    <div class="border-t border-border p-2">
      <Button variant="ghost" size="sm" class="w-full justify-center" onclick={toggleSidebar}>
        <ChevronLeft
          class={cn('h-4 w-4 transition-transform duration-200', collapsed && 'rotate-180')}
        />
        {#if !collapsed}
          <span class="ml-2">收起菜单</span>
        {/if}
      </Button>
    </div>
  {/if}
</aside>
