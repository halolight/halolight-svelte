<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar/index.js';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
  import { httpClient } from '$lib/api/index.js';
  import type { Message, MessageStats } from '$lib/types/messages.js';
  import {
    Search,
    Mail,
    MailOpen,
    Archive,
    Trash2,
    RefreshCw,
    Send,
    Bell,
    AlertCircle,
    CheckCircle,
  } from 'lucide-svelte';

  // 状态
  let messages = $state<Message[]>([]);
  let stats = $state<MessageStats | null>(null);
  let loading = $state(true);
  let keyword = $state('');
  let statusFilter = $state<string>('all');
  let typeFilter = $state<string>('all');
  let page = $state(1);
  let pageSize = $state(10);
  let total = $state(0);
  let totalPages = $state(0);
  let selectedTab = $state('inbox');

  // 获取消息列表
  async function fetchMessages() {
    loading = true;
    try {
      const response = await httpClient.get<any>('/messages', {
        page,
        pageSize,
        keyword: keyword || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        type: typeFilter === 'all' ? undefined : typeFilter,
      });
      messages = response.data.list;
      total = response.data.total;
      totalPages = response.data.totalPages;
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      loading = false;
    }
  }

  // 获取消息统计
  async function fetchStats() {
    try {
      const response = await httpClient.get<MessageStats>('/messages/stats');
      stats = response.data;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }

  // 标记已读
  async function markAsRead(messageId: string) {
    try {
      await httpClient.put(`/messages/${messageId}/read`);
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }

  // 删除消息
  async function deleteMessage(messageId: string) {
    if (!confirm('确定要删除该消息吗？')) return;
    try {
      await httpClient.delete(`/messages/${messageId}`);
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  }

  // 优先级样式
  function getPriorityVariant(
    priority: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'normal':
        return 'secondary';
      default:
        return 'outline';
    }
  }

  // 优先级文本
  function getPriorityText(priority: string): string {
    switch (priority) {
      case 'urgent':
        return '紧急';
      case 'high':
        return '高';
      case 'normal':
        return '普通';
      case 'low':
        return '低';
      default:
        return priority;
    }
  }

  // 类型图标
  function getTypeIcon(type: string) {
    switch (type) {
      case 'system':
        return Bell;
      case 'notification':
        return AlertCircle;
      case 'announcement':
        return CheckCircle;
      default:
        return Mail;
    }
  }

  // 初始化
  onMount(() => {
    fetchMessages();
    fetchStats();
  });

  // 监听筛选变化
  $effect(() => {
    if (statusFilter || typeFilter) {
      page = 1;
      fetchMessages();
    }
  });
</script>

<svelte:head>
  <title>消息中心 - Admin Pro</title>
</svelte:head>

<div class="space-y-6">
  <!-- 页面标题 -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">消息中心</h1>
      <p class="text-muted-foreground">管理系统消息和通知</p>
    </div>
    <Button>
      <Send class="mr-2 h-4 w-4" />
      发送消息
    </Button>
  </div>

  <!-- 统计卡片 -->
  {#if stats}
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">总消息数</CardTitle>
          <Mail class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">未读消息</CardTitle>
          <Mail class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-primary">{stats.unread}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">已读消息</CardTitle>
          <MailOpen class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{stats.read}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">已归档</CardTitle>
          <Archive class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{stats.archived}</div>
        </CardContent>
      </Card>
    </div>
  {/if}

  <!-- 消息列表 -->
  <Tabs bind:value={selectedTab}>
    <div class="flex items-center justify-between">
      <TabsList>
        <TabsTrigger value="inbox">收件箱</TabsTrigger>
        <TabsTrigger value="sent">已发送</TabsTrigger>
        <TabsTrigger value="archived">已归档</TabsTrigger>
      </TabsList>

      <div class="flex items-center gap-2">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索消息..."
            bind:value={keyword}
            class="flex h-10 w-64 rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && fetchMessages()}
          />
        </div>
        <select
          bind:value={typeFilter}
          class="flex h-10 w-[120px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="all">全部类型</option>
          <option value="system">系统消息</option>
          <option value="user">用户消息</option>
          <option value="notification">通知</option>
          <option value="announcement">公告</option>
        </select>
        <Button variant="outline" size="sm" onclick={() => fetchMessages()}>
          <RefreshCw class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <TabsContent value="inbox" class="mt-4">
      <Card>
        <CardContent class="p-0">
          {#if loading}
            <div class="flex items-center justify-center py-12">
              <RefreshCw class="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          {:else if messages.length === 0}
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Mail class="h-12 w-12 mb-4" />
              <p>暂无消息</p>
            </div>
          {:else}
            <div class="divide-y">
              {#each messages as message (message.id)}
                {@const TypeIcon = getTypeIcon(message.type)}
                <div
                  class="flex items-start gap-4 p-4 hover:bg-muted/50 cursor-pointer {message.status ===
                  'unread'
                    ? 'bg-primary/5'
                    : ''}"
                >
                  <Avatar class="h-10 w-10">
                    <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                    <AvatarFallback>
                      <TypeIcon class="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium truncate">{message.senderName}</span>
                      <Badge variant={getPriorityVariant(message.priority)} class="text-xs">
                        {getPriorityText(message.priority)}
                      </Badge>
                      {#if message.status === 'unread'}
                        <span class="h-2 w-2 rounded-full bg-primary"></span>
                      {/if}
                    </div>
                    <h4 class="font-medium text-sm mb-1 truncate">{message.subject}</h4>
                    <p class="text-sm text-muted-foreground line-clamp-1">{message.content}</p>
                    <div class="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{new Date(message.createdAt).toLocaleString('zh-CN')}</span>
                      {#if message.attachments && message.attachments.length > 0}
                        <span>{message.attachments.length} 个附件</span>
                      {/if}
                    </div>
                  </div>
                  <div class="flex items-center gap-1">
                    {#if message.status === 'unread'}
                      <Button variant="ghost" size="sm" onclick={() => markAsRead(message.id)}>
                        <MailOpen class="h-4 w-4" />
                      </Button>
                    {/if}
                    <Button
                      variant="ghost"
                      size="sm"
                      class="text-destructive"
                      onclick={() => deleteMessage(message.id)}
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              {/each}
            </div>

            <!-- 分页 -->
            <div class="flex items-center justify-between border-t px-4 py-3">
              <div class="text-sm text-muted-foreground">
                共 {total} 条消息，第 {page}/{totalPages} 页
              </div>
              <div class="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onclick={() => {
                    page--;
                    fetchMessages();
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
                    fetchMessages();
                  }}
                >
                  下一页
                </Button>
              </div>
            </div>
          {/if}
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="sent" class="mt-4">
      <Card>
        <CardContent class="py-12 text-center text-muted-foreground">
          <Send class="h-12 w-12 mx-auto mb-4" />
          <p>暂无已发送消息</p>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="archived" class="mt-4">
      <Card>
        <CardContent class="py-12 text-center text-muted-foreground">
          <Archive class="h-12 w-12 mx-auto mb-4" />
          <p>暂无已归档消息</p>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</div>
