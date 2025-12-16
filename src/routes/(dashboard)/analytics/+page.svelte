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
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Eye,
    Clock,
    MousePointer,
    Download,
  } from 'lucide-svelte';

  // 分析统计数据
  const analyticsStats = [
    {
      label: '页面访问量',
      value: '12,456',
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
    },
    {
      label: '独立访客',
      value: '3,842',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
    },
    {
      label: '平均停留时间',
      value: '4:32',
      change: '-2.1%',
      trend: 'down',
      icon: Clock,
    },
    {
      label: '点击率',
      value: '24.8%',
      change: '+5.4%',
      trend: 'up',
      icon: MousePointer,
    },
  ];

  // 热门页面
  const topPages = [
    { path: '/dashboard', views: 2456, percentage: 28 },
    { path: '/users', views: 1823, percentage: 21 },
    { path: '/messages', views: 1245, percentage: 14 },
    { path: '/files', views: 987, percentage: 11 },
    { path: '/settings', views: 756, percentage: 9 },
  ];

  // 流量来源
  const trafficSources = [
    { source: '直接访问', value: 45, color: 'bg-blue-500' },
    { source: '搜索引擎', value: 30, color: 'bg-green-500' },
    { source: '社交媒体', value: 15, color: 'bg-yellow-500' },
    { source: '外部链接', value: 10, color: 'bg-purple-500' },
  ];
</script>

<svelte:head>
  <title>分析报告 - {import.meta.env.VITE_APP_TITLE || 'Admin Pro'}</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold">分析报告</h1>
      <p class="text-muted-foreground">查看网站访问数据和用户行为分析</p>
    </div>
    <Button variant="outline">
      <Download class="mr-2 h-4 w-4" />
      导出报告
    </Button>
  </div>

  <!-- 统计卡片 -->
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {#each analyticsStats as stat (stat.label)}
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">{stat.label}</p>
              <p class="text-3xl font-bold">{stat.value}</p>
              <p
                class="flex items-center gap-1 text-sm {stat.trend === 'up'
                  ? 'text-green-600'
                  : 'text-red-600'}"
              >
                {#if stat.trend === 'up'}
                  <TrendingUp class="h-4 w-4" />
                {:else}
                  <TrendingDown class="h-4 w-4" />
                {/if}
                {stat.change}
              </p>
            </div>
            <div class="rounded-full bg-primary/10 p-3">
              <stat.icon class="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    {/each}
  </div>

  <div class="grid gap-6 lg:grid-cols-2">
    <!-- 热门页面 -->
    <Card>
      <CardHeader>
        <CardTitle>热门页面</CardTitle>
        <CardDescription>访问量最高的页面排名</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each topPages as page, index (page.path)}
            <div class="flex items-center gap-4">
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium"
              >
                {index + 1}
              </span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <p class="font-medium truncate">{page.path}</p>
                  <span class="text-sm text-muted-foreground">{page.views.toLocaleString()}</span>
                </div>
                <div class="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    class="h-full bg-primary rounded-full"
                    style="width: {page.percentage}%"
                  ></div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>

    <!-- 流量来源 -->
    <Card>
      <CardHeader>
        <CardTitle>流量来源</CardTitle>
        <CardDescription>用户访问来源分布</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each trafficSources as source (source.source)}
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="h-3 w-3 rounded-full {source.color}"></span>
                  <span class="font-medium">{source.source}</span>
                </div>
                <span class="text-muted-foreground">{source.value}%</span>
              </div>
              <div class="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  class="h-full rounded-full {source.color}"
                  style="width: {source.value}%"
                ></div>
              </div>
            </div>
          {/each}
        </div>

        <div class="mt-6 pt-4 border-t">
          <div class="grid grid-cols-2 gap-4 text-center">
            <div>
              <p class="text-2xl font-bold">68%</p>
              <p class="text-sm text-muted-foreground">新访客</p>
            </div>
            <div>
              <p class="text-2xl font-bold">32%</p>
              <p class="text-sm text-muted-foreground">回访用户</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- 趋势图占位 -->
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle>访问趋势</CardTitle>
          <CardDescription>过去 30 天的访问数据</CardDescription>
        </div>
        <div class="flex gap-2">
          <Badge variant="outline">日</Badge>
          <Badge variant="secondary">周</Badge>
          <Badge variant="outline">月</Badge>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div
        class="flex h-64 items-center justify-center rounded-lg border border-dashed bg-muted/50"
      >
        <div class="text-center">
          <BarChart3 class="mx-auto h-12 w-12 text-muted-foreground" />
          <p class="mt-2 text-muted-foreground">图表区域</p>
          <p class="text-sm text-muted-foreground">可集成 Chart.js 或其他图表库</p>
        </div>
      </div>
    </CardContent>
  </Card>
</div>
