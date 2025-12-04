import { httpClient } from '../client.js';
import type {
  DashboardStats,
  QuickAction,
  RecentActivity,
  DashboardNotification,
} from '$lib/types/dashboard.js';
import type { ApiResponse } from '$lib/types/index.js';

/**
 * 仪表盘服务
 */
export class DashboardService {
  /**
   * 获取仪表盘统计数据
   */
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return httpClient.get<DashboardStats>('/dashboard/stats');
  }

  /**
   * 获取快捷操作
   */
  async getQuickActions(): Promise<ApiResponse<QuickAction[]>> {
    return httpClient.get<QuickAction[]>('/dashboard/quick-actions');
  }

  /**
   * 获取最近活动
   */
  async getRecentActivities(limit: number = 10): Promise<ApiResponse<RecentActivity[]>> {
    return httpClient.get<RecentActivity[]>('/dashboard/activities', { limit });
  }

  /**
   * 获取通知列表
   */
  async getNotifications(limit: number = 5): Promise<ApiResponse<DashboardNotification[]>> {
    return httpClient.get<DashboardNotification[]>('/dashboard/notifications', { limit });
  }

  /**
   * 标记通知已读
   */
  async markNotificationAsRead(id: string): Promise<ApiResponse<null>> {
    return httpClient.put<null>(`/dashboard/notifications/${id}/read`);
  }

  /**
   * 批量标记通知已读
   */
  async batchMarkNotificationsAsRead(
    notificationIds: string[]
  ): Promise<ApiResponse<{ successCount: number }>> {
    return httpClient.post('/dashboard/notifications/batch-read', { notificationIds });
  }

  /**
   * 删除通知
   */
  async deleteNotification(id: string): Promise<ApiResponse<null>> {
    return httpClient.delete<null>(`/dashboard/notifications/${id}`);
  }
}

/**
 * 导出仪表盘服务实例
 */
export const dashboardService = new DashboardService();
