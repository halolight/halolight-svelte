<script lang="ts">
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import {
    User,
    BarChart3,
    Users,
    Shield,
    Settings,
    CalendarCheck,
    FileText,
    MessagesSquare,
  } from 'lucide-svelte';

  // 用户信息
  const user = $derived(authStore.user);

  // 仪表盘统计数据（模拟）
  const stats = $derived([
    {
      title: '总用户数',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: '活跃用户',
      value: '856',
      change: '+8%',
      icon: User,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: '系统负载',
      value: '68%',
      change: '-2%',
      icon: BarChart3,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      title: '安全状态',
      value: '正常',
      change: '稳定',
      icon: Shield,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
    },
  ]);

  // 快捷功能
  const quickActions = $derived([
    {
      name: '用户管理',
      icon: Users,
      href: '/users',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: '消息中心',
      icon: MessagesSquare,
      href: '/messages',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: '文件空间',
      icon: FileText,
      href: '/files',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      name: '活动日历',
      icon: CalendarCheck,
      href: '/calendar',
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      name: '数据分析',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-cyan-500 hover:bg-cyan-600',
    },
    {
      name: '系统设置',
      icon: Settings,
      href: '/settings',
      color: 'bg-gray-500 hover:bg-gray-600',
    },
  ]);

  // 最近活动
  const recentActivities = $derived([
    {
      icon: User,
      iconBg: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
      title: `用户 "${user?.nickname || 'admin'}" 登录了系统`,
      time: '刚刚',
    },
    {
      icon: BarChart3,
      iconBg: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      title: '系统统计数据已更新',
      time: '5分钟前',
    },
    {
      icon: Shield,
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-600',
      title: '安全扫描已完成',
      time: '30分钟前',
    },
    {
      icon: FileText,
      iconBg: 'bg-purple-100 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
      title: '备份任务已完成',
      time: '1小时前',
    },
  ]);
</script>

<svelte:head>
  <title>仪表盘 - {import.meta.env.PUBLIC_APP_TITLE || 'Admin Pro'}</title>
  <meta name="description" content="系统仪表盘" />
</svelte:head>

<div class="space-y-6">
  <!-- 欢迎区域 -->
  <Card>
    <CardContent class="p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User class="h-6 w-6 text-primary" />
          </div>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-medium">欢迎回来，{user?.nickname || '管理员'}！</h3>
          <p class="text-sm text-muted-foreground">今天是美好的一天，让我们开始工作吧。</p>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- 统计卡片 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {#each stats as stat (stat.title)}
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-lg {stat.bgColor} flex items-center justify-center">
                <stat.icon class="h-5 w-5 {stat.color}" />
              </div>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <div class="flex items-baseline gap-2">
                <p class="text-2xl font-semibold">{stat.value}</p>
                <span class="text-xs text-green-600 dark:text-green-400">{stat.change}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    {/each}
  </div>

  <!-- 快捷功能 -->
  <Card>
    <CardHeader>
      <CardTitle>快捷功能</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {#each quickActions as action (action.name)}
          <a
            href={action.href}
            class="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div
              class="h-12 w-12 rounded-lg {action.color} flex items-center justify-center text-white mb-2"
            >
              <action.icon class="h-6 w-6" />
            </div>
            <span class="text-sm font-medium">{action.name}</span>
          </a>
        {/each}
      </div>
    </CardContent>
  </Card>

  <!-- 最近活动 -->
  <Card>
    <CardHeader>
      <CardTitle>最近活动</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        {#each recentActivities as activity (activity.title)}
          <div class="flex items-center space-x-3">
            <div class="h-8 w-8 rounded-full {activity.iconBg} flex items-center justify-center">
              <activity.icon class="h-4 w-4 {activity.iconColor}" />
            </div>
            <div class="flex-1">
              <p class="text-sm">{activity.title}</p>
              <p class="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        {/each}
      </div>
    </CardContent>
  </Card>
</div>
