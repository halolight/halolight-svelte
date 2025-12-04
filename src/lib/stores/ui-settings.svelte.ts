import { browser } from '$app/environment';

// 皮肤预设类型
export type SkinPreset =
  | 'default'
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'violet'
  | 'rose'
  | 'teal'
  | 'slate'
  | 'ocean'
  | 'sunset'
  | 'aurora';

// UI 设置接口
export interface UISettings {
  // 侧边栏设置
  sidebarCollapsed: boolean;
  sidebarHovered: boolean;
  // 主题设置
  theme: 'light' | 'dark' | 'system';
  // 皮肤设置
  skin: SkinPreset;
  // 布局设置
  mobileMenuOpen: boolean;
  showTabBar: boolean;
  showFooter: boolean;
  mobileHeaderFixed: boolean;
  mobileTabBarFixed: boolean;
  // 通知设置
  notificationsEnabled: boolean;
  // 搜索设置
  commandMenuOpen: boolean;
}

// 默认设置
const DEFAULT_SETTINGS: UISettings = {
  sidebarCollapsed: false,
  sidebarHovered: false,
  theme: 'system',
  skin: 'default',
  mobileMenuOpen: false,
  showTabBar: true,
  showFooter: true,
  mobileHeaderFixed: true,
  mobileTabBarFixed: false,
  notificationsEnabled: true,
  commandMenuOpen: false,
};

// 存储键名
const STORAGE_KEY = 'halolight-ui-settings';

/**
 * UI 设置管理器
 */
class UISettingsStore {
  // 状态定义
  sidebarCollapsed = $state<boolean>(DEFAULT_SETTINGS.sidebarCollapsed);
  sidebarHovered = $state<boolean>(DEFAULT_SETTINGS.sidebarHovered);
  theme = $state<'light' | 'dark' | 'system'>(DEFAULT_SETTINGS.theme);
  skin = $state<SkinPreset>(DEFAULT_SETTINGS.skin);
  mobileMenuOpen = $state<boolean>(DEFAULT_SETTINGS.mobileMenuOpen);
  showTabBar = $state<boolean>(DEFAULT_SETTINGS.showTabBar);
  showFooter = $state<boolean>(DEFAULT_SETTINGS.showFooter);
  mobileHeaderFixed = $state<boolean>(DEFAULT_SETTINGS.mobileHeaderFixed);
  mobileTabBarFixed = $state<boolean>(DEFAULT_SETTINGS.mobileTabBarFixed);
  notificationsEnabled = $state<boolean>(DEFAULT_SETTINGS.notificationsEnabled);
  commandMenuOpen = $state<boolean>(DEFAULT_SETTINGS.commandMenuOpen);

  constructor() {
    // 初始化时从本地存储加载设置
    if (browser) {
      this.loadFromStorage();
      this.setupThemeListener();
    }
  }

  /**
   * 从本地存储加载设置
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const settings = JSON.parse(stored) as Partial<UISettings>;

        // 应用保存的设置
        if (typeof settings.sidebarCollapsed === 'boolean') {
          this.sidebarCollapsed = settings.sidebarCollapsed;
        }
        if (typeof settings.theme === 'string') {
          this.theme = settings.theme;
        }
        if (typeof settings.skin === 'string') {
          this.skin = settings.skin;
          this.updateSkinAttribute();
        }
        if (typeof settings.showTabBar === 'boolean') {
          this.showTabBar = settings.showTabBar;
        }
        if (typeof settings.mobileHeaderFixed === 'boolean') {
          this.mobileHeaderFixed = settings.mobileHeaderFixed;
        }
        if (typeof settings.mobileTabBarFixed === 'boolean') {
          this.mobileTabBarFixed = settings.mobileTabBarFixed;
        }
        if (typeof settings.notificationsEnabled === 'boolean') {
          this.notificationsEnabled = settings.notificationsEnabled;
        }
      }
    } catch (error) {
      console.warn('Failed to load UI settings from storage:', error);
    }
  }

  /**
   * 保存设置到本地存储
   */
  private saveToStorage(): void {
    if (!browser) return;

    try {
      const settings: UISettings = {
        sidebarCollapsed: this.sidebarCollapsed,
        sidebarHovered: this.sidebarHovered,
        theme: this.theme,
        skin: this.skin,
        mobileMenuOpen: this.mobileMenuOpen,
        showTabBar: this.showTabBar,
        showFooter: this.showFooter,
        mobileHeaderFixed: this.mobileHeaderFixed,
        mobileTabBarFixed: this.mobileTabBarFixed,
        notificationsEnabled: this.notificationsEnabled,
        commandMenuOpen: this.commandMenuOpen,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save UI settings to storage:', error);
    }
  }

  /**
   * 设置主题监听器
   */
  private setupThemeListener(): void {
    if (this.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        this.updateThemeClass();
      };

      mediaQuery.addEventListener('change', handleChange);
    }
  }

