<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from '$lib/components/ui/dropdown-menu';
  import { userMenuItems } from '$lib/config/routes.js';
  import { ChevronDown } from 'lucide-svelte';

  // 用户信息
  const user = $derived(authStore.user);

  /**
   * 处理用户菜单项点击
   */
  async function handleMenuItemClick(item: (typeof userMenuItems)[0]) {
    if (item.id === 'logout') {
      await handleLogout();
    } else if (item.path) {
      if (item.target === '_blank') {
        window.open(item.path, '_blank');
      } else {
        await goto(item.path);
      }
    } else if (item.onClick) {
      item.onClick();
    }
  }

  /**
   * 处理登出
   */
  async function handleLogout() {
    try {
      await authStore.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
</script>

<DropdownMenu>
  <DropdownMenuTrigger
    class="relative inline-flex h-8 w-8 rounded-full lg:w-auto lg:px-3 lg:py-2 items-center justify-center hover:bg-accent hover:text-accent-foreground"
  >
    <div class="flex items-center space-x-2">
      <Avatar class="h-6 w-6">
        <AvatarImage src={user?.avatar} alt={user?.name} />
        <AvatarFallback class="text-xs">
          {user?.name?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <span class="hidden lg:block text-sm font-medium">
        {user?.name || '用户'}
      </span>
      <ChevronDown class="h-4 w-4 opacity-50" />
    </div>
  </DropdownMenuTrigger>
  <DropdownMenuContent class="w-56" align="end">
    <DropdownMenuLabel>
      <div class="flex flex-col space-y-1">
        <p class="text-sm font-medium leading-none">
          {user?.name || '用户'}
        </p>
        <p class="text-xs leading-none text-muted-foreground">
          {user?.email}
        </p>
      </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      {#each userMenuItems as item (item.id)}
        {#if item.divider}
          <DropdownMenuSeparator />
        {:else}
          <DropdownMenuItem class="cursor-pointer" onclick={() => handleMenuItemClick(item)}>
            <item.icon class="mr-2 h-4 w-4" />
            <span>{item.name}</span>
            {#if item.id === 'logout'}
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            {/if}
          </DropdownMenuItem>
        {/if}
      {/each}
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>

<style>
  :global(.dark) .text-muted-foreground {
    color: hsl(var(--muted-foreground));
  }
</style>
