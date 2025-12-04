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
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Tabs, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import {
    AlertCircle,
    Bell,
    Check,
    ClipboardList,
    Info,
    MessageSquare,
    MoreHorizontal,
    Settings,
    Trash2,
    User,
  } from 'lucide-svelte';

  type NotificationType = 'system' | 'message' | 'task' | 'alert';

  interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    content: string;
    read: boolean;
    createdAt: string;
  }

  const typeIcons: Record<NotificationType, typeof Info> = {
    system: Info,
    message: MessageSquare,
    task: ClipboardList,
    alert: AlertCircle,
  };

  const typeColors: Record<NotificationType, string> = {
    system: 'text-blue-500 bg-blue-500/10',
    message: 'text-purple-500 bg-purple-500/10',
    task: 'text-green-500 bg-green-500/10',
    alert: 'text-orange-500 bg-orange-500/10',
  };

  // 模拟通知数据
  let notifications = $state<Notification[]>([
    {
      id: '1',
      type: 'system',
      title: '系统更新通知',
      content: '系统将于今晚 22:00 进行维护升级，预计耗时 2 小时，请提前做好准备。',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: '2',
      type: 'message',
      title: '新消息提醒',
      content: '张三给您发送了一条新消息，点击查看详情。',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '3',
      type: 'task',
      title: '任务完成提醒',
      content: '您指派给李四的任务「完成产品需求文档」已完成审核。',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: '4',
      type: 'alert',
      title: '安全警告',
      content: '检测到您的账号在新设备上登录，如非本人操作，请立即修改密码。',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: '5',
      type: 'system',
      title: '功能上线通知',
      content: '新版本已上线，新增了数据导出功能，欢迎体验。',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: '6',
      type: 'message',
      title: '评论回复',
      content: '王五回复了您在「项目进度报告」中的评论。',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ]);

  let filter = $state<'all' | 'unread'>('all');

  const unreadCount = $derived(notifications.filter((n) => !n.read).length);
  const filteredNotifications = $derived(
    filter === 'all' ? notifications : notifications.filter((n) => !n.read)
  );

  const systemCount = $derived(
    notifications.filter((n) => n.type === 'system' || n.type === 'alert').length
  );
  const messageCount = $derived(notifications.filter((n) => n.type === 'message').length);

  function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 7) return `${days} 天前`;
    return date.toLocaleDateString('zh-CN');
  }

  function handleMarkAsRead(id: string) {
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  }

  function handleMarkAllAsRead() {
    notifications = notifications.map((n) => ({ ...n, read: true }));
  }

  function handleDelete(id: string) {
    notifications = notifications.filter((n) => n.id !== id);
  }
</script>

<svelte:head>
  <title>通知中心 - {import.meta.env.VITE_APP_TITLE || 'Admin Pro'}</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">通知中心</h1>
    </div>
    <div class="flex gap-2">
      <Button variant="outline" onclick={handleMarkAllAsRead} disabled={unreadCount === 0}>
        <Check class="mr-2 h-4 w-4" />
        全部已读
      </Button>
    </div>
  </div>

  <div class="grid gap-6 md:grid-cols-4">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between pb-2">
        <CardTitle class="text-sm font-medium">全部通知</CardTitle>
        <Bell class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{notifications.length}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between pb-2">
        <CardTitle class="text-sm font-medium">未读通知</CardTitle>
        <Badge variant="destructive">{unreadCount}</Badge>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{unreadCount}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between pb-2">
        <CardTitle class="text-sm font-medium">系统通知</CardTitle>
        <Settings class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{systemCount}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between pb-2">
        <CardTitle class="text-sm font-medium">消息通知</CardTitle>
        <User class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{messageCount}</div>
      </CardContent>
    </Card>
  </div>

  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle>通知列表</CardTitle>
          <CardDescription>所有系统和用户通知</CardDescription>
        </div>
        <Tabs bind:value={filter}>
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="unread">
              未读
              {#if unreadCount > 0}
                <Badge variant="secondary" class="ml-2">{unreadCount}</Badge>
              {/if}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </CardHeader>
    <CardContent>
      {#if filteredNotifications.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-center">
          <Bell class="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p class="text-muted-foreground">暂无通知</p>
        </div>
      {:else}
        <ScrollArea class="h-[60vh] pr-4">
          <div class="space-y-2">
            {#each filteredNotifications as notification (notification.id)}
              {@const Icon = typeIcons[notification.type]}
              <div
                class="flex items-start gap-4 rounded-lg border p-4 transition-colors {!notification.read
                  ? 'bg-muted/50'
                  : ''}"
              >
                <div class="rounded-full p-2 {typeColors[notification.type]}">
                  <Icon class="h-4 w-4" />
                </div>
                <div class="flex-1 space-y-1">
                  <div class="flex items-center gap-2">
                    <p class="font-medium">{notification.title}</p>
                    {#if !notification.read}
                      <Badge variant="default" class="h-5">新</Badge>
                    {/if}
                  </div>
                  <p class="text-sm text-muted-foreground">
                    {notification.content}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content align="end">
                    {#if !notification.read}
                      <DropdownMenu.Item onclick={() => handleMarkAsRead(notification.id)}>
                        <Check class="mr-2 h-4 w-4" />
                        标记已读
                      </DropdownMenu.Item>
                    {/if}
                    <DropdownMenu.Item
                      class="text-destructive"
                      onclick={() => handleDelete(notification.id)}
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      删除
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
            {/each}
          </div>
        </ScrollArea>
      {/if}
    </CardContent>
  </Card>
</div>
