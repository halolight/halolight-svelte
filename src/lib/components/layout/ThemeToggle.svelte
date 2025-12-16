<script lang="ts">
  import { Moon, Sun, Monitor } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { uiSettingsStore } from '$lib/stores/ui-settings.svelte.js';

  const theme = $derived(uiSettingsStore.theme);
  const currentTheme = $derived(uiSettingsStore.currentTheme);

  let triggerWrapper: HTMLDivElement | null = $state(null);

  /**
   * 使用 View Transitions API 处理主题切换动画
   */
  async function handleThemeChange(newTheme: 'light' | 'dark' | 'system') {
    const isDark = currentTheme === 'dark';

    // 计算新主题是否为暗色
    let willBeDark = false;
    if (newTheme === 'dark') {
      willBeDark = true;
    } else if (newTheme === 'light') {
      willBeDark = false;
    } else if (newTheme === 'system') {
      willBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // 如果主题实际上没有变化，直接设置
    if (isDark === willBeDark) {
      uiSettingsStore.setTheme(newTheme);
      return;
    }

    // 检查是否支持 View Transitions API
    const supportsViewTransitions =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      typeof document.startViewTransition === 'function';

    if (!supportsViewTransitions) {
      uiSettingsStore.setTheme(newTheme);
      return;
    }

    // 尊重用户的减少动画偏好
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      uiSettingsStore.setTheme(newTheme);
      return;
    }

    // 查找触发按钮
    const button = triggerWrapper?.querySelector('button');
    if (!button) {
      uiSettingsStore.setTheme(newTheme);
      return;
    }

    // 计算按钮中心点位置
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // 计算最大扩散半径
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const clipPathStart = `circle(0px at ${x}px ${y}px)`;
    const clipPathEnd = `circle(${maxRadius}px at ${x}px ${y}px)`;

    // 切换到浅色时添加标记类
    if (!willBeDark) {
      document.documentElement.classList.add('transitioning-to-light');
    }

    try {
      const transition = document.startViewTransition(async () => {
        uiSettingsStore.setTheme(newTheme);
        // 等待 DOM 更新
        await new Promise((resolve) => requestAnimationFrame(resolve));
      });

      await transition.ready;

      // 执行圆形扩散动画
      const animation = document.documentElement.animate(
        {
          clipPath: willBeDark ? [clipPathStart, clipPathEnd] : [clipPathEnd, clipPathStart],
        },
        {
          duration: 400,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: willBeDark ? '::view-transition-new(root)' : '::view-transition-old(root)',
        }
      );

      await animation.finished;
    } catch (error) {
      // 如果动画失败，直接设置主题
      console.warn('View transition failed:', error);
      uiSettingsStore.setTheme(newTheme);
    } finally {
      document.documentElement.classList.remove('transitioning-to-light');
    }
  }
</script>

<div bind:this={triggerWrapper}>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <Button variant="ghost" size="icon" class="relative overflow-hidden">
        <!-- 太阳图标 -->
        <span
          class="absolute transition-all duration-200 ease-out {currentTheme === 'dark'
            ? 'scale-0 -rotate-90'
            : 'scale-100 rotate-0'}"
        >
          <Sun class="h-5 w-5" />
        </span>
        <!-- 月亮图标 -->
        <span
          class="absolute transition-all duration-200 ease-out {currentTheme === 'dark'
            ? 'scale-100 rotate-0'
            : 'scale-0 rotate-90'}"
        >
          <Moon class="h-5 w-5" />
        </span>
        <span class="sr-only">切换主题</span>
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end">
      <DropdownMenu.Item
        class="cursor-pointer {theme === 'light' ? 'bg-accent' : ''}"
        onclick={() => handleThemeChange('light')}
      >
        <Sun class="mr-2 h-4 w-4" />
        浅色
      </DropdownMenu.Item>
      <DropdownMenu.Item
        class="cursor-pointer {theme === 'dark' ? 'bg-accent' : ''}"
        onclick={() => handleThemeChange('dark')}
      >
        <Moon class="mr-2 h-4 w-4" />
        深色
      </DropdownMenu.Item>
      <DropdownMenu.Item
        class="cursor-pointer {theme === 'system' ? 'bg-accent' : ''}"
        onclick={() => handleThemeChange('system')}
      >
        <Monitor class="mr-2 h-4 w-4" />
        跟随系统
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
