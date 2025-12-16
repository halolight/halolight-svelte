import type { BaseEntity, PaginatedResponse } from './index.js';

/**
 * 用户状态类型
 */
export type UserStatus = 'active' | 'inactive' | 'banned';

/**
 * 用户列表查询参数
 */
export interface UserListQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: UserStatus;
  department?: string;
  roleId?: string;
  sortBy?: 'createdAt' | 'lastLoginAt' | 'username';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 用户详情（扩展）
 */
export interface UserDetail extends BaseEntity {
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  nickname: string;
  status: UserStatus;
  department?: string;
  position?: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  loginCount: number;
  roleIds: string[];
  roleName?: string;
  permissions: string[];
  bio?: string;
  gender?: 'male' | 'female' | 'other';
  birthday?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

/**
 * 用户统计信息
 */
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
  newToday: number;
  newThisWeek: number;
  newThisMonth: number;
  onlineNow: number;
}

/**
 * 用户活动日志
 */
export interface UserActivityLog extends BaseEntity {
  userId: string;
  username: string;
  action: string;
  actionType: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view' | 'export';
  resource?: string;
  resourceType?: string;
  ip: string;
  userAgent: string;
  location?: string;
  status: 'success' | 'failed';
  errorMessage?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

/**
 * 用户列表响应
 */
export type UserListResponse = PaginatedResponse<UserDetail>;

/**
 * 批量操作参数
 */
export interface BatchUserOperation {
  userIds: string[];
  action: 'activate' | 'deactivate' | 'ban' | 'unban' | 'delete' | 'assignRole';
  roleId?: string;
  reason?: string;
}

/**
 * 用户导出参数
 */
export interface UserExportQuery extends UserListQuery {
  format: 'csv' | 'excel' | 'json';
  fields?: string[];
}
