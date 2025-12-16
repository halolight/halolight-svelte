import type { UserDetail, UserStats, UserActivityLog } from '$lib/types/users.js';

/**
 * 生成模拟用户数据
 */
export function generateUsers(count: number = 50): UserDetail[] {
  const users: UserDetail[] = [];
  const statuses = ['active', 'inactive', 'banned'] as const;
  const departments = ['技术部', '产品部', '市场部', '运营部', '人事部', '财务部'];
  const positions = ['开发工程师', '产品经理', '设计师', '运营专员', '测试工程师', '项目经理'];
  const genders = ['male', 'female', 'other'] as const;

  for (let i = 1; i <= count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];

    users.push({
      id: `user-${i}`,
      username: `user${i}`,
      email: `user${i}@example.com`,
      phone: `138${String(Math.random()).slice(2, 10)}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
      nickname: `用户${i}`,
      status,
      department,
      position,
      lastLoginAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
      loginCount: Math.floor(Math.random() * 1000),
      roleIds: ['role-1'],
      roleName: '普通用户',
      permissions: ['user:view', 'dashboard:view'],
      bio: `这是用户${i}的个人简介`,
      gender,
      birthday: new Date(
        1990 + Math.floor(Math.random() * 20),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28)
      ).toISOString(),
      location: '中国',
      website: `https://user${i}.example.com`,
      socialLinks: {
        github: `https://github.com/user${i}`,
        twitter: `https://twitter.com/user${i}`,
        linkedin: `https://linkedin.com/in/user${i}`,
      },
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return users;
}

/**
 * 生成模拟用户统计数据
 */
export function generateUserStats(): UserStats {
  const total = 150;
  const active = 120;
  const inactive = 25;
  const banned = 5;

  return {
    total,
    active,
    inactive,
    banned,
    newToday: 3,
    newThisWeek: 15,
    newThisMonth: 42,
    onlineNow: 38,
  };
}

/**
 * 生成模拟用户活动日志
 */
export function generateUserActivityLogs(count: number = 100): UserActivityLog[] {
  const logs: UserActivityLog[] = [];
  const actions = ['登录', '登出', '创建资源', '更新资源', '删除资源', '查看资源', '导出数据'];
  const actionTypes = ['login', 'logout', 'create', 'update', 'delete', 'view', 'export'] as const;
  const resourceTypes = ['用户', '文件', '消息', '设置'];
  const statuses = ['success', 'failed'] as const;

  for (let i = 1; i <= count; i++) {
    const actionIndex = Math.floor(Math.random() * actions.length);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];

    logs.push({
      id: `log-${i}`,
      userId: `user-${Math.floor(Math.random() * 50) + 1}`,
      username: `user${Math.floor(Math.random() * 50) + 1}`,
      action: actions[actionIndex],
      actionType: actionTypes[actionIndex],
      resource: `${resourceType}-${Math.floor(Math.random() * 100)}`,
      resourceType,
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: '中国',
      status,
      errorMessage: status === 'failed' ? '操作失败' : undefined,
      duration: Math.floor(Math.random() * 5000),
      metadata: {},
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * 全局用户数据
 */
export const mockUsers = generateUsers(50);
export const mockUserStats = generateUserStats();
export const mockUserActivityLogs = generateUserActivityLogs(100);
