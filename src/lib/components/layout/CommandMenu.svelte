<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
  } from '$lib/components/ui/command/index.js';
  import { uiSettings } from '$lib/stores/ui-settings.svelte.js';
  import { primaryNav, secondaryNav, type NavItem } from '$lib/config/menu.js';
  import {
    Moon,
    Sun,
    Monitor,
    FileText,
    Users,
    Settings,
    LayoutDashboard,
    MessageSquare,
    Calendar,
    Shield,
    BarChart3,
    User,
    Bell,
    LogOut,
  } from 'lucide-svelte';
  import type { ComponentType, SvelteComponent } from 'svelte';

  // lucide-svelte 图标属性类型
  type IconProps = { class?: string };

  // 扁平化导航项
  function flattenNavItems(
    items: NavItem[],
    parentTitle = ''
  ): Array<NavItem & { parentTitle: string }> {
    let result: Array<NavItem & { parentTitle: string }> = [];
    for (const item of items) {
      if (item.to) {
        result.push({ ...item, parentTitle });
      }
      if (item.children) {
        result = result.concat(flattenNavItems(item.children, item.title));
      }
    }
    return result;
  }

  // 所有页面链接
  const allNavItems = flattenNavItems([...primaryNav, ...secondaryNav]);

  // 快捷操作
  interface QuickAction {
    id: string;
    title: string;
    icon: ComponentType<SvelteComponent<IconProps>>;
    action: () => void;
    keywords?: string[];
  }

  const themeActions: QuickAction[] = [
    {
      id: 'theme-light',
      title: '切换到浅色主题',
      icon: Sun,
      action: () => {
        uiSettings.setTheme('light');
        uiSettings.setCommandMenuOpen(false);
      },
      keywords: ['light', 'theme', '主题', '浅色'],
    },
    {
      id: 'theme-dark',
      title: '切换到深色主题',
      icon: Moon,
      action: () => {
        uiSettings.setTheme('dark');
        uiSettings.setCommandMenuOpen(false);
      },
      keywords: ['dark', 'theme', '主题', '深色'],
    },
    {
      id: 'theme-system',
      title: '切换到系统主题',
      icon: Monitor,
      action: () => {
        uiSettings.setTheme('system');
        uiSettings.setCommandMenuOpen(false);
      },
      keywords: ['system', 'theme', '主题', '系统'],
    },
  ];

  const accountActions: QuickAction[] = [
    {
      id: 'profile',
      title: '个人资料',
      icon: User,
      action: () => {
        goto('/settings');
        uiSettings.setCommandMenuOpen(false);
      },
      keywords: ['profile', '资料', '个人'],
    },
    {
      id: 'notifications',
      title: '通知设置',
      icon: Bell,
      action: () => {
        goto('/settings');
        uiSettings.setCommandMenuOpen(false);
      },
      keywords: ['notification', '通知', '设置'],
    },
    {
      id: 'logout',
      title: '退出登录',
      icon: LogOut,
      action: () => {
        goto('/auth/login');
        uiSettings.setCommandMenuOpen(false);
      },
      keywords: ['logout', '退出', '登出'],
    },
  ];

  // 导航到页面
  function navigateTo(path: string) {
    goto(path);
    uiSettings.setCommandMenuOpen(false);
  }

  // 获取图标
  function getIconForNav(title: string): ComponentType<SvelteComponent<IconProps>> {
    const iconMap: Record<string, ComponentType<SvelteComponent<IconProps>>> = {
      总览仪表盘: LayoutDashboard,
      用户管理: Users,
      消息中心: MessageSquare,
      文件空间: FileText,
      活动日历: Calendar,
      安全审计: Shield,
      系统设置: Settings,
      分析报告: BarChart3,
    };
    return iconMap[title] || FileText;
  }

  // 键盘快捷键监听
  function handleKeyDown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      uiSettings.toggleCommandMenu();
    }
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<CommandDialog
  bind:open={uiSettings.commandMenuOpen}
  title="命令面板"
  description="搜索页面、执行快捷操作"
>
  <CommandInput placeholder="搜索页面或操作..." />
  <CommandList>
    <CommandEmpty>未找到结果</CommandEmpty>

    <!-- 页面导航 -->
    <CommandGroup heading="页面">
      {#each allNavItems as item (item.to)}
        {@const Icon = item.icon || getIconForNav(item.title)}
        <CommandItem
          value={item.title + (item.parentTitle ? ` ${item.parentTitle}` : '')}
          onSelect={() => navigateTo(item.to!)}
        >
          <Icon class="mr-2 h-4 w-4" />
          <span>{item.title}</span>
          {#if item.parentTitle}
            <span class="ml-2 text-xs text-muted-foreground">({item.parentTitle})</span>
          {/if}
        </CommandItem>
      {/each}
    </CommandGroup>

    <CommandSeparator />

    <!-- 主题切换 -->
    <CommandGroup heading="主题">
      {#each themeActions as action (action.id)}
        {@const Icon = action.icon}
        <CommandItem value={action.title} onSelect={action.action}>
          <Icon class="mr-2 h-4 w-4" />
          <span>{action.title}</span>
        </CommandItem>
      {/each}
    </CommandGroup>

    <CommandSeparator />

    <!-- 账户操作 -->
    <CommandGroup heading="账户">
      {#each accountActions as action (action.id)}
        {@const Icon = action.icon}
        <CommandItem value={action.title} onSelect={action.action}>
          <Icon class="mr-2 h-4 w-4" />
          <span>{action.title}</span>
        </CommandItem>
      {/each}
    </CommandGroup>
  </CommandList>
</CommandDialog>
