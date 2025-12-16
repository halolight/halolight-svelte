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
  import { Lock, Shield, Smartphone, Key, Eye, EyeOff, AlertTriangle } from 'lucide-svelte';

  let showCurrentPassword = $state(false);
  let showNewPassword = $state(false);
  let showConfirmPassword = $state(false);
</script>

<svelte:head>
  <title>安全设置 - {import.meta.env.VITE_APP_TITLE || 'Admin Pro'}</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-bold">安全设置</h1>
    <p class="text-muted-foreground">管理您的账户安全和登录方式</p>
  </div>

  <div class="grid gap-6">
    <!-- 修改密码 -->
    <Card>
      <CardHeader>
        <div class="flex items-center gap-2">
          <Lock class="h-5 w-5 text-primary" />
          <CardTitle>修改密码</CardTitle>
        </div>
        <CardDescription>定期更换密码可以提高账户安全性</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label for="current-password" class="text-sm font-medium">当前密码</label>
          <div class="relative">
            <Input
              id="current-password"
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="请输入当前密码"
              class="pr-10"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onclick={() => (showCurrentPassword = !showCurrentPassword)}
            >
              {#if showCurrentPassword}
                <EyeOff class="h-4 w-4" />
              {:else}
                <Eye class="h-4 w-4" />
              {/if}
            </button>
          </div>
        </div>
        <div class="space-y-2">
          <label for="new-password" class="text-sm font-medium">新密码</label>
          <div class="relative">
            <Input
              id="new-password"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="请输入新密码"
              class="pr-10"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onclick={() => (showNewPassword = !showNewPassword)}
            >
              {#if showNewPassword}
                <EyeOff class="h-4 w-4" />
              {:else}
                <Eye class="h-4 w-4" />
              {/if}
            </button>
          </div>
        </div>
        <div class="space-y-2">
          <label for="confirm-password" class="text-sm font-medium">确认新密码</label>
          <div class="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="请再次输入新密码"
              class="pr-10"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onclick={() => (showConfirmPassword = !showConfirmPassword)}
            >
              {#if showConfirmPassword}
                <EyeOff class="h-4 w-4" />
              {:else}
                <Eye class="h-4 w-4" />
              {/if}
            </button>
          </div>
        </div>
        <div class="flex justify-end pt-2">
          <Button>更新密码</Button>
        </div>
      </CardContent>
    </Card>

    <!-- 两步验证 -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Smartphone class="h-5 w-5 text-primary" />
            <CardTitle>两步验证</CardTitle>
          </div>
          <Badge variant="outline" class="text-yellow-600 border-yellow-600">未启用</Badge>
        </div>
        <CardDescription>启用两步验证为您的账户添加额外的安全保护</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex items-center justify-between rounded-lg border p-4">
          <div class="flex items-center gap-3">
            <Shield class="h-8 w-8 text-muted-foreground" />
            <div>
              <p class="font-medium">身份验证器应用</p>
              <p class="text-sm text-muted-foreground">使用 Google Authenticator 或类似应用</p>
            </div>
          </div>
          <Button variant="outline">启用</Button>
        </div>
      </CardContent>
    </Card>

    <!-- 安全密钥 -->
    <Card>
      <CardHeader>
        <div class="flex items-center gap-2">
          <Key class="h-5 w-5 text-primary" />
          <CardTitle>安全密钥</CardTitle>
        </div>
        <CardDescription>使用硬件安全密钥进行身份验证</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex items-center justify-between rounded-lg border border-dashed p-4">
          <div class="text-center flex-1">
            <p class="text-muted-foreground">暂未添加安全密钥</p>
          </div>
          <Button variant="outline">添加密钥</Button>
        </div>
      </CardContent>
    </Card>

    <!-- 登录活动 -->
    <Card>
      <CardHeader>
        <div class="flex items-center gap-2">
          <AlertTriangle class="h-5 w-5 text-primary" />
          <CardTitle>最近登录活动</CardTitle>
        </div>
        <CardDescription>查看您账户的最近登录记录</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          {#each [{ device: 'Chrome on macOS', location: '北京, 中国', time: '刚刚', current: true }, { device: 'Safari on iPhone', location: '上海, 中国', time: '2 小时前', current: false }, { device: 'Firefox on Windows', location: '深圳, 中国', time: '昨天', current: false }] as activity (activity.time)}
            <div
              class="flex items-center justify-between rounded-lg border p-3 {activity.current
                ? 'border-primary/50 bg-primary/5'
                : ''}"
            >
              <div>
                <p class="font-medium">
                  {activity.device}
                  {#if activity.current}
                    <Badge variant="secondary" class="ml-2">当前设备</Badge>
                  {/if}
                </p>
                <p class="text-sm text-muted-foreground">
                  {activity.location} · {activity.time}
                </p>
              </div>
              {#if !activity.current}
                <Button variant="ghost" size="sm" class="text-destructive">撤销</Button>
              {/if}
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>
  </div>
</div>
