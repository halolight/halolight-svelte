import {
  BarChart3,
  Bell,
  CalendarCheck,
  FileText,
  FolderOpen,
  HelpCircle,
  LayoutDashboard,
  Lock,
  Mail,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-svelte';
import type { ComponentType } from 'svelte';

// lucide-svelte 图标类型
type IconComponent = ComponentType<any>;

export interface NavItem {
  title: string;
  to?: string;
  icon?: IconComponent;
  badge?: string;
  children?: NavItem[];
}

/**
 * 主导航菜单
 */
export const primaryNav: NavItem[] = [
  { title: '仪表盘', to: '/dashboard', icon: LayoutDashboard },
  { title: '用户管理', to: '/users', icon: Users },
  {
    title: '内容管理',
    icon: FileText,
    children: [
      { title: '文档管理', to: '/documents', icon: FileText },
      { title: '文件存储', to: '/files', icon: FolderOpen },
    ],
  },
  {
    title: '业务运营',
    icon: BarChart3,
    children: [
      { title: '数据分析', to: '/analytics', icon: BarChart3 },
      { title: '消息中心', to: '/messages', icon: Mail },
      { title: '日程安排', to: '/calendar', icon: CalendarCheck },
    ],
  },
  { title: '通知中心', to: '/notifications', icon: Bell },
  { title: '账号与权限', to: '/accounts', icon: ShieldCheck },
];

/**
 * 次要导航菜单
 */
export const secondaryNav: NavItem[] = [
  {
    title: '系统设置',
    icon: Settings,
    children: [
      { title: '团队设置', to: '/settings/teams', icon: Users },
      { title: '角色管理', to: '/settings/teams/roles', icon: Lock },
    ],
  },
  { title: '帮助文档', to: '/docs', icon: HelpCircle },
];

/**
 * 获取所有导航项
 */
export function getAllNavItems(): NavItem[] {
  return [...primaryNav, ...secondaryNav];
}

/**
 * 根据路径查找导航项
 */
export function findNavItemByPath(
  path: string,
  items: NavItem[] = getAllNavItems()
): NavItem | null {
  for (const item of items) {
    if (item.to === path) return item;
    if (item.children) {
      const found = findNavItemByPath(path, item.children);
      if (found) return found;
    }
  }
  return null;
}
