import type { User, LoginResponse, Role } from '$lib/types/auth.js';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import {
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_INFO_KEY,
  PERMISSIONS_KEY,
  ROLES_KEY,
  LOGIN_ROUTE,
  DEFAULT_ROUTE,
} from '$lib/utils/constants.js';

/**
 * 设置 cookie（用于服务端认证）
 */
function setCookie(name: string, value: string, days: number = 7): void {
  if (!browser) return;
  // eslint-disable-next-line svelte/prefer-svelte-reactivity -- Date 仅用于计算过期时间，不需要响应式
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * 删除 cookie
 */
function deleteCookie(name: string): void {
  if (!browser) return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}

/**
 * 认证状态管理
 */
class AuthStore {
  // 状态定义
  user = $state<User | null>(null);
  token = $state<string | null>(null);
  refreshToken = $state<string | null>(null);
  isLoading = $state<boolean>(false);
  permissions = $state<string[]>([]);
  roles = $state<Role[]>([]);

  // 派生状态
  isAuthenticated = $derived(!!this.token && !!this.user);

  constructor() {
    // 初始化时从本地存储恢复状态
    if (browser) {
      this.loadFromStorage();
    }
  }

  /**
   * 从本地存储加载认证状态
   */
  private loadFromStorage(): void {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const userStr = localStorage.getItem(USER_INFO_KEY);
      const permissionsStr = localStorage.getItem(PERMISSIONS_KEY);
      const rolesStr = localStorage.getItem(ROLES_KEY);

      if (token) this.token = token;
      if (refreshToken) this.refreshToken = refreshToken;
      if (userStr) this.user = JSON.parse(userStr);
      if (permissionsStr) this.permissions = JSON.parse(permissionsStr);
      if (rolesStr) this.roles = JSON.parse(rolesStr);
    } catch (error) {
      console.error('Failed to load auth state from storage:', error);
      this.clearStorage();
    }
  }

  /**
   * 保存认证状态到本地存储和 cookie
   */
  private saveToStorage(): void {
    if (!browser) return;

    try {
      if (this.token) {
        localStorage.setItem(TOKEN_KEY, this.token);
        // 同时设置 cookie，供服务端路由守卫使用
        setCookie(TOKEN_KEY, this.token, 7);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        deleteCookie(TOKEN_KEY);
      }

      if (this.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, this.refreshToken);
      } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }

      if (this.user) {
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(this.user));
      } else {
        localStorage.removeItem(USER_INFO_KEY);
      }

      localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(this.permissions));
      localStorage.setItem(ROLES_KEY, JSON.stringify(this.roles));
    } catch (error) {
      console.error('Failed to save auth state to storage:', error);
    }
  }

  /**
   * 清除本地存储和 cookie
   */
  private clearStorage(): void {
    if (!browser) return;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    localStorage.removeItem(PERMISSIONS_KEY);
    localStorage.removeItem(ROLES_KEY);

    // 同时清除 cookie
    deleteCookie(TOKEN_KEY);
  }

  /**
   * 登录
   */
  async login(email: string, password: string, _rememberMe: boolean = false): Promise<boolean> {
    this.isLoading = true;

    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟登录响应
      const mockResponse: LoginResponse = {
        token: `mock-access-token-${Date.now()}`,
        refreshToken: `mock-refresh-token-${Date.now()}`,
        expiresIn: 900, // 15分钟
        user: {
          id: '1',
          name: '管理员',
          email,
          status: 'active',
          avatar: '/avatars/default.png',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          department: '技术部',
          position: '管理员',
        },
        permissions: ['*'],
        roles: [
          {
            id: '1',
            name: '超级管理员',
            code: 'admin',
            status: 'active',
            permissions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };

      // 更新状态
      this.token = mockResponse.token;
      this.refreshToken = mockResponse.refreshToken ?? null;
      this.user = mockResponse.user;
      this.permissions = mockResponse.permissions ?? [];
      this.roles = mockResponse.roles ?? [];

      // 保存到本地存储
      this.saveToStorage();

      // 跳转到首页
      await goto(DEFAULT_ROUTE);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 登出
   */
  async logout(): Promise<void> {
    this.isLoading = true;

    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 清除状态
      this.token = null;
      this.refreshToken = null;
      this.user = null;
      this.permissions = [];
      this.roles = [];

      // 清除本地存储
      this.clearStorage();

      // 跳转到登录页
      await goto(LOGIN_ROUTE);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 注册
   */
  async register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<boolean> {
    this.isLoading = true;

    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟注册成功
      console.log('Registration successful:', data);

      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 忘记密码
   */
  async forgotPassword(email: string): Promise<boolean> {
    this.isLoading = true;

    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟发送重置邮件
      console.log('Password reset email sent to:', email);

      return true;
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 重置密码
   */
  async resetPassword(token: string, _password: string): Promise<boolean> {
    this.isLoading = true;

    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟重置成功
      console.log('Password reset successful for token:', token);

      return true;
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 检查权限
   */
  hasPermission(permission: string): boolean {
    if (!this.permissions.length) return false;

    return this.permissions.some(
      (p) =>
        p === '*' || p === permission || (p.endsWith(':*') && permission.startsWith(p.slice(0, -1)))
    );
  }

  /**
   * 检查多个权限
   */
  hasPermissions(permissions: string[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  /**
   * 检查任一权限
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  /**
   * 更新用户信息
   */
  updateUser(user: Partial<User>): void {
    if (this.user) {
      this.user = { ...this.user, ...user, updatedAt: new Date().toISOString() };
      this.saveToStorage();
    }
  }

  /**
   * 获取认证头
   */
  getAuthHeader(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }
}

// 创建全局实例
export const authStore = new AuthStore();
