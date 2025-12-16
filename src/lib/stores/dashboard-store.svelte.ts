import { browser } from '$app/environment';

// Widget type definitions
export type WidgetType =
  | 'stats'
  | 'chart-line'
  | 'chart-bar'
  | 'chart-pie'
  | 'recent-users'
  | 'notifications'
  | 'tasks'
  | 'calendar'
  | 'quick-actions';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  config?: Record<string, unknown>;
}

export interface DashboardLayout {
  i: string; // widget id
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

// Default widgets
const defaultWidgets: DashboardWidget[] = [
  { id: 'stats-1', type: 'stats', title: '数据概览' },
  { id: 'chart-line-1', type: 'chart-line', title: '访问趋势' },
  { id: 'chart-bar-1', type: 'chart-bar', title: '销售统计' },
  { id: 'chart-pie-1', type: 'chart-pie', title: '流量占比' },
  { id: 'recent-users-1', type: 'recent-users', title: '最近用户' },
  { id: 'notifications-1', type: 'notifications', title: '最新通知' },
  { id: 'tasks-1', type: 'tasks', title: '待办任务' },
  { id: 'calendar-1', type: 'calendar', title: '今日日程' },
  { id: 'quick-actions-1', type: 'quick-actions', title: '快捷操作' },
];

// Default layouts
const defaultLayouts: DashboardLayout[] = [
  { i: 'stats-1', x: 0, y: 0, w: 12, h: 2, minW: 6, minH: 2 },
  { i: 'chart-line-1', x: 0, y: 2, w: 8, h: 4, minW: 4, minH: 3 },
  { i: 'chart-bar-1', x: 8, y: 2, w: 4, h: 4, minW: 3, minH: 3 },
  { i: 'chart-pie-1', x: 0, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
  { i: 'recent-users-1', x: 4, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
  { i: 'notifications-1', x: 8, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
  { i: 'tasks-1', x: 0, y: 10, w: 4, h: 4, minW: 3, minH: 3 },
  { i: 'calendar-1', x: 4, y: 10, w: 4, h: 4, minW: 3, minH: 3 },
  { i: 'quick-actions-1', x: 8, y: 10, w: 4, h: 4, minW: 3, minH: 3 },
];

// Storage key
const STORAGE_KEY = 'halolight-dashboard-storage';

/**
 * Dashboard state manager using Svelte 5 runes
 */
class DashboardStore {
  widgets = $state<DashboardWidget[]>(defaultWidgets);
  layouts = $state<DashboardLayout[]>(defaultLayouts);
  isEditing = $state<boolean>(false);

  constructor() {
    if (browser) {
      this.loadFromStorage();
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.widgets && Array.isArray(data.widgets)) {
          this.widgets = data.widgets;
        }
        if (data.layouts && Array.isArray(data.layouts)) {
          this.layouts = data.layouts;
        }
      }
    } catch (error) {
      console.warn('Failed to load dashboard from storage:', error);
    }
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    if (!browser) return;

    try {
      const data = {
        widgets: this.widgets,
        layouts: this.layouts,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save dashboard to storage:', error);
    }
  }

  /**
   * Set widgets
   */
  setWidgets(widgets: DashboardWidget[]): void {
    this.widgets = widgets;
    this.saveToStorage();
  }

  /**
   * Add a widget
   */
  addWidget(widget: Omit<DashboardWidget, 'id'>): void {
    const newWidget: DashboardWidget = {
      ...widget,
      id: `${widget.type}-${Date.now()}`,
    };

    // Find the maximum y value to place new widget
    const maxY = this.layouts.reduce((max, l) => Math.max(max, l.y + l.h), 0);

    const newLayout: DashboardLayout = {
      i: newWidget.id,
      x: 0,
      y: maxY,
      w: 4,
      h: widget.type === 'quick-actions' ? 4 : 3,
      minW: 3,
      minH: widget.type === 'quick-actions' ? 3 : 2,
    };

    this.widgets = [...this.widgets, newWidget];
    this.layouts = [...this.layouts, newLayout];
    this.saveToStorage();
  }

  /**
   * Remove a widget
   */
  removeWidget(id: string): void {
    this.widgets = this.widgets.filter((w) => w.id !== id);
    this.layouts = this.layouts.filter((l) => l.i !== id);
    this.saveToStorage();
  }

  /**
   * Update a widget
   */
  updateWidget(id: string, updates: Partial<DashboardWidget>): void {
    this.widgets = this.widgets.map((w) => (w.id === id ? { ...w, ...updates } : w));
    this.saveToStorage();
  }

  /**
   * Set layouts
   */
  setLayouts(layouts: DashboardLayout[]): void {
    this.layouts = layouts;
    this.saveToStorage();
  }

  /**
   * Set editing mode
   */
  setIsEditing(editing: boolean): void {
    this.isEditing = editing;
  }

  /**
   * Reset to default
   */
  resetToDefault(): void {
    this.widgets = [...defaultWidgets];
    this.layouts = [...defaultLayouts];
    this.saveToStorage();
  }
}

// Widget templates for adding new widgets
export const widgetTemplates: Array<{
  type: WidgetType;
  title: string;
  description: string;
  icon: string;
}> = [
  {
    type: 'stats',
    title: '数据统计',
    description: '显示关键业务指标',
    icon: 'BarChart3',
  },
  {
    type: 'chart-line',
    title: '折线图',
    description: '显示趋势数据',
    icon: 'LineChart',
  },
  {
    type: 'chart-bar',
    title: '柱状图',
    description: '显示对比数据',
    icon: 'BarChart',
  },
  {
    type: 'chart-pie',
    title: '饼图',
    description: '显示占比数据',
    icon: 'PieChart',
  },
  {
    type: 'recent-users',
    title: '最近用户',
    description: '显示最近注册的用户',
    icon: 'Users',
  },
  {
    type: 'notifications',
    title: '通知',
    description: '显示最新通知',
    icon: 'Bell',
  },
  {
    type: 'tasks',
    title: '待办任务',
    description: '显示待处理任务',
    icon: 'CheckSquare',
  },
  {
    type: 'calendar',
    title: '日历',
    description: '显示今日日程',
    icon: 'Calendar',
  },
  {
    type: 'quick-actions',
    title: '快捷操作',
    description: '常用功能入口',
    icon: 'Zap',
  },
];

// Create singleton instance
export const dashboardStore = new DashboardStore();
