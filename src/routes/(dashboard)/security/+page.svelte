<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import {
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Globe,
    Activity,
  } from 'lucide-svelte';

  // 安全统计
  const securityStats = [
    { label: '安全事件', value: '3', change: '-2', icon: AlertTriangle, color: 'text-yellow-500' },
    { label: '已处理', value: '12', change: '+5', icon: CheckCircle, color: 'text-green-500' },
    { label: '待处理', value: '1', change: '0', icon: Clock, color: 'text-blue-500' },
    { label: '高风险', value: '0', change: '-1', icon: XCircle, color: 'text-red-500' },
  ];

  // 最近的安全日志
  const securityLogs = [
    {
      action: '登录成功',
      user: 'admin',
      ip: '192.168.1.100',
      time: '2 分钟前',
      status: 'success',
    },
    {
      action: '密码修改',
      user: 'user01',
      ip: '192.168.1.101',
      time: '15 分钟前',
      status: 'success',
    },
    {
      action: '登录失败',
      user: 'unknown',
      ip: '203.0.113.50',
      time: '1 小时前',
      status: 'warning',
    },
    {
      action: '权限变更',
      user: 'admin',
      ip: '192.168.1.100',
      time: '2 小时前',
      status: 'info',
    },
    {
      action: '异常访问',
      user: 'user02',
      ip: '198.51.100.25',
      time: '3 小时前',
      status: 'danger',
    },
  ];
</script>

<svelte:head>
  <title>安全审计 - {import.meta.env.VITE_APP_TITLE || 'Admin Pro'}</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold">安全审计</h1>
      <p class="text-muted-foreground">监控系统安全状态和审计日志</p>
    </div>
    <Button variant="outline">
      <Shield class="mr-2 h-4 w-4" />
      安全扫描
    </Button>
  </div>

  <!-- 安全统计 -->
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {#each securityStats as stat (stat.label)}
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">{stat.label}</p>
              <p class="text-3xl font-bold">{stat.value}</p>
              <p class="text-xs text-muted-foreground">
                较上周
                <span class={stat.change.startsWith('-') ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
              </p>
            </div>
            <div class="rounded-full bg-muted p-3">
              <stat.icon class="h-6 w-6 {stat.color}" />
            </div>
          </div>
        </CardContent>
      </Card>
    {/each}
  </div>

  <div class="grid gap-6 lg:grid-cols-2">
    <!-- 安全日志 -->
    <Card>
      <CardHeader>
        <CardTitle>安全日志</CardTitle>
        <CardDescription>最近的安全相关活动</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each securityLogs as log (log.time + log.action)}
            <div class="flex items-center gap-4 rounded-lg border p-3">
              <div
                class="rounded-full p-2 {log.status === 'success'
                  ? 'bg-green-100 text-green-600'
                  : log.status === 'warning'
                    ? 'bg-yellow-100 text-yellow-600'
                    : log.status === 'danger'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600'}"
              >
                <Activity class="h-4 w-4" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <p class="font-medium">{log.action}</p>
                  <Badge
                    variant={log.status === 'success'
                      ? 'default'
                      : log.status === 'danger'
                        ? 'destructive'
                        : 'secondary'}
                    class="text-xs"
                  >
                    {log.status === 'success'
                      ? '成功'
                      : log.status === 'warning'
                        ? '警告'
                        : log.status === 'danger'
                          ? '危险'
                          : '信息'}
                  </Badge>
                </div>
                <div class="flex items-center gap-3 text-sm text-muted-foreground">
                  <span class="flex items-center gap-1">
                    <User class="h-3 w-3" />
                    {log.user}
                  </span>
                  <span class="flex items-center gap-1">
                    <Globe class="h-3 w-3" />
                    {log.ip}
                  </span>
                  <span class="flex items-center gap-1">
                    <Clock class="h-3 w-3" />
                    {log.time}
                  </span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>

    <!-- 安全建议 -->
    <Card>
      <CardHeader>
        <CardTitle>安全建议</CardTitle>
        <CardDescription>提升系统安全性的建议</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div
          class="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950"
        >
          <div class="flex items-start gap-3">
            <AlertTriangle class="h-5 w-5 text-yellow-600" />
            <div>
              <p class="font-medium text-yellow-800 dark:text-yellow-200">启用两步验证</p>
              <p class="text-sm text-yellow-700 dark:text-yellow-300">
                建议所有管理员账户启用两步验证以提高安全性
              </p>
              <Button size="sm" variant="outline" class="mt-2">立即启用</Button>
            </div>
          </div>
        </div>

        <div
          class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950"
        >
          <div class="flex items-start gap-3">
            <Shield class="h-5 w-5 text-blue-600" />
            <div>
              <p class="font-medium text-blue-800 dark:text-blue-200">定期更换密码</p>
              <p class="text-sm text-blue-700 dark:text-blue-300">
                您的密码已超过 90 天未更换，建议定期更新
              </p>
              <Button size="sm" variant="outline" class="mt-2">更换密码</Button>
            </div>
          </div>
        </div>

        <div
          class="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950"
        >
          <div class="flex items-start gap-3">
            <CheckCircle class="h-5 w-5 text-green-600" />
            <div>
              <p class="font-medium text-green-800 dark:text-green-200">系统安全检查</p>
              <p class="text-sm text-green-700 dark:text-green-300">
                上次安全扫描未发现异常，系统运行正常
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
