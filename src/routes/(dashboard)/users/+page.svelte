<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar/index.js';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
  } from '$lib/components/ui/dropdown-menu/index.js';
  import { userService } from '$lib/api/index.js';
  import type { UserDetail, UserStats, UserStatus } from '$lib/types/users.js';
  import {
    Search,
    Plus,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Users,
    UserCheck,
    UserX,
    Ban,
    RefreshCw,
  } from 'lucide-svelte';

  // 状态
  let users = $state<UserDetail[]>([]);
  let stats = $state<UserStats | null>(null);
  let loading = $state(true);
  let keyword = $state('');
  let statusFilter = $state<string>('all');
  let page = $state(1);
  let pageSize = $state(10);
  let total = $state(0);
  let totalPages = $state(0);

  // 获取用户列表
  async function fetchUsers() {
    loading = true;
    try {
      const response = await userService.getUsers({
        page,
        pageSize,
        keyword: keyword || undefined,
        status: statusFilter === 'all' ? undefined : (statusFilter as UserStatus),
      });
      users = response.data.list;
      total = response.data.total;
      totalPages = response.data.totalPages;
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      loading = false;
    }
  }

  // 获取用户统计
  async function fetchStats() {
    try {
      const response = await userService.getUserStats();
      stats = response.data;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }

  // 搜索
  function handleSearch() {
    page = 1;
    fetchUsers();
  }

  // 删除用户
  async function handleDelete(userId: string) {
    if (!confirm('确定要删除该用户吗？')) return;
    try {
      await userService.deleteUser(userId);
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  }

  // 状态变体样式
  function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'banned':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  // 状态文本
  function getStatusText(status: string): string {
    switch (status) {
      case 'active':
        return '正常';
      case 'inactive':
        return '未激活';
      case 'banned':
        return '已禁用';
      default:
        return status;
    }
  }

  // 初始化
  onMount(() => {
    fetchUsers();
    fetchStats();
  });

  // 监听筛选变化
  $effect(() => {
    if (statusFilter) {
      page = 1;
      fetchUsers();
    }
  });
</script>

<svelte:head>
  <title>用户管理 - Admin Pro</title>
</svelte:head>

<div class="space-y-6">
  <!-- 页面标题 -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">用户管理</h1>
      <p class="text-muted-foreground">管理系统用户，查看用户信息和活动</p>
    </div>
    <Button>
      <Plus class="mr-2 h-4 w-4" />
      新建用户
    </Button>
  </div>

  <!-- 统计卡片 -->
  {#if stats}
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">总用户数</CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{stats.total}</div>
          <p class="text-xs text-muted-foreground">本月新增 {stats.newThisMonth} 人</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">活跃用户</CardTitle>
          <UserCheck class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{stats.active}</div>
          <p class="text-xs text-muted-foreground">当前在线 {stats.onlineNow} 人</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">未激活用户</CardTitle>
          <UserX class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{stats.inactive}</div>
          <p class="text-xs text-muted-foreground">待激活账号</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">禁用用户</CardTitle>
          <Ban class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{stats.banned}</div>
          <p class="text-xs text-muted-foreground">已禁用账号</p>
        </CardContent>
      </Card>
    </div>
  {/if}

  <!-- 搜索和筛选 -->
  <Card>
    <CardContent class="pt-6">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-1 items-center gap-2">
          <div class="relative flex-1 md:max-w-sm">
            <Search
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="搜索用户名、邮箱..."
              bind:value={keyword}
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <select
            bind:value={statusFilter}
            class="flex h-10 w-[140px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">全部状态</option>
            <option value="active">正常</option>
            <option value="inactive">未激活</option>
            <option value="banned">已禁用</option>
          </select>
          <Button variant="outline" onclick={handleSearch}>
            <Search class="mr-2 h-4 w-4" />
            搜索
          </Button>
        </div>
        <Button variant="outline" onclick={() => fetchUsers()}>
          <RefreshCw class="mr-2 h-4 w-4" />
          刷新
        </Button>
      </div>
    </CardContent>
  </Card>

  <!-- 用户列表 -->
  <Card>
    <CardContent class="p-0">
      {#if loading}
        <div class="flex items-center justify-center py-12">
          <RefreshCw class="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      {:else if users.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Users class="h-12 w-12 mb-4" />
          <p>暂无用户数据</p>
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b bg-muted/50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-medium">用户</th>
                <th class="px-4 py-3 text-left text-sm font-medium">邮箱</th>
                <th class="px-4 py-3 text-left text-sm font-medium">部门</th>
                <th class="px-4 py-3 text-left text-sm font-medium">状态</th>
                <th class="px-4 py-3 text-left text-sm font-medium">最后登录</th>
                <th class="px-4 py-3 text-right text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              {#each users as user (user.id)}
                <tr class="hover:bg-muted/50">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <Avatar class="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.nickname} />
                        <AvatarFallback>{user.nickname?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div class="font-medium">{user.nickname}</div>
                        <div class="text-sm text-muted-foreground">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm">{user.email}</td>
                  <td class="px-4 py-3 text-sm">{user.department || '-'}</td>
                  <td class="px-4 py-3">
                    <Badge variant={getStatusVariant(user.status)}>
                      {getStatusText(user.status)}
                    </Badge>
                  </td>
                  <td class="px-4 py-3 text-sm text-muted-foreground">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('zh-CN') : '-'}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye class="mr-2 h-4 w-4" />
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit class="mr-2 h-4 w-4" />
                          编辑用户
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          class="text-destructive"
                          onclick={() => handleDelete(user.id)}
                        >
                          <Trash2 class="mr-2 h-4 w-4" />
                          删除用户
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="flex items-center justify-between border-t px-4 py-3">
          <div class="text-sm text-muted-foreground">
            共 {total} 条记录，第 {page}/{totalPages} 页
          </div>
          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onclick={() => {
                page--;
                fetchUsers();
              }}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onclick={() => {
                page++;
                fetchUsers();
              }}
            >
              下一页
            </Button>
          </div>
        </div>
      {/if}
    </CardContent>
  </Card>
</div>
