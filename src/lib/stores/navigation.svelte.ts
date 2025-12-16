import { browser } from '$app/environment';
import { page } from '$app/stores';

// 导航状态接口
export interface NavigationState {
  isLoading: boolean;
  currentPath: string;
  breadcrumb: Array<{
    name: string;
    path: string;
  }>;
  history: string[];
}

// 标签页接口
export interface TabItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  closable: boolean;
  active: boolean;
  timestamp: number;
}

/**
 * 导航状态管理器
 */
class NavigationStore {
  // 状态定义
  isLoading = $state<boolean>(false);
  currentPath = $state<string>('');
  breadcrumb = $state<Array<{ name: string; path: string }>>([]);
  history = $state<string[]>([]);
  tabs = $state<TabItem[]>([]);
  activeTabId = $state<string>('');

  // 最大历史记录数
  private readonly MAX_HISTORY = 50;
  // 最大标签页数
  private readonly MAX_TABS = 20;

  constructor() {
    // 初始化时从页面 store 获取当前路径
    if (browser) {
      this.initializeFromPage();
    }
  }

  /**
   * 从页面 store 初始化
   */
  private initializeFromPage(): void {
    // 订阅页面变化
    page.subscribe(($page) => {
      if ($page?.url?.pathname) {
        this.setCurrentPath($page.url.pathname);
      }
    });
  }

  /**
   * 设置当前路径
   */
  setCurrentPath(path: string): void {
    this.currentPath = path;
    this.addToHistory(path);
  }

  /**
   * 添加到历史记录
   */
  private addToHistory(path: string): void {
    // 避免重复添加相同路径
    if (this.history[this.history.length - 1] === path) {
      return;
    }

    this.history.push(path);

    // 限制历史记录数量
    if (this.history.length > this.MAX_HISTORY) {
      this.history = this.history.slice(-this.MAX_HISTORY);
    }
  }

  /**
   * 设置面包屑
   */
  setBreadcrumb(breadcrumb: Array<{ name: string; path: string }>): void {
    this.breadcrumb = breadcrumb;
  }

  /**
   * 开始加载
   */
  startLoading(): void {
    this.isLoading = true;
  }

  /**
   * 结束加载
   */
  endLoading(): void {
    this.isLoading = false;
  }

  /**
   * 添加标签页
   */
  addTab(tab: Omit<TabItem, 'id' | 'timestamp' | 'active'>): void {
    // 检查是否已存在
    const existingTab = this.tabs.find((t) => t.path === tab.path);
    if (existingTab) {
      this.setActiveTab(existingTab.id);
      return;
    }

    // 限制标签页数量
    if (this.tabs.length >= this.MAX_TABS) {
      // 关闭最早的非活动标签页
      const oldestTab = this.tabs
        .filter((t) => t.closable && !t.active)
        .sort((a, b) => a.timestamp - b.timestamp)[0];

      if (oldestTab) {
        this.closeTab(oldestTab.id);
      } else {
        // 如果没有可关闭的标签页，不添加新标签页
        return;
      }
    }

    const newTab: TabItem = {
      ...tab,
      id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      active: false,
    };

    this.tabs.push(newTab);
    this.setActiveTab(newTab.id);
  }

  /**
   * 关闭标签页
   */
  closeTab(tabId: string): void {
    const tabIndex = this.tabs.findIndex((t) => t.id === tabId);
    if (tabIndex === -1) return;

    const tab = this.tabs[tabIndex];
    if (!tab.closable) return;

    // 如果关闭的是活动标签页，激活相邻的标签页
    if (tab.active) {
      const remainingTabs = this.tabs.filter((t) => t.id !== tabId);
      if (remainingTabs.length > 0) {
        // 优先激活右侧的标签页，如果没有则激活左侧的
        const newActiveTab = remainingTabs[tabIndex] || remainingTabs[remainingTabs.length - 1];
        this.setActiveTab(newActiveTab.id);
      } else {
        this.activeTabId = '';
      }
    }

    this.tabs = this.tabs.filter((t) => t.id !== tabId);
  }

  /**
   * 设置活动标签页
   */
  setActiveTab(tabId: string): void {
    this.tabs = this.tabs.map((tab) => ({
      ...tab,
      active: tab.id === tabId,
    }));
    this.activeTabId = tabId;
  }

  /**
   * 关闭所有标签页
   */
  closeAllTabs(): void {
    this.tabs = [];
    this.activeTabId = '';
  }

  /**
   * 关闭其他标签页
   */
  closeOtherTabs(tabId: string): void {
    this.tabs = this.tabs.filter((t) => t.id === tabId || !t.closable);
    this.setActiveTab(tabId);
  }

  /**
   * 关闭左侧标签页
   */
  closeLeftTabs(tabId: string): void {
    const tabIndex = this.tabs.findIndex((t) => t.id === tabId);
    if (tabIndex === -1) return;

    this.tabs = this.tabs.filter((t, index) => index >= tabIndex || !t.closable);
    this.setActiveTab(tabId);
  }

  /**
   * 关闭右侧标签页
   */
  closeRightTabs(tabId: string): void {
    const tabIndex = this.tabs.findIndex((t) => t.id === tabId);
    if (tabIndex === -1) return;

    this.tabs = this.tabs.filter((t, index) => index <= tabIndex || !t.closable);
    this.setActiveTab(tabId);
  }

  /**
   * 刷新标签页
   */
  refreshTab(tabId: string): void {
    const tab = this.tabs.find((t) => t.id === tabId);
    if (tab) {
      // 更新时间戳以触发刷新
      tab.timestamp = Date.now();
    }
  }

  /**
   * 重新排序标签页
   */
  reorderTabs(fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) return;

    const tabs = [...this.tabs];
    const [movedTab] = tabs.splice(fromIndex, 1);
    tabs.splice(toIndex, 0, movedTab);

    this.tabs = tabs;
  }

  /**
   * 获取活动标签页
   */
  get activeTab(): TabItem | null {
    return this.tabs.find((t) => t.active) || null;
  }

  /**
   * 获取可关闭的标签页
   */
  get closableTabs(): TabItem[] {
    return this.tabs.filter((t) => t.closable);
  }

  /**
   * 获取标签页数量
   */
  get tabCount(): number {
    return this.tabs.length;
  }

  /**
   * 是否可以后退
   */
  get canGoBack(): boolean {
    return this.history.length > 1;
  }

  /**
   * 是否可以前进
   */
  get canGoForward(): boolean {
    // 简单实现，实际应该维护一个更复杂的历史栈
    return false;
  }

  /**
   * 后退
   */
  goBack(): void {
    if (this.canGoBack) {
      // 移除当前路径
      this.history.pop();
      // 获取上一个路径
      const previousPath = this.history[this.history.length - 1];
      if (previousPath) {
        // 这里应该使用 SvelteKit 的 goto 函数
        // 暂时使用 window.location
        if (browser) {
          window.location.href = previousPath;
        }
      }
    }
  }

  /**
   * 清空历史记录
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * 重置导航状态
   */
  reset(): void {
    this.isLoading = false;
    this.currentPath = '';
    this.breadcrumb = [];
    this.tabs = [];
    this.activeTabId = '';
    // 保留历史记录，不清空
  }
}

// 创建单例实例
export const navigationStore = new NavigationStore();
