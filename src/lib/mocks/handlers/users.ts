import { http, HttpResponse, delay } from 'msw';
import type { BatchUserOperation } from '$lib/types/users.js';
import { mockUsers, mockUserStats, mockUserActivityLogs } from '../data/users.js';

const API_BASE = '/api';

/**
 * 用户相关 API Mock handlers
 */
export const userHandlers = [
  // 获取用户列表
  http.get(`${API_BASE}/users`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const keyword = url.searchParams.get('keyword') || '';
    const status = url.searchParams.get('status');

    let filtered = mockUsers;

    // 关键词搜索
    if (keyword) {
      filtered = filtered.filter(
        (u) =>
          u.username.includes(keyword) || u.email.includes(keyword) || u.nickname.includes(keyword)
      );
    }

    // 状态筛选
    if (status) {
      filtered = filtered.filter((u) => u.status === status);
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = filtered.slice(start, end);

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        list,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  }),

  // 获取用户详情
  http.get(`${API_BASE}/users/:id`, async ({ params }) => {
    await delay(200);
    const { id } = params;
    const user = mockUsers.find((u) => u.id === id);

    if (!user) {
      return HttpResponse.json(
        {
          code: 404,
          message: '用户不存在',
          data: null,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: user,
    });
  }),

  // 创建用户
  http.post(`${API_BASE}/users`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as Record<string, unknown>;

    const newUser = {
      id: `user-${mockUsers.length + 1}`,
      ...(body || {}),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      code: 0,
      message: '创建成功',
      data: newUser,
    });
  }),

  // 更新用户
  http.put(`${API_BASE}/users/:id`, async ({ params, request }) => {
    await delay(500);
    const { id } = params;
    const body = (await request.json()) as Record<string, unknown>;
    const user = mockUsers.find((u) => u.id === id);

    if (!user) {
      return HttpResponse.json(
        {
          code: 404,
          message: '用户不存在',
          data: null,
        },
        { status: 404 }
      );
    }

    const updatedUser = {
      ...user,
      ...(body || {}),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      code: 0,
      message: '更新成功',
      data: updatedUser,
    });
  }),

  // 删除用户
  http.delete(`${API_BASE}/users/:id`, async ({ params }) => {
    await delay(500);
    const { id } = params;
    const user = mockUsers.find((u) => u.id === id);

    if (!user) {
      return HttpResponse.json(
        {
          code: 404,
          message: '用户不存在',
          data: null,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 0,
      message: '删除成功',
      data: null,
    });
  }),

  // 批量操作用户
  http.post(`${API_BASE}/users/batch`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as BatchUserOperation;
    const { userIds, action } = body;

    return HttpResponse.json({
      code: 0,
      message: `批量${action}成功`,
      data: {
        successCount: userIds.length,
        failedCount: 0,
      },
    });
  }),

  // 获取用户统计
  http.get(`${API_BASE}/users/stats`, async () => {
    await delay(200);
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: mockUserStats,
    });
  }),

  // 获取用户活动日志
  http.get(`${API_BASE}/users/:id/activities`, async ({ params, request }) => {
    await delay(300);
    const { id } = params;
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;

    const userLogs = mockUserActivityLogs.filter((log) => log.userId === id);
    const total = userLogs.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = userLogs.slice(start, end);

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        list,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  }),

  // 导出用户
  http.get(`${API_BASE}/users/export`, async ({ request }) => {
    await delay(1000);
    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'csv';

    return HttpResponse.json({
      code: 0,
      message: '导出成功',
      data: {
        url: `https://example.com/exports/users.${format}`,
        filename: `users-${Date.now()}.${format}`,
      },
    });
  }),
];
