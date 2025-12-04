import { http, HttpResponse, delay } from 'msw';
import type { SendMessageDto } from '$lib/types/messages.js';
import {
  mockMessages,
  mockMessageThreads,
  mockMessageStats,
  generateMessages,
} from '../data/messages.js';

const API_BASE = '/api';

/**
 * 消息相关 API Mock handlers
 */
export const messageHandlers = [
  // 获取消息列表
  http.get(`${API_BASE}/messages`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const keyword = url.searchParams.get('keyword') || '';

    let filtered = mockMessages;

    // 类型筛选
    if (type) {
      filtered = filtered.filter((m) => m.type === type);
    }

    // 状态筛选
    if (status) {
      filtered = filtered.filter((m) => m.status === status);
    }

    // 关键词搜索
    if (keyword) {
      filtered = filtered.filter(
        (m) =>
          m.subject.includes(keyword) ||
          m.content.includes(keyword) ||
          m.senderName.includes(keyword)
      );
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

  // 获取消息详情
  http.get(`${API_BASE}/messages/:id`, async ({ params }) => {
    await delay(200);
    const { id } = params;
    const message = mockMessages.find((m) => m.id === id);

    if (!message) {
      return HttpResponse.json(
        {
          code: 404,
          message: '消息不存在',
          data: null,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: message,
    });
  }),

  // 发送消息
  http.post(`${API_BASE}/messages`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as SendMessageDto;

    const newMessages = body.receiverIds.map((receiverId, i) => ({
      id: `msg-${mockMessages.length + i + 1}`,
      senderId: 'current-user',
      senderName: '当前用户',
      receiverId,
      type: body.type,
      priority: body.priority || 'normal',
      subject: body.subject,
      content: body.content,
      status: 'unread' as const,
      attachments: body.attachments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return HttpResponse.json({
      code: 0,
      message: '发送成功',
      data: newMessages,
    });
  }),

  // 标记已读
  http.put(`${API_BASE}/messages/:id/read`, async ({ params }) => {
    await delay(200);
    const { id } = params;
    const message = mockMessages.find((m) => m.id === id);

    if (!message) {
      return HttpResponse.json(
        {
          code: 404,
          message: '消息不存在',
          data: null,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 0,
      message: '标记成功',
      data: {
        ...message,
        status: 'read',
        readAt: new Date().toISOString(),
      },
    });
  }),

  // 批量标记已读
  http.post(`${API_BASE}/messages/batch-read`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { messageIds: string[] };
    const { messageIds } = body;

    return HttpResponse.json({
      code: 0,
      message: '批量标记成功',
      data: {
        successCount: messageIds.length,
      },
    });
  }),

  // 删除消息
  http.delete(`${API_BASE}/messages/:id`, async ({ params }) => {
    await delay(300);
    const { id } = params;
    const message = mockMessages.find((m) => m.id === id);

    if (!message) {
      return HttpResponse.json(
        {
          code: 404,
          message: '消息不存在',
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

  // 获取消息统计
  http.get(`${API_BASE}/messages/stats`, async () => {
    await delay(200);
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: mockMessageStats,
    });
  }),

  // 获取消息会话列表
  http.get(`${API_BASE}/messages/threads`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;

    const total = mockMessageThreads.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = mockMessageThreads.slice(start, end);

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

  // 获取会话详情
  http.get(`${API_BASE}/messages/threads/:id`, async ({ params }) => {
    await delay(200);
    const { id } = params;
    const thread = mockMessageThreads.find((t) => t.id === id);

    if (!thread) {
      return HttpResponse.json(
        {
          code: 404,
          message: '会话不存在',
          data: null,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: thread,
    });
  }),

  // 获取会话消息
  http.get(`${API_BASE}/messages/threads/:id/messages`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 20;

    // 生成会话消息
    const threadMessages = generateMessages(50).slice(0, 30);
    const total = threadMessages.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = threadMessages.slice(start, end);

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
];
