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
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { Camera, Mail, Phone, MapPin, Building, Briefcase } from 'lucide-svelte';

  const user = $derived(authStore.user);
</script>

<svelte:head>
  <title>个人资料 - {import.meta.env.VITE_APP_TITLE || 'Admin Pro'}</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-bold">个人资料</h1>
    <p class="text-muted-foreground">管理您的个人信息和账户设置</p>
  </div>

  <div class="grid gap-6 lg:grid-cols-3">
    <!-- 头像卡片 -->
    <Card>
      <CardHeader>
        <CardTitle>头像</CardTitle>
        <CardDescription>点击更换您的头像</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col items-center gap-4">
        <div class="relative">
          <Avatar class="h-32 w-32">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback class="text-4xl">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <button
            class="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg hover:bg-primary/90"
          >
            <Camera class="h-4 w-4" />
          </button>
        </div>
        <div class="text-center">
          <p class="font-semibold">{user?.name || '未设置姓名'}</p>
          <p class="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
        </div>
      </CardContent>
    </Card>

    <!-- 基本信息 -->
    <Card class="lg:col-span-2">
      <CardHeader>
        <CardTitle>基本信息</CardTitle>
        <CardDescription>更新您的个人基本信息</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <label for="name" class="text-sm font-medium">姓名</label>
            <Input id="name" value={user?.name || ''} placeholder="请输入姓名" />
          </div>
          <div class="space-y-2">
            <label for="phone" class="text-sm font-medium">手机号</label>
            <Input id="phone" value={user?.phone || ''} placeholder="请输入手机号" />
          </div>
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium">邮箱</label>
            <div class="relative">
              <Mail
                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input id="email" class="pl-10" value={user?.email || ''} placeholder="请输入邮箱" />
            </div>
          </div>
          <div class="space-y-2">
            <label for="phone" class="text-sm font-medium">手机号</label>
            <div class="relative">
              <Phone
                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input id="phone" class="pl-10" placeholder="请输入手机号" />
            </div>
          </div>
          <div class="space-y-2">
            <label for="department" class="text-sm font-medium">部门</label>
            <div class="relative">
              <Building
                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="department"
                class="pl-10"
                value={user?.department || ''}
                placeholder="请输入部门"
              />
            </div>
          </div>
          <div class="space-y-2">
            <label for="position" class="text-sm font-medium">职位</label>
            <div class="relative">
              <Briefcase
                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="position"
                class="pl-10"
                value={user?.position || ''}
                placeholder="请输入职位"
              />
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <label for="address" class="text-sm font-medium">地址</label>
          <div class="relative">
            <MapPin
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input id="address" class="pl-10" placeholder="请输入地址" />
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-4">
          <Button variant="outline">取消</Button>
          <Button>保存更改</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
