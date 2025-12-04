<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import { Separator } from '$lib/components/ui/separator';
  import {
    BarChart,
    Book,
    Calendar,
    ChevronRight,
    Code,
    ExternalLink,
    FileText,
    FolderOpen,
    MessageSquare,
    Search,
    Settings,
    Shield,
    Users,
  } from 'lucide-svelte';

  const docCategories = [
    {
      title: '快速开始',
      icon: Book,
      description: '了解系统基础功能和快速上手指南',
      items: [
        { title: '系统介绍', href: '#intro' },
        { title: '安装配置', href: '#install' },
        { title: '基本使用', href: '#usage' },
      ],
    },
    {
      title: '用户管理',
      icon: Users,
      description: '用户创建、编辑、权限分配等操作指南',
      items: [
        { title: '添加用户', href: '#add-user' },
        { title: '角色权限', href: '#roles' },
        { title: '批量操作', href: '#batch' },
      ],
    },
    {
      title: '数据分析',
      icon: BarChart,
      description: '报表生成、数据导出和可视化功能',
      items: [
        { title: '仪表盘配置', href: '#dashboard' },
        { title: '报表生成', href: '#reports' },
        { title: '数据导出', href: '#export' },
      ],
    },
    {
      title: '系统设置',
      icon: Settings,
      description: '系统配置、主题定制和偏好设置',
      items: [
        { title: '基础配置', href: '#config' },
        { title: '主题定制', href: '#theme' },
        { title: '通知设置', href: '#notifications' },
      ],
    },
    {
      title: '安全指南',
      icon: Shield,
      description: '账户安全、数据保护和最佳实践',
      items: [
        { title: '双因素认证', href: '#2fa' },
        { title: '密码策略', href: '#password' },
        { title: '审计日志', href: '#audit' },
      ],
    },
    {
      title: 'API 文档',
      icon: Code,
      description: '接口说明、调用示例和错误处理',
      items: [
        { title: '认证接口', href: '#auth-api' },
        { title: '用户接口', href: '#user-api' },
        { title: '数据接口', href: '#data-api' },
      ],
    },
  ];

  const popularDocs = [
    { title: '如何创建新用户', views: 1234, category: '用户管理' },
    { title: '配置双因素认证', views: 986, category: '安全指南' },
    { title: '导出数据报表', views: 876, category: '数据分析' },
    { title: '自定义仪表盘', views: 654, category: '数据分析' },
    { title: 'API 认证方式', views: 543, category: 'API 文档' },
  ];

  let searchQuery = $state('');

  const filteredCategories = $derived(
    docCategories.filter(
      (category) =>
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.items.some((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );
</script>

<svelte:head>
  <title>帮助文档 - {import.meta.env.VITE_APP_TITLE || 'Admin Pro'}</title>
</svelte:head>

<div class="space-y-6">
  <!-- 页面标题 -->
  <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">帮助文档</h1>
    </div>
  </div>

  <!-- 搜索栏 -->
  <Card>
    <CardContent class="pt-6">
      <div class="relative mx-auto max-w-xl">
        <Search class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="搜索文档..." class="h-12 pl-10 text-lg" bind:value={searchQuery} />
      </div>
    </CardContent>
  </Card>

  <div class="grid gap-6 lg:grid-cols-3">
    <!-- 文档分类 -->
    <div class="lg:col-span-2">
      <div class="grid gap-4 sm:grid-cols-2">
        {#each filteredCategories as category (category.title)}
          <Card class="h-full transition-shadow hover:shadow-md">
            <CardHeader class="pb-3">
              <div class="flex items-center gap-3">
                <div class="rounded-lg bg-primary/10 p-2">
                  <category.icon class="h-5 w-5 text-primary" />
                </div>
                <CardTitle class="text-lg">{category.title}</CardTitle>
              </div>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul class="space-y-2">
                {#each category.items as docItem (docItem.title)}
                  <li>
                    <a
                      href={docItem.href}
                      class="group flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <FileText class="mr-2 h-4 w-4" />
                      <span class="flex-1">{docItem.title}</span>
                      <ChevronRight
                        class="h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                      />
                    </a>
                  </li>
                {/each}
              </ul>
            </CardContent>
          </Card>
        {/each}
      </div>

      {#if filteredCategories.length === 0}
        <Card class="p-8 text-center">
          <Book class="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 class="mt-4 text-lg font-medium">未找到相关文档</h3>
          <p class="mt-2 text-muted-foreground">请尝试其他搜索关键词</p>
        </Card>
      {/if}
    </div>

    <!-- 侧边栏 -->
    <div class="space-y-6">
      <!-- 热门文档 -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">热门文档</CardTitle>
          <CardDescription>最受欢迎的帮助文章</CardDescription>
        </CardHeader>
        <CardContent>
          <ul class="space-y-3">
            {#each popularDocs as doc, index (doc.title)}
              <li>
                <button type="button" class="group flex w-full items-start gap-3 text-left">
                  <span
                    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium"
                  >
                    {index + 1}
                  </span>
                  <div class="min-w-0 flex-1">
                    <p
                      class="truncate text-sm font-medium transition-colors group-hover:text-primary"
                    >
                      {doc.title}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      {doc.category} · {doc.views} 次浏览
                    </p>
                  </div>
                </button>
              </li>
            {/each}
          </ul>
        </CardContent>
      </Card>

      <!-- 快速链接 -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">快速链接</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <button
            type="button"
            class="flex w-full items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <MessageSquare class="h-4 w-4" />
            联系客服
            <ExternalLink class="ml-auto h-3 w-3" />
          </button>
          <button
            type="button"
            class="flex w-full items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Calendar class="h-4 w-4" />
            预约培训
            <ExternalLink class="ml-auto h-3 w-3" />
          </button>
          <button
            type="button"
            class="flex w-full items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <FolderOpen class="h-4 w-4" />
            下载资源
            <ExternalLink class="ml-auto h-3 w-3" />
          </button>
        </CardContent>
      </Card>

      <!-- 版本信息 -->
      <Card>
        <CardContent class="pt-6">
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">文档版本</span>
            <Badge variant="secondary">v1.0.0</Badge>
          </div>
          <Separator class="my-3" />
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">最后更新</span>
            <span class="text-sm">2024-01-15</span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
