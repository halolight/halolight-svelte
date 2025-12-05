<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import { Separator } from '$lib/components/ui/separator';
  import { Switch } from '$lib/components/ui/switch';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
  import { authStore } from '$lib/stores/auth.svelte.js';
  import {
    Bell,
    Building,
    Camera,
    Key,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Shield,
    User,
  } from 'lucide-svelte';

  const user = $derived(authStore.user);

  let isLoading = $state(false);
  const profileData = $derived({
    name: user?.name || '管理员',
    email: user?.email || 'admin@halolight.h7ml.cn',
    phone: '138-8888-8888',
    address: '北京市朝阳区',
    company: '科技有限公司',
    bio: '热爱技术，专注于后台管理系统开发',
  });

  let editableProfile = $state({
    name: '',
    email: '',
    phone: '138-8888-8888',
    address: '北京市朝阳区',
    company: '科技有限公司',
    bio: '热爱技术，专注于后台管理系统开发',
  });

  $effect(() => {
    editableProfile.name = profileData.name;
    editableProfile.email = profileData.email;
  });

  let securitySettings = $state({
    twoFactor: false,
    loginAlert: true,
    sessionTimeout: true,
  });

  let notificationSettings = $state({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });

  const loginHistory = [
    { device: 'Chrome - macOS', location: '北京, 中国', time: '当前会话', current: true },
    { device: 'Safari - iOS', location: '北京, 中国', time: '2 小时前', current: false },
    { device: 'Firefox - Windows', location: '上海, 中国', time: '昨天', current: false },
  ];

  async function handleProfileSubmit(e: Event) {
    e.preventDefault();
    isLoading = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    isLoading = false;
  }
</script>

