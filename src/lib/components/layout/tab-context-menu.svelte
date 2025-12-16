<script lang="ts">
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '$lib/components/ui/dropdown-menu';
  import { navigationStore, type TabItem } from '$lib/stores/navigation.svelte';
  import { goto } from '$app/navigation';

  interface Props {
    tab: TabItem;
    children: any;
  }

  let { tab, children }: Props = $props();
  let contextMenuOpen = $state(false);

  function handleRefresh() {
    navigationStore.refreshTab(tab.id);
    // Trigger page reload
    if (tab.active) {
      window.location.reload();
    } else {
      goto(tab.path).then(() => {
        setTimeout(() => window.location.reload(), 50);
      });
    }
  }

  function handleClose() {
    if (tab.closable) {
      navigationStore.closeTab(tab.id);
      // Navigate to another tab if closing active tab
      if (tab.active && navigationStore.tabs.length > 0) {
        const remainingTab = navigationStore.tabs[0];
        if (remainingTab) {
          goto(remainingTab.path);
        }
      }
    }
  }

  function handleCloseOthers() {
    navigationStore.closeOtherTabs(tab.id);
    if (!tab.active) {
      goto(tab.path);
    }
  }

  function handleCloseRight() {
    navigationStore.closeRightTabs(tab.id);
  }

  function handleCloseAll() {
    navigationStore.closeAllTabs();
    goto('/');
  }
</script>

<DropdownMenu open={contextMenuOpen}>
  <DropdownMenuTrigger
    oncontextmenu={(e) => {
      e.preventDefault();
      contextMenuOpen = true;
    }}
  >
    {@render children()}
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onclick={handleRefresh}>刷新页面</DropdownMenuItem>
    <DropdownMenuSeparator />
    {#if tab.closable}
      <DropdownMenuItem onclick={handleClose}>关闭标签</DropdownMenuItem>
    {/if}
    <DropdownMenuItem onclick={handleCloseOthers}>关闭其他</DropdownMenuItem>
    <DropdownMenuItem onclick={handleCloseRight}>关闭右侧</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onclick={handleCloseAll}>关闭所有</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