  /**
   * 更新主题 CSS 类
   */
  private updateThemeClass(): void {
    if (!browser) return;

    const root = document.documentElement;

    if (this.theme === 'dark') {
      root.classList.add('dark');
    } else if (this.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }

  /**
   * 更新皮肤 data-skin 属性
   */
  private updateSkinAttribute(): void {
    if (!browser) return;

    const root = document.documentElement;

    if (this.skin === 'default') {
      root.removeAttribute('data-skin');
    } else {
      root.setAttribute('data-skin', this.skin);
    }
  }

  /**
   * 切换侧边栏折叠状态
   */
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.saveToStorage();
  }

  /**
   * 设置侧边栏折叠状态
   */
  setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
    this.saveToStorage();
  }

  /**
   * 设置侧边栏悬停状态
   */
  setSidebarHovered(hovered: boolean): void {
    this.sidebarHovered = hovered;
  }

  /**
   * 切换移动端菜单
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  /**
   * 设置移动端菜单状态
   */
  setMobileMenuOpen(open: boolean): void {
    this.mobileMenuOpen = open;
  }

  /**
   * 切换主题
   */
  toggleTheme(): void {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(this.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.theme = themes[nextIndex];
    this.updateThemeClass();
    this.saveToStorage();
  }

  /**
   * 设置主题
   */
  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.theme = theme;
    this.updateThemeClass();
    this.saveToStorage();
  }

  /**
   * 设置皮肤
   */
  setSkin(skin: SkinPreset): void {
    this.skin = skin;
    this.updateSkinAttribute();
    this.saveToStorage();
  }

  /**
   * 切换标签栏显示
   */
  toggleTabBar(): void {
    this.showTabBar = !this.showTabBar;
    this.saveToStorage();
  }

  /**
   * 设置标签栏显示
   */
  setShowTabBar(show: boolean): void {
    this.showTabBar = show;
    this.saveToStorage();
  }

  /**
   * 设置页脚显示
   */
  setShowFooter(show: boolean): void {
    this.showFooter = show;
    this.saveToStorage();
  }

  /**
   * 切换移动端头部固定
   */
  toggleMobileHeaderFixed(): void {
    this.mobileHeaderFixed = !this.mobileHeaderFixed;
    this.saveToStorage();
  }

  /**
   * 设置移动端头部固定
   */
  setMobileHeaderFixed(fixed: boolean): void {
    this.mobileHeaderFixed = fixed;
    this.saveToStorage();
  }

  /**
   * 切换移动端标签栏固定
   */
  toggleMobileTabBarFixed(): void {
    this.mobileTabBarFixed = !this.mobileTabBarFixed;
    this.saveToStorage();
  }

  /**
   * 设置移动端标签栏固定
   */
  setMobileTabBarFixed(fixed: boolean): void {
    this.mobileTabBarFixed = fixed;
    this.saveToStorage();
  }

  /**
   * 切换通知启用状态
   */
  toggleNotifications(): void {
    this.notificationsEnabled = !this.notificationsEnabled;
    this.saveToStorage();
  }

  /**
   * 切换命令菜单
   */
  toggleCommandMenu(): void {
    this.commandMenuOpen = !this.commandMenuOpen;
  }

  /**
   * 设置命令菜单状态
   */
  setCommandMenuOpen(open: boolean): void {
    this.commandMenuOpen = open;
  }

  /**
   * 重置所有设置
   */
  resetSettings(): void {
    this.sidebarCollapsed = DEFAULT_SETTINGS.sidebarCollapsed;
    this.sidebarHovered = DEFAULT_SETTINGS.sidebarHovered;
    this.theme = DEFAULT_SETTINGS.theme;
    this.skin = DEFAULT_SETTINGS.skin;
    this.mobileMenuOpen = DEFAULT_SETTINGS.mobileMenuOpen;
    this.showTabBar = DEFAULT_SETTINGS.showTabBar;
    this.showFooter = DEFAULT_SETTINGS.showFooter;
    this.mobileHeaderFixed = DEFAULT_SETTINGS.mobileHeaderFixed;
    this.mobileTabBarFixed = DEFAULT_SETTINGS.mobileTabBarFixed;
    this.notificationsEnabled = DEFAULT_SETTINGS.notificationsEnabled;
    this.commandMenuOpen = DEFAULT_SETTINGS.commandMenuOpen;
    this.updateThemeClass();
    this.updateSkinAttribute();
    this.saveToStorage();
  }

  /**
   * 获取当前主题（解析 system）
   */
  get currentTheme(): 'light' | 'dark' {
    if (this.theme === 'system') {
      if (!browser) return 'light';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.theme;
  }

  /**
   * 获取移动端头部偏移量
   */
  get mobileHeaderOffset(): number {
    if (!this.mobileHeaderFixed) return 0;
    return 64; // 移动端头部高度
  }

  /**
   * 获取移动端标签栏偏移量
   */
  get mobileTabBarOffset(): number {
    if (!this.mobileTabBarFixed || !this.showTabBar) return 0;
    return 48; // 移动端标签栏高度
  }

  /**
   * 获取总移动端偏移量
   */
  get totalMobileOffset(): number {
    return this.mobileHeaderOffset + this.mobileTabBarOffset;
  }
}

// 创建单例实例
export const uiSettingsStore = new UISettingsStore();

// 别名导出
export const uiSettings = uiSettingsStore;
