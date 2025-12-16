// 基础类型定义
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface RouteMeta {
  title: string;
  icon?: string;
  permission?: string;
  hidden?: boolean;
  keepAlive?: boolean;
  breadcrumb?: boolean;
}

// 主题类型
export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeSkin =
  | 'default'
  | 'zinc'
  | 'slate'
  | 'stone'
  | 'gray'
  | 'neutral'
  | 'red'
  | 'rose'
  | 'orange'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'violet';

// 布局类型
export interface LayoutSettings {
  collapsed: boolean;
  themeMode: ThemeMode;
  themeSkin: ThemeSkin;
  showBreadcrumb: boolean;
  showTabs: boolean;
  fixedHeader: boolean;
  sidebarWidth: number;
}

// 通知消息类型（UI Toast 通知）
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  closable?: boolean;
}

// 导出所有扩展类型
export * from './auth.js';
export * from './dashboard.js';
export * from './users.js';
export * from './messages.js';
export * from './files.js';
export * from './settings.js';
