import { httpClient } from '../client.js';
import type {
  UserDetail,
  UserListQuery,
  UserListResponse,
  UserStats,
  UserActivityLog,
  BatchUserOperation,
} from '$lib/types/users.js';
import type { ApiResponse, PaginatedResponse } from '$lib/types/index.js';

/**
 * 用户服务
 */
export class UserService {
  /**
   * 获取用户列表
   */
  async getUsers(query?: UserListQuery): Promise<ApiResponse<UserListResponse>> {
    return httpClient.get<UserListResponse>('/users', query as any);
  }

  /**
   * 获取用户详情
   */
  async getUserById(id: string): Promise<ApiResponse<UserDetail>> {
    return httpClient.get<UserDetail>(`/users/${id}`);
  }

  /**
   * 创建用户
   */
  async createUser(data: Partial<UserDetail>): Promise<ApiResponse<UserDetail>> {
    return httpClient.post<UserDetail>('/users', data);
  }

  /**
   * 更新用户
   */
  async updateUser(id: string, data: Partial<UserDetail>): Promise<ApiResponse<UserDetail>> {
    return httpClient.put<UserDetail>(`/users/${id}`, data);
  }

  /**
   * 删除用户
   */
  async deleteUser(id: string): Promise<ApiResponse<null>> {
    return httpClient.delete<null>(`/users/${id}`);
  }

  /**
   * 批量操作用户
   */
  async batchOperation(
    data: BatchUserOperation
  ): Promise<ApiResponse<{ successCount: number; failedCount: number }>> {
    return httpClient.post('/users/batch', data);
  }

  /**
   * 获取用户统计
   */
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return httpClient.get<UserStats>('/users/stats');
  }

  /**
   * 获取用户活动日志
   */
  async getUserActivities(
    userId: string,
    query?: { page?: number; pageSize?: number }
  ): Promise<ApiResponse<PaginatedResponse<UserActivityLog>>> {
    return httpClient.get<PaginatedResponse<UserActivityLog>>(
      `/users/${userId}/activities`,
      query as any
    );
  }

  /**
   * 导出用户
   */
  async exportUsers(
    query?: UserListQuery & { format: 'csv' | 'excel' | 'json' }
  ): Promise<ApiResponse<{ url: string; filename: string }>> {
    return httpClient.get('/users/export', query as any);
  }
}

/**
 * 导出用户服务实例
 */
export const userService = new UserService();
