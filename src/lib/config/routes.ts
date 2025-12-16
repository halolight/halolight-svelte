import type { ComponentType } from 'svelte';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  ShieldCheck,
  Settings,
  MessageSquare,
  Calendar,
  Files,
  UserCircle,
  Lock,
  Bell,
  HelpCircle,
  Palette,
  Globe,
} from 'lucide-svelte';

// lucide-svelte 图标类型
type IconComponent = ComponentType<any>;

// 路由权限配置
export interface RoutePermission {
  code: string;
  name: string;
}

// 菜单项配置
export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon: IconComponent;
  permissions?: RoutePermission[];
  children?: MenuItem[];
  badge?: string | number;
  target?: string;
  hideInMenu?: boolean;
}

// 主导航菜单配置
export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    name: '仪表盘',
    path: '/dashboard',
    icon: LayoutDashboard,
    permissions: [{ code: 'dashboard:view', name: '查看仪表盘' }],
  },
  {
    id: 'users',
    name: '用户管理',
    path: '/users',
    icon: Users,
    permissions: [{ code: 'users:view', name: '查看用户' }],
  },
  {
    id: 'content',
    name: '内容管理',
    path: '/documents',
    icon: FileText,
    permissions: [{ code: 'content:view', name: '查看内容' }],
    children: [
      {
        id: 'documents',
        name: '文档管理',
        path: '/documents',
        icon: FileText,
        permissions: [{ code: 'documents:view', name: '查看文档' }],
      },
      {
        id: 'files',
        name: '文件存储',
        path: '/files',
        icon: Files,
        permissions: [{ code: 'files:view', name: '查看文件' }],
      },
    ],
  },
  {
    id: 'analytics',
    name: '业务运营',
    path: '/analytics',
    icon: BarChart3,
    permissions: [{ code: 'analytics:view', name: '查看分析' }],
    children: [
      {
        id: 'analytics-overview',
        name: '数据分析',
        path: '/analytics',
        icon: BarChart3,
        permissions: [{ code: 'analytics:view', name: '查看分析' }],
      },
      {
        id: 'messages',
        name: '消息中心',
        path: '/messages',
        icon: MessageSquare,
        permissions: [{ code: 'messages:view', name: '查看消息' }],
        badge: '5',
      },
      {
        id: 'calendar',
        name: '日程安排',
        path: '/calendar',
        icon: Calendar,
        permissions: [{ code: 'calendar:view', name: '查看日程' }],
      },
    ],
  },
  {
    id: 'notifications',
    name: '通知中心',
    path: '/notifications',
    icon: Bell,
    permissions: [{ code: 'notifications:view', name: '查看通知' }],
  },
  {
    id: 'accounts',
    name: '账号与权限',
    path: '/accounts',
    icon: ShieldCheck,
    permissions: [{ code: 'settings:view', name: '查看权限' }],
  },
  {
    id: 'settings',
    name: '系统设置',
    path: '/settings',
    icon: Settings,
    permissions: [{ code: 'settings:view', name: '查看设置' }],
    children: [
      {
        id: 'teams',
        name: '团队设置',
        path: '/settings/teams',
        icon: Users,
        permissions: [{ code: 'teams:view', name: '查看团队' }],
        children: [
          {
            id: 'roles',
            name: '角色管理',
            path: '/settings/teams/roles',
            icon: Lock,
            permissions: [{ code: 'roles:view', name: '查看角色' }],
          },
        ],
      },
    ],
  },
];

// 用户菜单配置
export interface UserMenuItem {
  id: string;
  name: string;
  path?: string;
  icon: IconComponent;
  divider?: boolean;
  target?: string;
  onClick?: () => void;
}

export const userMenuItems: UserMenuItem[] = [
  {
    id: 'profile',
    name: '个人资料',
    path: '/profile',
    icon: UserCircle,
  },
  {
    id: 'account',
    name: '账号设置',
    path: '/settings/account',
    icon: Settings,
  },
  {
    id: 'divider-1',
    name: '',
    icon: HelpCircle,
    divider: true,
  },
  {
    id: 'documentation',
    name: '文档',
    path: '/docs',
    icon: HelpCircle,
    target: '_blank',
  },
  {
    id: 'divider-2',
    name: '',
    icon: HelpCircle,
    divider: true,
  },
  {
    id: 'logout',
    name: '退出登录',
    icon: Lock,
  },
];

// 快捷设置菜单
export interface QuickSettingItem {
  id: string;
  name: string;
  icon: IconComponent;
  path?: string;
}

export const quickSettingsItems: QuickSettingItem[] = [
  {
    id: 'theme',
    name: '主题设置',
    icon: Palette,
    path: '/settings/theme',
  },
  {
    id: 'language',
    name: '语言设置',
    icon: Globe,
    path: '/settings/language',
  },
  {
    id: 'notifications',
    name: '通知设置',
    icon: Bell,
    path: '/settings/notifications',
  },
  {
    id: 'security',
    name: '安全设置',
    icon: ShieldCheck,
    path: '/settings/security',
  },
];

// 权限检查工具函数
export function hasPermission(
  userPermissions: string[],
  requiredPermissions?: RoutePermission[]
): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  return requiredPermissions.some((permission) => userPermissions.includes(permission.code));
}

// 过滤菜单项基于权限
export function filterMenuByPermissions(
  menuItems: MenuItem[],
  userPermissions: string[]
): MenuItem[] {
  return menuItems.filter((item) => {
    // 检查当前项权限
    const hasItemPermission = hasPermission(userPermissions, item.permissions);
    if (!hasItemPermission) {
      return false;
    }

    // 如果有子菜单，递归过滤
    if (item.children && item.children.length > 0) {
      const filteredChildren = filterMenuByPermissions(item.children, userPermissions);
      item.children = filteredChildren;

      // 如果子菜单被全部过滤掉，且当前项没有路径，则隐藏当前项
      if (filteredChildren.length === 0 && !item.path) {
        return false;
      }
    }

    return true;
  });
}

// 根据路径查找菜单项
export function findMenuItemByPath(menuItems: MenuItem[], path: string): MenuItem | null {
  for (const item of menuItems) {
    if (item.path === path) {
      return item;
    }

    if (item.children && item.children.length > 0) {
      const found = findMenuItemByPath(item.children, path);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

// 获取面包屑路径
export function getBreadcrumbPath(menuItems: MenuItem[], currentPath: string): MenuItem[] {
  const path: MenuItem[] = [];

  function findPath(items: MenuItem[], targetPath: string): boolean {
    for (const item of items) {
      path.push(item);

      if (item.path === targetPath) {
        return true;
      }

      if (item.children && item.children.length > 0) {
        if (findPath(item.children, targetPath)) {
          return true;
        }
      }

      path.pop();
    }

    return false;
  }

  findPath(menuItems, currentPath);
  return path;
}
