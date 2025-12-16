import { http, HttpResponse, delay } from 'msw';
import type { LoginDto, RegisterDto } from '$lib/types/auth.js';

const API_BASE = '/api';

/**
 * 认证相关 API Mock handlers
 */
export const authHandlers = [
  // 登录
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as LoginDto;
    const { email, password } = body;

    // 模拟登录失败
    if (email === 'wrong@example.com' || password === 'wrong') {
      return HttpResponse.json(
        {
          code: 401,
          message: '邮箱或密码错误',
          data: null,
        },
        { status: 401 }
      );
    }

    // 从邮箱提取用户名用于生成头像
    const nameFromEmail = email.split('@')[0];

    // 模拟登录成功
    return HttpResponse.json({
      code: 0,
      message: '登录成功',
      data: {
        user: {
          id: 'user-1',
          name: '管理员',
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameFromEmail}`,
          status: 'active',
          roleIds: ['role-1'],
          roleName: '管理员',
        },
        token: `mock-access-token-${Date.now()}`,
        refreshToken: `mock-refresh-token-${Date.now()}`,
        expiresIn: 3600,
      },
    });
  }),

  // 注册
  http.post(`${API_BASE}/auth/register`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as RegisterDto;
    const { name, email } = body;

    // 模拟邮箱已存在
    if (email === 'admin@example.com' || email === 'test@example.com') {
      return HttpResponse.json(
        {
          code: 409,
          message: '邮箱已被注册',
          data: null,
        },
        { status: 409 }
      );
    }

    // 从邮箱提取用于生成头像
    const nameFromEmail = email.split('@')[0];

    // 模拟注册成功
    return HttpResponse.json({
      code: 0,
      message: '注册成功',
      data: {
        user: {
          id: `user-${Date.now()}`,
          name,
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameFromEmail}`,
          status: 'active',
          roleIds: ['role-2'],
          roleName: '普通用户',
        },
        token: `mock-access-token-${Date.now()}`,
        refreshToken: `mock-refresh-token-${Date.now()}`,
        expiresIn: 3600,
      },
    });
  }),

  // 登出
  http.post(`${API_BASE}/auth/logout`, async () => {
    await delay(200);
    return HttpResponse.json({
      code: 0,
      message: '登出成功',
      data: null,
    });
  }),

  // 刷新令牌
  http.post(`${API_BASE}/auth/refresh`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { refreshToken?: string };
    const { refreshToken } = body;

    // 模拟刷新失败
    if (!refreshToken || refreshToken === 'invalid') {
      return HttpResponse.json(
        {
          code: 401,
          message: '刷新令牌无效',
          data: null,
        },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      code: 0,
      message: '刷新成功',
      data: {
        accessToken: `mock-access-token-${Date.now()}`,
        refreshToken: `mock-refresh-token-${Date.now()}`,
        expiresIn: 3600,
      },
    });
  }),

  // 获取当前用户信息
  http.get(`${API_BASE}/auth/me`, async ({ request }) => {
    await delay(200);
    const authorization = request.headers.get('Authorization');

    // 模拟未认证
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: 401,
          message: '未认证',
          data: null,
        },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        id: 'user-1',
        name: '管理员',
        email: 'admin@halolight.h7ml.cn',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        status: 'active',
        roleIds: ['role-1'],
        roleName: '管理员',
      },
    });
  }),

  // 忘记密码
  http.post(`${API_BASE}/auth/forgot-password`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { email: string };
    const { email } = body;

    // 模拟邮箱不存在
    if (email === 'notexist@example.com') {
      return HttpResponse.json(
        {
          code: 404,
          message: '邮箱不存在',
          data: null,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 0,
      message: '重置邮件已发送，请查收',
      data: {
        email,
        resetToken: `mock-reset-token-${Date.now()}`,
      },
    });
  }),

  // 重置密码
  http.post(`${API_BASE}/auth/reset-password`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { token?: string; password?: string };
    const { token } = body;

    // 模拟令牌无效
    if (!token || token === 'invalid') {
      return HttpResponse.json(
        {
          code: 400,
          message: '重置令牌无效或已过期',
          data: null,
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      code: 0,
      message: '密码重置成功，请使用新密码登录',
      data: null,
    });
  }),

  // 修改密码
  http.put(`${API_BASE}/auth/change-password`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { oldPassword?: string; newPassword?: string };
    const { oldPassword } = body;

    // 模拟旧密码错误
    if (oldPassword === 'wrong') {
      return HttpResponse.json(
        {
          code: 400,
          message: '旧密码错误',
          data: null,
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      code: 0,
      message: '密码修改成功',
      data: null,
    });
  }),

  // 更新用户资料
  http.put(`${API_BASE}/auth/profile`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, unknown>;

    return HttpResponse.json({
      code: 0,
      message: '更新成功',
      data: {
        id: 'user-1',
        name: '管理员',
        email: 'admin@halolight.h7ml.cn',
        status: 'active',
        ...(body || {}),
      },
    });
  }),

  // 上传头像
  http.post(`${API_BASE}/auth/avatar`, async () => {
    await delay(800);

    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;

    return HttpResponse.json({
      code: 0,
      message: '头像上传成功',
      data: {
        avatar: avatarUrl,
      },
    });
  }),
];
