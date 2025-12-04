<script lang="ts">
  import {
    Brush,
    Check,
    Monitor,
    Moon,
    Palette,
    PanelsTopLeft,
    Settings2,
    Smartphone,
    Sun,
    X,
  } from 'lucide-svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Separator } from '$lib/components/ui/separator';
  import * as Sheet from '$lib/components/ui/sheet';
  import { Switch } from '$lib/components/ui/switch';
  import { uiSettingsStore, type SkinPreset } from '$lib/stores/ui-settings.svelte.js';
  import { cn } from '$lib/utils/cn';

  // 主题选项
  const themeOptions = [
    { id: 'light' as const, label: '浅色', icon: Sun },
    { id: 'dark' as const, label: '深色', icon: Moon },
    { id: 'system' as const, label: '系统', icon: Monitor },
  ];

  // 皮肤预设
  const skinPresets: Array<{
    id: SkinPreset;
    name: string;
    description: string;
    colors: string[];
  }> = [
    {
      id: 'default',
      name: 'Shadcn · Neutral',
      description: '官方默认中性色，强调对比与易读性',
      colors: ['#0f172a', '#6366f1', '#14b8a6'],
    },
    {
      id: 'blue',
      name: 'Shadcn · Blue',
      description: '蓝色主色 + Charts 默认冷色调',
      colors: ['#1d4ed8', '#0ea5e9', '#a855f7'],
    },
    {
      id: 'emerald',
      name: 'Shadcn · Emerald',
      description: '清新绿色，适合数据和成功态',
      colors: ['#047857', '#10b981', '#22c55e'],
    },
    {
      id: 'amber',
      name: 'Shadcn · Amber',
      description: '琥珀 / 橙色主色，温暖明快',
      colors: ['#f59e0b', '#f97316', '#fb7185'],
    },
    {
      id: 'violet',
      name: 'Shadcn · Violet',
      description: '紫色高饱和，科技/创意场景',
      colors: ['#7c3aed', '#8b5cf6', '#06b6d4'],
    },
    {
      id: 'rose',
      name: 'Shadcn · Rose',
      description: '玫红主色，图表撞色更活泼',
      colors: ['#e11d48', '#f43f5e', '#fb923c'],
    },
    {
      id: 'teal',
      name: 'Shadcn · Teal',
      description: '青色主色，冷静又具现代感',
      colors: ['#0d9488', '#06b6d4', '#a855f7'],
    },
    {
      id: 'slate',
      name: 'Shadcn · Slate',
      description: '低饱和灰蓝，后台/工具感',
      colors: ['#0f172a', '#475569', '#0ea5e9'],
    },
    {
      id: 'ocean',
      name: '旧 · 深海蓝',
      description: '旧版蓝绿渐变',
      colors: ['#0ea5e9', '#2563eb', '#0ea5e9'],
    },
    {
      id: 'sunset',
      name: '旧 · 暮光橙',
      description: '旧版橙粉撞色',
      colors: ['#f97316', '#f43f5e', '#f59e0b'],
    },
    {
      id: 'aurora',
      name: '旧 · 极光绿',
      description: '旧版青绿 + 紫色',
      colors: ['#22c55e', '#10b981', '#a855f7'],
    },
  ];

  // 响应式状态
  let open = $state(false);

  const theme = $derived(uiSettingsStore.theme);
  const currentTheme = $derived(uiSettingsStore.currentTheme);
  const skin = $derived(uiSettingsStore.skin);
  const showFooter = $derived(uiSettingsStore.showFooter);
  const showTabBar = $derived(uiSettingsStore.showTabBar);
  const mobileHeaderFixed = $derived(uiSettingsStore.mobileHeaderFixed);
  const mobileTabBarFixed = $derived(uiSettingsStore.mobileTabBarFixed);

  /**
   * 使用 View Transitions API 处理主题切换动画
   */
  async function handleThemeChange(newTheme: 'light' | 'dark' | 'system') {
    const isDark = currentTheme === 'dark';

    let willBeDark = false;
    if (newTheme === 'dark') {
      willBeDark = true;
    } else if (newTheme === 'light') {
      willBeDark = false;
    } else if (newTheme === 'system') {
      willBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark === willBeDark) {
      uiSettingsStore.setTheme(newTheme);
      return;
    }

    const supportsViewTransitions =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      typeof document.startViewTransition === 'function';

    if (!supportsViewTransitions) {
      uiSettingsStore.setTheme(newTheme);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      uiSettingsStore.setTheme(newTheme);
      return;
    }

    const button = document.querySelector<HTMLButtonElement>("[aria-label='界面设置']");
    const rect = button?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const clipPathStart = `circle(0px at ${x}px ${y}px)`;
    const clipPathEnd = `circle(${maxRadius}px at ${x}px ${y}px)`;

    if (!willBeDark) {
      document.documentElement.classList.add('transitioning-to-light');
    }

    try {
      const transition = document.startViewTransition(async () => {
        uiSettingsStore.setTheme(newTheme);
        await new Promise((resolve) => requestAnimationFrame(resolve));
      });

      await transition.ready;

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
      console.warn('View transition failed:', error);
      uiSettingsStore.setTheme(newTheme);
    } finally {
      document.documentElement.classList.remove('transitioning-to-light');
    }
  }

  /**
   * 使用 View Transitions API 处理皮肤切换动画
   */
  async function handleSkinChange(nextSkin: SkinPreset) {
    if (skin === nextSkin) return;

    const supportsViewTransitions =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      typeof document.startViewTransition === 'function';

    if (!supportsViewTransitions || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      uiSettingsStore.setSkin(nextSkin);
      return;
    }

    const button = document.querySelector<HTMLButtonElement>("[aria-label='界面设置']");
    const rect = button?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const clipPathStart = `circle(0px at ${x}px ${y}px)`;
    const clipPathEnd = `circle(${maxRadius}px at ${x}px ${y}px)`;

    try {
      const transition = document.startViewTransition(async () => {
        uiSettingsStore.setSkin(nextSkin);
        await new Promise((resolve) => requestAnimationFrame(resolve));
      });
      await transition.ready;
      const animation = document.documentElement.animate(
        { clipPath: [clipPathStart, clipPathEnd] },
        {
          duration: 420,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
      await animation.finished;
    } catch (error) {
      console.warn('View transition failed:', error);
      uiSettingsStore.setSkin(nextSkin);
    }
  }

  function handleResetSettings() {
    uiSettingsStore.resetSettings();
  }
</script>

<Sheet.Root bind:open>
  <Sheet.Trigger>
    <Button variant="ghost" size="icon" class="relative shrink-0" aria-label="界面设置">
      <Settings2 class="h-5 w-5" />
      <Badge
        variant="secondary"
        class="pointer-events-none absolute right-1 top-1 h-4 px-1 text-[10px]"
      >
        UI
      </Badge>
    </Button>
  </Sheet.Trigger>
  <Sheet.Content side="right" class="w-[360px] p-0 sm:max-w-[420px]">
    <Sheet.Header class="sr-only">
      <Sheet.Title>界面设置</Sheet.Title>
      <Sheet.Description>控制主题、皮肤和界面布局</Sheet.Description>
    </Sheet.Header>
    <div class="flex h-full min-h-0 flex-col">
      <!-- 头部 -->
      <div class="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div class="flex items-center gap-2">
          <Sheet.Close>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <X class="h-4 w-4" />
              <span class="sr-only">关闭</span>
            </Button>
          </Sheet.Close>
          <div>
            <p class="text-sm font-semibold">界面设置</p>
            <p class="text-xs text-muted-foreground">主题 · 皮肤 · 布局</p>
          </div>
        </div>
      </div>

      <!-- 内容区 -->
      <ScrollArea class="min-h-0 flex-1 pr-1">
        <div class="space-y-4 p-4 pb-6">
          <!-- 主题模式 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-medium">
              <Palette class="h-4 w-4" />
              <span>主题模式</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              {#each themeOptions as option (option.id)}
                {@const isActive = theme === option.id}
                <button
                  type="button"
                  class={cn(
                    'relative flex h-auto flex-col items-start justify-center gap-1 overflow-hidden rounded-lg border border-border/70 px-2 py-2 text-left transition-all hover:border-primary/60 hover:bg-primary/5 active:scale-[0.98]',
                    isActive && 'border-primary/40 bg-primary/10 text-primary'
                  )}
                  onclick={() => handleThemeChange(option.id)}
                >
                  <option.icon class="h-4 w-4" />
                  <span class="text-xs">{option.label}</span>
                </button>
              {/each}
            </div>
          </div>

          <Separator />

          <!-- 配色皮肤 -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 text-sm font-medium">
              <Brush class="h-4 w-4" />
              <span>配色皮肤</span>
              <Badge variant="outline" class="h-5 px-1.5 text-[11px]">实时预览</Badge>
            </div>
            <div class="grid grid-cols-2 gap-2">
              {#each skinPresets as preset (preset.id)}
                {@const active = skin === preset.id}
                <button
                  type="button"
                  class={cn(
                    'group relative overflow-hidden rounded-lg border p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/5 active:scale-[0.99]',
                    active && 'border-primary bg-primary/5 ring-1 ring-primary/50'
                  )}
                  onclick={() => handleSkinChange(preset.id)}
                >
                  <div class="flex items-center justify-between text-sm font-semibold">
                    <span>{preset.name}</span>
                    {#if active}
                      <Check class="h-4 w-4 text-primary" />
                    {/if}
                  </div>
                  <p class="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {preset.description}
                  </p>
                  <div class="mt-2 flex gap-1">
                    {#each preset.colors as color, colorIndex (colorIndex)}
                      <span
                        class="h-6 w-6 rounded-md border border-border/70 transition-transform hover:scale-105"
                        style="background-color: {color}"
                      ></span>
                    {/each}
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <Separator />

          <!-- 布局元素 -->
          <div class="space-y-3 pb-8">
            <div class="flex items-center gap-2 text-sm font-medium">
              <PanelsTopLeft class="h-4 w-4" />
              <span>布局元素</span>
            </div>
            <div class="flex flex-col gap-2">
              <div
                class="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2"
              >
                <div>
                  <p class="text-sm font-medium">显示底部</p>
                  <p class="text-xs text-muted-foreground">控制页脚和快捷入口展示</p>
                </div>
                <Switch
                  checked={showFooter}
                  onCheckedChange={(checked) => uiSettingsStore.setShowFooter(checked)}
                />
              </div>
              <div
                class="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2"
              >
                <div>
                  <p class="text-sm font-medium">显示多标签</p>
                  <p class="text-xs text-muted-foreground">隐藏后不再展示顶部标签栏</p>
                </div>
                <Switch
                  checked={showTabBar}
                  onCheckedChange={(checked) => uiSettingsStore.setShowTabBar(checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <!-- 移动端行为 -->
          <div class="space-y-3 pb-8">
            <div class="flex items-center gap-2 text-sm font-medium">
              <Smartphone class="h-4 w-4" />
              <span>移动端行为</span>
            </div>
            <div class="flex flex-col gap-2">
              <div
                class="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2"
              >
                <div>
                  <p class="text-sm font-medium">固定头部</p>
                  <p class="text-xs text-muted-foreground">滚动时保持顶部栏浮动，提升快速访问</p>
                </div>
                <Switch
                  checked={mobileHeaderFixed}
                  onCheckedChange={(checked) => uiSettingsStore.setMobileHeaderFixed(checked)}
                />
              </div>
              <div
                class="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2"
              >
                <div>
                  <p class="text-sm font-medium">固定标签栏</p>
                  <p class="text-xs text-muted-foreground">页面滚动时保持多标签栏可见</p>
                </div>
                <Switch
                  checked={mobileTabBarFixed}
                  onCheckedChange={(checked) => uiSettingsStore.setMobileTabBarFixed(checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <!-- 重置按钮 -->
          <div class="space-y-2 border-t pt-4">
            <Button variant="outline" size="sm" class="w-full" onclick={handleResetSettings}>
              恢复默认配置
            </Button>
            <p class="text-center text-xs text-muted-foreground">
              重置皮肤、布局与移动端行为为初始配置
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  </Sheet.Content>
</Sheet.Root>
