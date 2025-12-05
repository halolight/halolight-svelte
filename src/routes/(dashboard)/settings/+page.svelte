<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Switch } from '$lib/components/ui/switch/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card/index.js';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { uiSettings } from '$lib/stores/ui-settings.svelte.js';
  import { User, Bell, Shield, Palette, Save } from 'lucide-svelte';

  // 账户设置
  let profile = $state({
    nickname: '管理员',
    email: 'admin@halolight.h7ml.cn',
    phone: '138****8888',
    bio: '这是一段个人简介',
  });

  // 通知设置
  let notifications = $state({
    email: true,
    browser: true,
    mobile: false,
    newMessage: true,
    systemUpdate: true,
    marketing: false,
  });

  // 保存设置
  function saveProfile() {
    alert('设置已保存');
  }

  function saveNotifications() {
    alert('通知设置已保存');
  }
</script>

<svelte:head>
  <title>系统设置 - Admin Pro</title>
</svelte:head>

<div class="space-y-6">
  <!-- 页面标题 -->
  <div>
    <h1 class="text-2xl font-bold tracking-tight">系统设置</h1>
    <p class="text-muted-foreground">管理您的账户设置和偏好</p>
  </div>

  <Tabs value="profile" class="space-y-4">
    <TabsList>
      <TabsTrigger value="profile">
        <User class="mr-2 h-4 w-4" />
        个人资料
      </TabsTrigger>
      <TabsTrigger value="notifications">
        <Bell class="mr-2 h-4 w-4" />
        通知设置
      </TabsTrigger>
      <TabsTrigger value="appearance">
        <Palette class="mr-2 h-4 w-4" />
        外观设置
      </TabsTrigger>
      <TabsTrigger value="security">
        <Shield class="mr-2 h-4 w-4" />
        安全设置
      </TabsTrigger>
    </TabsList>

    <!-- 个人资料 -->
    <TabsContent value="profile">
      <Card>
        <CardHeader>
          <CardTitle>个人资料</CardTitle>
          <CardDescription>更新您的个人信息</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="nickname">昵称</Label>
              <Input id="nickname" bind:value={profile.nickname} placeholder="请输入昵称" />
            </div>
            <div class="space-y-2">
              <Label for="email">邮箱</Label>
              <Input id="email" type="email" bind:value={profile.email} placeholder="请输入邮箱" />
            </div>
            <div class="space-y-2">
              <Label for="phone">手机号</Label>
              <Input id="phone" bind:value={profile.phone} placeholder="请输入手机号" />
            </div>
          </div>
          <div class="space-y-2">
            <Label for="bio">个人简介</Label>
            <Textarea id="bio" bind:value={profile.bio} placeholder="请输入个人简介" rows={4} />
          </div>
          <Button onclick={saveProfile}>
            <Save class="mr-2 h-4 w-4" />
            保存更改
          </Button>
        </CardContent>
      </Card>
    </TabsContent>

    <!-- 通知设置 -->
    <TabsContent value="notifications">
      <Card>
        <CardHeader>
          <CardTitle>通知设置</CardTitle>
          <CardDescription>配置您的通知偏好</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div>
            <h4 class="text-sm font-medium mb-4">通知渠道</h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <Label>邮件通知</Label>
                  <p class="text-sm text-muted-foreground">接收重要通知到邮箱</p>
                </div>
                <Switch bind:checked={notifications.email} />
              </div>
              <Separator />
              <div class="flex items-center justify-between">
                <div>
                  <Label>浏览器通知</Label>
                  <p class="text-sm text-muted-foreground">在浏览器中接收推送通知</p>
                </div>
                <Switch bind:checked={notifications.browser} />
              </div>
              <Separator />
              <div class="flex items-center justify-between">
                <div>
                  <Label>手机通知</Label>
                  <p class="text-sm text-muted-foreground">接收手机推送通知</p>
                </div>
                <Switch bind:checked={notifications.mobile} />
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-medium mb-4">通知类型</h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <Label>新消息</Label>
                  <p class="text-sm text-muted-foreground">有新消息时通知</p>
                </div>
                <Switch bind:checked={notifications.newMessage} />
              </div>
              <Separator />
              <div class="flex items-center justify-between">
                <div>
                  <Label>系统更新</Label>
                  <p class="text-sm text-muted-foreground">系统更新和维护通知</p>
                </div>
                <Switch bind:checked={notifications.systemUpdate} />
              </div>
              <Separator />
              <div class="flex items-center justify-between">
                <div>
                  <Label>营销通知</Label>
                  <p class="text-sm text-muted-foreground">促销和活动通知</p>
                </div>
                <Switch bind:checked={notifications.marketing} />
              </div>
            </div>
          </div>

          <Button onclick={saveNotifications}>
            <Save class="mr-2 h-4 w-4" />
            保存设置
          </Button>
        </CardContent>
      </Card>
    </TabsContent>

    <!-- 外观设置 -->
    <TabsContent value="appearance">
      <Card>
        <CardHeader>
          <CardTitle>外观设置</CardTitle>
          <CardDescription>自定义应用外观</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="space-y-4">
            <div class="space-y-2">
              <Label>主题模式</Label>
              <div class="flex flex-wrap gap-2">
                <Button
                  variant={uiSettings.theme === 'light' ? 'default' : 'outline'}
                  onclick={() => uiSettings.setTheme('light')}
                >
                  浅色
                </Button>
                <Button
                  variant={uiSettings.theme === 'dark' ? 'default' : 'outline'}
                  onclick={() => uiSettings.setTheme('dark')}
                >
                  深色
                </Button>
                <Button
                  variant={uiSettings.theme === 'system' ? 'default' : 'outline'}
                  onclick={() => uiSettings.setTheme('system')}
                >
                  跟随系统
                </Button>
              </div>
              <p class="text-sm text-muted-foreground">选择应用的主题模式</p>
            </div>

            <Separator />

            <div class="flex items-center justify-between">
              <div>
                <Label>显示标签栏</Label>
                <p class="text-sm text-muted-foreground">在页面顶部显示标签页导航</p>
              </div>
              <Switch
                checked={uiSettings.showTabBar}
                onCheckedChange={() => uiSettings.toggleTabBar()}
              />
            </div>

            <Separator />

            <div class="flex items-center justify-between">
              <div>
                <Label>显示页脚</Label>
                <p class="text-sm text-muted-foreground">在页面底部显示页脚</p>
              </div>
              <Switch checked={uiSettings.showFooter} />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <!-- 安全设置 -->
    <TabsContent value="security">
      <Card>
        <CardHeader>
          <CardTitle>安全设置</CardTitle>
          <CardDescription>管理您的账户安全</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 class="font-medium">修改密码</h4>
                <p class="text-sm text-muted-foreground">定期更新密码以保护账户安全</p>
              </div>
              <Button variant="outline">修改</Button>
            </div>

            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 class="font-medium">两步验证</h4>
                <p class="text-sm text-muted-foreground">启用两步验证增强账户安全</p>
              </div>
              <Button variant="outline">设置</Button>
            </div>

            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 class="font-medium">登录设备</h4>
                <p class="text-sm text-muted-foreground">查看和管理已登录的设备</p>
              </div>
              <Button variant="outline">查看</Button>
            </div>

            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 class="font-medium">登录历史</h4>
                <p class="text-sm text-muted-foreground">查看近期的登录记录</p>
              </div>
              <Button variant="outline">查看</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</div>
