<script lang="ts">
  import { ChevronLeft, ChevronRight, Home, X } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import TabContextMenu from './tab-context-menu.svelte';
  import { navigationStore } from '$lib/stores/navigation.svelte';
  import { uiSettingsStore } from '$lib/stores/ui-settings.svelte';
  import { cn } from '$lib/utils/cn';

  // Tab container ref for scrolling
  let tabsContainerRef = $state<HTMLDivElement | undefined>(undefined);
  let canScrollLeft = $state(false);
  let canScrollRight = $state(false);

  const showTabBar = $derived(uiSettingsStore.showTabBar);
  const tabs = $derived(navigationStore.tabs);
  const activeTabId = $derived(navigationStore.activeTabId);
  const pathname = $derived($page.url.pathname);

  // Check scroll state
  function checkScroll() {
    if (!tabsContainerRef) return;

    canScrollLeft = tabsContainerRef.scrollLeft > 0;
    canScrollRight =
      tabsContainerRef.scrollLeft < tabsContainerRef.scrollWidth - tabsContainerRef.clientWidth;
  }

  // Scroll to active tab
  function scrollToActiveTab() {
    if (!tabsContainerRef || !activeTabId) return;

    const activeTab = tabsContainerRef.querySelector(`[data-tab-id="${activeTabId}"]`);
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // Scroll left/right
  function scroll(direction: 'left' | 'right') {
    if (!tabsContainerRef) return;

    const scrollAmount = 200;
    tabsContainerRef.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }

  // Handle tab click
  function handleTabClick(tab: (typeof tabs)[0]) {
    navigationStore.setActiveTab(tab.id);
    if (pathname !== tab.path) {
      goto(tab.path);
    }
  }

  // Handle tab close
  function handleCloseTab(event: MouseEvent, tab: (typeof tabs)[0]) {
    event.stopPropagation();
    if (!tab.closable) return;

    const currentIndex = tabs.findIndex((t) => t.id === tab.id);
    navigationStore.closeTab(tab.id);

    // Navigate to adjacent tab if closing active tab
    if (tab.id === activeTabId) {
      const nextTab = tabs[currentIndex + 1] || tabs[currentIndex - 1];
      if (nextTab) {
        goto(nextTab.path);
      }
    }
  }

  // Monitor tabs and scroll on changes
  $effect(() => {
    checkScroll();
    scrollToActiveTab();
  });

  // Monitor container resize
  $effect(() => {
    if (tabsContainerRef) {
      const observer = new ResizeObserver(checkScroll);
      observer.observe(tabsContainerRef);

      tabsContainerRef.addEventListener('scroll', checkScroll);

      return () => {
        observer.disconnect();
        tabsContainerRef?.removeEventListener('scroll', checkScroll);
      };
    }
  });

  // Auto-add tab for current page
  $effect(() => {
    if (pathname) {
      const existingTab = tabs.find((t) => t.path === pathname);
      if (!existingTab) {
        // Add new tab
        const title = pathname.split('/').pop() || '新页面';
        navigationStore.addTab({
          name: title,
          path: pathname,
          closable: true,
        });
      } else {
        navigationStore.setActiveTab(existingTab.id);
      }
    }
  });
</script>

{#if showTabBar && tabs.length > 0}
  <div
    class="flex h-12 items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40"
  >
    <!-- Left scroll button -->
    {#if canScrollLeft}
      <Button variant="ghost" size="icon" class="h-8 w-8 shrink-0" onclick={() => scroll('left')}>
        <ChevronLeft class="h-4 w-4" />
      </Button>
    {/if}

    <!-- Tabs container -->
    <div
      bind:this={tabsContainerRef}
      class="flex-1 flex items-center overflow-x-auto scrollbar-hide"
    >
      {#each tabs as tab (tab.id)}
        <TabContextMenu {tab}>
          <button
            type="button"
            data-tab-id={tab.id}
            class={cn(
              'group flex items-center gap-1 px-3 py-2 border-r border-border cursor-pointer transition-colors relative min-w-[100px] max-w-[200px]',
              tab.active
                ? 'bg-background text-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            onclick={() => handleTabClick(tab)}
          >
            <!-- Active indicator -->
            {#if tab.active}
              <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            {/if}

            <!-- Icon (optional) -->
            <Home class="h-3.5 w-3.5 shrink-0" />

            <!-- Title -->
            <span class="truncate text-sm flex items-center gap-1">
              <span>{tab.name}</span>
            </span>

            <!-- Close button -->
            {#if tab.closable}
              <Button
                variant="ghost"
                size="icon"
                class={cn(
                  'h-4 w-4 p-0 transition-opacity ml-1 shrink-0 hover:bg-muted-foreground/20 rounded-sm',
                  tab.active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 sm:opacity-0'
                )}
                onclick={(e) => handleCloseTab(e, tab)}
              >
                <X class="h-3 w-3" />
              </Button>
            {/if}
          </button>
        </TabContextMenu>
      {/each}
    </div>

    <!-- Right scroll button -->
    {#if canScrollRight}
      <Button variant="ghost" size="icon" class="h-8 w-8 shrink-0" onclick={() => scroll('right')}>
        <ChevronRight class="h-4 w-4" />
      </Button>
    {/if}
  </div>
{/if}

<style>
  /* Hide scrollbar */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
