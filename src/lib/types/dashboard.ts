import type { BaseEntity } from './index.js';
import type { ComponentType } from 'svelte';

// 仪表盘统计项
export interface DashboardStatItem {
  total: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

// 仪表盘统计
export interface DashboardStats {
  users: DashboardStatItem;
  files: DashboardStatItem;
  messages: DashboardStatItem;
  storage: DashboardStatItem;
  // 旧版字段（保留兼容）
  totalUsers?: number;
  totalOrders?: number;
  totalRevenue?: number;
  totalProducts?: number;
  todayUsers?: number;
  todayOrders?: number;
  todayRevenue?: number;
  growthRate?: {
    users: number;
    orders: number;
    revenue: number;
  };
}

// 快捷操作
export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<any>;
  action: string;
  color: string;
}

// 最近活动
export interface RecentActivity {
  id: string;
  type: 'create' | 'update' | 'delete' | 'upload';
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  action: string;
  resource: string;
  timestamp: string;
  // 旧版字段（保留兼容）
  userId?: string;
  userName?: string;
  userAvatar?: string;
  target?: string;
  targetType?: 'user' | 'order' | 'product' | 'system';
  ip?: string;
  userAgent?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 图表数据
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

// Widget 基础类型
export interface Widget extends BaseEntity {
  type: WidgetType;
  title: string;
  description?: string;
  icon?: string;
  config: WidgetConfig;
  position: WidgetPosition;
  size: WidgetSize;
  permissions?: string[];
  visible: boolean;
  refreshInterval?: number; // 自动刷新间隔（秒）
}

// Widget 类型枚举
export type WidgetType =
  | 'stats'
  | 'chart-line'
  | 'chart-bar'
  | 'chart-pie'
  | 'recent-users'
  | 'notifications'
  | 'tasks'
  | 'calendar'
  | 'quick-actions'
  | 'custom';

// Widget 配置
export interface WidgetConfig {
  // 统计卡片配置
  statConfig?: {
    value: number | string;
    label: string;
    trend?: 'up' | 'down' | 'stable';
    trendValue?: number;
    prefix?: string;
    suffix?: string;
    color?: string;
  };

  // 图表配置
  chartConfig?: {
    type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
    data: ChartData;
    options?: any;
  };

  // 列表配置
  listConfig?: {
    items: any[];
    maxItems?: number;
    showMore?: boolean;
    moreLink?: string;
  };

  // 自定义配置
  customConfig?: Record<string, any>;
}

// Widget 位置
export interface WidgetPosition {
  x: number;
  y: number;
}

// Widget 尺寸
export interface WidgetSize {
  w: number; // 宽度（栅格数）
  h: number; // 高度（栅格数）
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

// 响应式断点
export interface BreakpointConfig {
  lg: number; // 大屏 (≥1200px)
  md: number; // 中屏 (≥996px)
  sm: number; // 小屏 (≥768px)
  xs: number; // 超小屏 (<768px)
}

// 栅格配置
export interface GridConfig {
  cols: number; // 列数
  rowHeight: number; // 行高（像素）
  margin: [number, number]; // 组件间距 [x, y]
  containerPadding: [number, number]; // 容器内边距 [x, y]
}

// 用户自定义布局
export interface UserDashboardLayout extends BaseEntity {
  userId: string;
  widgets: Widget[];
  breakpoints: BreakpointConfig;
  gridConfig: GridConfig;
  isDefault: boolean;
}

// 仪表盘通知消息（与用户关联的持久化通知）
export interface DashboardNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  // 旧版字段（保留兼容）
  userId?: string;
  content?: string;
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionText?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 任务待办
export interface Task extends BaseEntity {
  userId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completedAt?: string;
  tags?: string[];
}

// 日历事件
export interface CalendarEvent extends BaseEntity {
  userId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  location?: string;
  attendees?: string[];
  reminder?: number; // 提前提醒时间（分钟）
  color?: string;
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}
