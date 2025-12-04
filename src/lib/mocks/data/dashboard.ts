import type {
  DashboardStats,
  QuickAction,
  RecentActivity,
  DashboardNotification,
} from '$lib/types/dashboard.js';
import { FileText, Plus, Upload, Send, Download } from 'lucide-svelte';

/**
 * 生成仪表盘统计数据
 */
export function generateDashboardStats(): DashboardStats {
  return {
    users: {
      total: 1250,
      change: 12,
      trend: 'up',
    },
    files: {
      total: 3420,
      change: -3,
      trend: 'down',
    },
    messages: {
      total: 856,
      change: 8,
      trend: 'up',
    },
    storage: {
      total: 75,
      change: 5,
      trend: 'up',
    },
  };
}

/**
 * 生成快捷操作
 */
export function generateQuickActions(): QuickAction[] {
  return [
    {
      id: 'new-user',
      title: '新建用户',
      description: '创建新的用户账号',
      icon: Plus,
      action: '/users/new',
      color: 'blue',
    },
    {
      id: 'upload-file',
      title: '上传文件',
      description: '上传新的文件',
      icon: Upload,
      action: '/files/upload',
      color: 'green',
    },
    {
      id: 'send-message',
      title: '发送消息',
      description: '给用户发送消息',
      icon: Send,
      action: '/messages/new',
      color: 'purple',
    },
    {
      id: 'export-data',
      title: '导出数据',
      description: '导出系统数据',
      icon: Download,
      action: '/settings/export',
      color: 'orange',
    },
  ];
}

/**
 * 生成最近活动
 */
export function generateRecentActivities(count: number = 10): RecentActivity[] {
  const activities: RecentActivity[] = [];
  const actions = [
    { type: 'create', text: '创建了', icon: Plus },
    { type: 'update', text: '更新了', icon: FileText },
    { type: 'delete', text: '删除了', icon: FileText },
    { type: 'upload', text: '上传了', icon: Upload },
  ] as const;
  const resources = ['用户', '文件', '消息', '设置'];

  for (let i = 1; i <= count; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const resource = resources[Math.floor(Math.random() * resources.length)];
    const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);

    activities.push({
      id: `activity-${i}`,
      type: action.type,
      user: {
        id: `user-${Math.floor(Math.random() * 50) + 1}`,
        name: `用户${Math.floor(Math.random() * 50) + 1}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
      },
      action: `${action.text}${resource}`,
      resource: `${resource}${i}`,
      timestamp: timestamp.toISOString(),
    });
  }

  return activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * 生成通知数据
 */
export function generateNotifications(count: number = 5): DashboardNotification[] {
  const notifications: DashboardNotification[] = [];
  const types = ['info', 'warning', 'success', 'error'] as const;
  const titles = [
    '系统更新',
    '安全警告',
    '操作成功',
    '备份完成',
    '新消息',
    '权限变更',
    '性能提醒',
    '审核通过',
  ];

  for (let i = 1; i <= count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];

    notifications.push({
      id: `notif-${i}`,
      type,
      title,
      message: `这是通知 #${i} 的详细内容`,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      read: Math.random() > 0.5,
      link: Math.random() > 0.7 ? `/notifications/${i}` : undefined,
    });
  }

  return notifications.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * 全局仪表盘数据
 */
export const mockDashboardStats = generateDashboardStats();
export const mockQuickActions = generateQuickActions();
export const mockRecentActivities = generateRecentActivities(10);
export const mockNotifications = generateNotifications(5);
