import { browser } from '$app/environment';

const STORAGE_KEY = 'halolight-layout';

interface LayoutState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
}

/**
 * 布局状态管理
 */
class LayoutStore {
  // 侧边栏折叠状态（桌面端）
  sidebarCollapsed = $state<boolean>(false);

  // 移动端侧边栏打开状态
  mobileSidebarOpen = $state<boolean>(false);

  // 侧边栏悬停状态（用于折叠时的临时展开）
  sidebarHovered = $state<boolean>(false);

  // 派生状态：实际的侧边栏宽度
  sidebarWidth = $derived(this.sidebarCollapsed ? 64 : 180);

  // 派生状态：侧边栏是否实际展开（考虑悬停）
  isSidebarExpanded = $derived(!this.sidebarCollapsed || this.sidebarHovered);

  constructor() {
    if (browser) {
      this.loadFromStorage();
    }
  }

  /**
   * 从本地存储加载状态
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state: LayoutState = JSON.parse(stored);
        this.sidebarCollapsed = state.sidebarCollapsed ?? false;
      }
    } catch (error) {
      console.error('加载布局状态失败:', error);
    }
  }

  /**
   * 保存状态到本地存储
   */
  private saveToStorage(): void {
    if (!browser) return;

    try {
      const state: LayoutState = {
        sidebarCollapsed: this.sidebarCollapsed,
        mobileSidebarOpen: false, // 不持久化移动端状态
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('保存布局状态失败:', error);
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
   * 打开移动端侧边栏
   */
  openMobileSidebar(): void {
    this.mobileSidebarOpen = true;
  }

  /**
   * 关闭移动端侧边栏
   */
  closeMobileSidebar(): void {
    this.mobileSidebarOpen = false;
  }

  /**
   * 设置移动端侧边栏状态
   */
  setMobileSidebarOpen(open: boolean): void {
    this.mobileSidebarOpen = open;
  }

  /**
   * 切换移动端侧边栏
   */
  toggleMobileSidebar(): void {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
  }

  /**
   * 重置布局状态
   */
  reset(): void {
    this.sidebarCollapsed = false;
    this.mobileSidebarOpen = false;
    this.sidebarHovered = false;
    this.saveToStorage();
  }
}

// 创建全局实例
export const layoutStore = new LayoutStore();
