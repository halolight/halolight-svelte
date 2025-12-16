import type { BaseEntity } from './index.js';

// 用户基础信息
export interface User extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  department?: string;
  position?: string;
  lastLoginAt?: string;
}

// 角色信息
export interface Role extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  status: 'active' | 'inactive';
  permissions: Permission[];
}

// 权限信息
export interface Permission extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  resource: string;
  action: string;
  type: 'menu' | 'button' | 'api';
  parentId?: string;
  sort: number;
  icon?: string;
  path?: string;
  method?: string;
}

// 登录请求
export interface LoginDto {
  email: string;
  password: string;
  remember?: boolean;
}

// 登录请求别名（统一命名）
export type LoginRequest = LoginDto;

// 注册请求
export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// 注册请求别名（统一命名）
export type RegisterRequest = RegisterDto;

// 登录响应
export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
  refreshToken?: string;
  permissions?: string[];
  roles?: Role[];
}

// 刷新令牌请求
export interface RefreshTokenDto {
  refreshToken: string;
}

// 忘记密码请求
export interface ForgotPasswordDto {
  email: string;
  captcha?: string;
  captchaId?: string;
}

// 重置密码请求
export interface ResetPasswordDto {
  token: string;
  password: string;
  confirmPassword: string;
}

// 修改密码请求
export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 更新用户信息
export interface UpdateUserDto {
  name?: string;
  phone?: string;
  avatar?: string;
  department?: string;
  position?: string;
}

// 创建用户请求
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  roleIds: string[];
  department?: string;
  position?: string;
  status?: 'active' | 'inactive';
}

// 权限验证结果
export interface PermissionCheckResult {
  hasPermission: boolean;
  missingPermissions: string[];
}

// 认证状态
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: string[];
  roles: Role[];
}