<svelte:head>
  <title>个人资料 - {import.meta.env.VITE_APP_TITLE || 'Admin Pro'}</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-bold tracking-tight">个人资料</h1>
  </div>

  <Tabs value="profile" class="space-y-6">
    <TabsList>
      <TabsTrigger value="profile">
        <User class="mr-2 h-4 w-4" />
        基本信息
      </TabsTrigger>
      <TabsTrigger value="security">
        <Shield class="mr-2 h-4 w-4" />
        安全设置
      </TabsTrigger>
      <TabsTrigger value="notifications">
        <Bell class="mr-2 h-4 w-4" />
        通知偏好
      </TabsTrigger>
    </TabsList>

    <TabsContent value="profile">
      <div class="grid gap-6 md:grid-cols-3">
        <!-- 头像卡片 -->
        <Card>
          <CardHeader>
            <CardTitle>头像</CardTitle>
            <CardDescription>点击上传新头像</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col items-center gap-4">
            <div class="group relative cursor-pointer">
              <Avatar class="h-32 w-32">
                <AvatarImage src={user?.avatar} alt="头像" />
                <AvatarFallback class="text-3xl">
                  {editableProfile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div
                class="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Camera class="h-8 w-8 text-white" />
              </div>
            </div>
            <div class="text-center">
              <p class="font-medium">{editableProfile.name}</p>
              <p class="text-sm text-muted-foreground">{editableProfile.email}</p>
            </div>
            <Button variant="outline" size="sm">
              <Camera class="mr-2 h-4 w-4" />
              更换头像
            </Button>
          </CardContent>
        </Card>

        <!-- 基本信息表单 -->
        <Card class="md:col-span-2">
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>更新您的个人信息</CardDescription>
          </CardHeader>
          <CardContent>
            <form onsubmit={handleProfileSubmit} class="space-y-4">
              <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <label for="name" class="text-sm font-medium">姓名</label>
                  <div class="relative">
                    <User
                      class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input id="name" class="pl-10" bind:value={editableProfile.name} />
                  </div>
                </div>
                <div class="space-y-2">
                  <label for="email" class="text-sm font-medium">邮箱</label>
                  <div class="relative">
                    <Mail
                      class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="email"
                      type="email"
                      class="pl-10"
                      bind:value={editableProfile.email}
                    />
                  </div>
                </div>
                <div class="space-y-2">
                  <label for="phone" class="text-sm font-medium">电话</label>
                  <div class="relative">
                    <Phone
                      class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input id="phone" class="pl-10" bind:value={editableProfile.phone} />
                  </div>
                </div>
                <div class="space-y-2">
                  <label for="company" class="text-sm font-medium">公司</label>
                  <div class="relative">
                    <Building
                      class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input id="company" class="pl-10" bind:value={editableProfile.company} />
                  </div>
                </div>
              </div>
              <div class="space-y-2">
                <label for="address" class="text-sm font-medium">地址</label>
                <div class="relative">
                  <MapPin
                    class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input id="address" class="pl-10" bind:value={editableProfile.address} />
                </div>
              </div>
              <div class="space-y-2">
                <label for="bio" class="text-sm font-medium">个人简介</label>
                <Textarea id="bio" rows={3} bind:value={editableProfile.bio} />
              </div>
              <div class="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {#if isLoading}
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  {:else}
                    保存更改
                  {/if}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </TabsContent>

    <TabsContent value="security">
      <div class="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>密码</CardTitle>
            <CardDescription>更改您的账户密码</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-4 md:grid-cols-3">
              <div class="space-y-2">
                <label for="current-password" class="text-sm font-medium">当前密码</label>
                <Input id="current-password" type="password" />
              </div>
              <div class="space-y-2">
                <label for="new-password" class="text-sm font-medium">新密码</label>
                <Input id="new-password" type="password" />
              </div>
              <div class="space-y-2">
                <label for="confirm-password" class="text-sm font-medium">确认新密码</label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
            <div class="flex justify-end">
              <Button>
                <Key class="mr-2 h-4 w-4" />
                更新密码
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>安全选项</CardTitle>
            <CardDescription>管理您的账户安全设置</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <label for="two-factor" class="text-sm font-medium">双因素认证</label>
                <p class="text-sm text-muted-foreground">启用后登录时需要额外验证</p>
              </div>
              <Switch id="two-factor" bind:checked={securitySettings.twoFactor} />
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <label for="login-alert" class="text-sm font-medium">登录提醒</label>
                <p class="text-sm text-muted-foreground">新设备登录时发送邮件通知</p>
              </div>
              <Switch id="login-alert" bind:checked={securitySettings.loginAlert} />
            </div>
            <Separator />
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <label for="session-timeout" class="text-sm font-medium">会话超时</label>
                <p class="text-sm text-muted-foreground">30分钟无操作自动退出登录</p>
              </div>
              <Switch id="session-timeout" bind:checked={securitySettings.sessionTimeout} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>登录历史</CardTitle>
            <CardDescription>最近的登录活动</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              {#each loginHistory as session (session.time)}
                <div class="flex items-center justify-between">
                  <div class="space-y-1">
                    <p class="font-medium">{session.device}</p>
                    <p class="text-sm text-muted-foreground">
                      {session.location} · {session.time}
                    </p>
                  </div>
                  {#if session.current}
                    <Badge variant="secondary">当前</Badge>
                  {:else}
                    <Button variant="ghost" size="sm">撤销</Button>
                  {/if}
                </div>
              {/each}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>

    <TabsContent value="notifications">
      <Card>
        <CardHeader>
          <CardTitle>通知偏好</CardTitle>
          <CardDescription>选择您希望接收通知的方式</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <label for="notify-email" class="text-sm font-medium">邮件通知</label>
              <p class="text-sm text-muted-foreground">通过邮件接收重要通知</p>
            </div>
            <Switch id="notify-email" bind:checked={notificationSettings.email} />
          </div>
          <Separator />
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <label for="notify-push" class="text-sm font-medium">推送通知</label>
              <p class="text-sm text-muted-foreground">在浏览器中接收推送通知</p>
            </div>
            <Switch id="notify-push" bind:checked={notificationSettings.push} />
          </div>
          <Separator />
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <label for="notify-sms" class="text-sm font-medium">短信通知</label>
              <p class="text-sm text-muted-foreground">通过短信接收紧急通知</p>
            </div>
            <Switch id="notify-sms" bind:checked={notificationSettings.sms} />
          </div>
          <Separator />
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <label for="notify-marketing" class="text-sm font-medium">营销邮件</label>
              <p class="text-sm text-muted-foreground">接收产品更新和促销信息</p>
            </div>
            <Switch id="notify-marketing" bind:checked={notificationSettings.marketing} />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</div>
