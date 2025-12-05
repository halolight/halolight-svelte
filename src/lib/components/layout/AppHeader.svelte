<script lang="ts">
  import { goto } from '$app/navigation';
  import { Bell, HelpCircle, LogOut, Menu, Search, Settings, User } from 'lucide-svelte';
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '$lib/components/ui/dropdown-menu';
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { layoutStore } from '$lib/stores/layout.svelte.js';
  import { uiSettingsStore } from '$lib/stores/ui-settings.svelte.js';
  import { cn } from '$lib/utils/cn';
  import ThemeToggle from './ThemeToggle.svelte';
  import QuickSettings from './QuickSettings.svelte';

  interface Props {
    onMenuClick?: () => void;
    onSearchClick?: () => void;
    class?: string;
  }

  let { onMenuClick, onSearchClick, class: className }: Props = $props();

  const mobileHeaderFixed = $derived(uiSettingsStore.mobileHeaderFixed);

  /**
   * 处理菜单按钮点击
   */
  function handleMenuClick() {
    if (onMenuClick) {
      onMenuClick();
    } else {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      if (isMobile) {
        layoutStore.openMobileSidebar();
      } else {
        layoutStore.toggleSidebar();
      }
    }
  }

  /**
   * 处理搜索按钮点击
   */
  function handleSearchClick() {
    if (onSearchClick) {
      onSearchClick();
    } else {
      uiSettingsStore.toggleCommandMenu();
    }
  }

  /**
   * 处理导航
   */
  function handleNavigate(href: string) {
    goto(href);
  }

  /**
   * 处理登出
   */
  async function handleLogout() {
    await authStore.logout();
  }

  // 获取用户首字母
  const userInitials = $derived(
    authStore.user?.name?.slice(0, 2) || authStore.user?.email?.slice(0, 2).toUpperCase() || 'AD'
  );
</script>

<header
  class={cn(
    'z-50 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60',
    'lg:sticky lg:top-0',
    mobileHeaderFixed ? 'fixed inset-x-0 top-0' : 'relative',
    className
  )}
>
  <div class="flex items-center gap-4">
    <Button variant="ghost" size="icon" class="lg:hidden" onclick={handleMenuClick}>
      <Menu class="h-5 w-5" />
    </Button>

    <!-- 搜索栏（桌面端） -->
    <Button
      variant="outline"
      class="hidden w-64 justify-start text-muted-foreground sm:flex"
      onclick={handleSearchClick}
    >
      <Search class="mr-2 h-4 w-4" />
      <span>搜索...</span>
      <kbd
        class="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
      >
        <span class="text-xs">⌘</span>K
      </kbd>
    </Button>
  </div>

  <div class="flex items-center gap-2">
    <!-- 搜索按钮（移动端） -->
    <Button variant="ghost" size="icon" class="sm:hidden" onclick={handleSearchClick}>
      <Search class="h-5 w-5" />
    </Button>

    <!-- 主题切换 -->
    <ThemeToggle />

    <!-- 界面设置 -->
    <QuickSettings />

    <!-- 通知 -->
    <DropdownMenu>
      <DropdownMenuTrigger
        class="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
      >
        <Bell class="h-5 w-5" />
        <Badge
          class="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
        >
          3
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-80">
        <DropdownMenuLabel class="flex items-center justify-between">
          <span>通知</span>
          <button
            type="button"
            class="text-xs font-normal text-primary hover:underline"
            onclick={() => handleNavigate('/notifications')}
          >
            查看全部
          </button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          class="flex flex-col items-start gap-1 cursor-pointer"
          onclick={() => handleNavigate('/notifications')}
        >
          <p class="font-medium">新用户注册</p>
          <p class="text-xs text-muted-foreground">用户 张三 刚刚完成注册</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex flex-col items-start gap-1 cursor-pointer"
          onclick={() => handleNavigate('/notifications')}
        >
          <p class="font-medium">系统更新</p>
          <p class="text-xs text-muted-foreground">系统将于今晚 23:00 进行维护</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex flex-col items-start gap-1 cursor-pointer"
          onclick={() => handleNavigate('/notifications')}
        >
          <p class="font-medium">任务完成</p>
          <p class="text-xs text-muted-foreground">数据备份任务已完成</p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          class="w-full text-center text-sm text-muted-foreground hover:text-foreground cursor-pointer justify-center"
          onclick={() => handleNavigate('/notifications')}
        >
          查看所有通知
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- 用户菜单 -->
    <DropdownMenu>
      <DropdownMenuTrigger class="relative h-9 w-9 rounded-full">
        <Avatar class="h-9 w-9">
          <AvatarImage src="/avatar.png" alt="用户头像" />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-56">
        <DropdownMenuLabel class="font-normal">
          <div class="flex flex-col space-y-1">
            <p class="text-sm font-medium">{authStore.user?.name || '管理员'}</p>
            <p class="text-xs text-muted-foreground">
              {authStore.user?.email || 'admin@halolight.h7ml.cn'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem class="cursor-pointer" onclick={() => handleNavigate('/profile')}>
            <User class="mr-2 h-4 w-4" />
            个人资料
          </DropdownMenuItem>
          <DropdownMenuItem class="cursor-pointer" onclick={() => handleNavigate('/settings')}>
            <Settings class="mr-2 h-4 w-4" />
            账户设置
          </DropdownMenuItem>
          <DropdownMenuItem class="cursor-pointer" onclick={() => handleNavigate('/docs')}>
            <HelpCircle class="mr-2 h-4 w-4" />
            帮助文档
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="text-destructive cursor-pointer" onclick={handleLogout}>
          <LogOut class="mr-2 h-4 w-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</header>
