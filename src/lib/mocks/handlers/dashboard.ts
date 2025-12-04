import { http, HttpResponse, delay } from 'msw';
import {
  mockDashboardStats,
  mockQuickActions,
  mockRecentActivities,
  mockNotifications,
} from '../data/dashboard.js';

const API_BASE = '/api';

/**
 * 仪表盘相关 API Mock handlers
 */
export const dashboardHandlers = [
  // 获取仪表盘统计数据
  http.get(`${API_BASE}/dashboard/stats`, async () => {
    await delay(300);
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: mockDashboardStats,
    });
  }),

  // 获取快捷操作
  http.get(`${API_BASE}/dashboard/quick-actions`, async () => {
    await delay(200);
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: mockQuickActions,
    });
  }),

  // 获取最近活动
  http.get(`${API_BASE}/dashboard/activities`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;

    const list = mockRecentActivities.slice(0, limit);

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: list,
    });
  }),

  // 获取通知列表
  http.get(`${API_BASE}/dashboard/notifications`, async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 5;

    const list = mockNotifications.slice(0, limit);

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: list,
    });
  }),

  // 标记通知已读
  http.put(`${API_BASE}/dashboard/notifications/:id/read`, async () => {
    await delay(200);

    return HttpResponse.json({
      code: 0,
      message: '标记成功',
      data: null,
    });
  }),

  // 批量标记通知已读
  http.post(`${API_BASE}/dashboard/notifications/batch-read`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { notificationIds?: string[] };
    const { notificationIds } = body;

    return HttpResponse.json({
      code: 0,
      message: '批量标记成功',
      data: {
        successCount: notificationIds?.length || 0,
      },
    });
  }),

  // 删除通知
  http.delete(`${API_BASE}/dashboard/notifications/:id`, async () => {
    await delay(200);

    return HttpResponse.json({
      code: 0,
      message: '删除成功',
      data: null,
    });
  }),
];
