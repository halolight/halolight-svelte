<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card/index.js';
  import { authService } from '$lib/api/index.js';
  import { Lock } from 'lucide-svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let password = $state('');
  let confirmPassword = $state('');
  let isSubmitting = $state(false);
  let error = $state('');
  let success = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';

    // 客户端验证
    if (!password || !confirmPassword) {
      error = '请填写所有字段';
      return;
    }

    if (password.length < 8) {
      error = '密码长度至少为 8 位';
      return;
    }

    if (password !== confirmPassword) {
      error = '两次输入的密码不一致';
      return;
    }

    isSubmitting = true;

    try {
      await authService.resetPassword({
        token: data.token,
        password,
        confirmPassword,
      });

      success = true;

      // 3秒后跳转到登录页
      setTimeout(() => {
        goto('/auth/login');
      }, 3000);
    } catch (err: any) {
      error = err?.message || '重置密码失败，请重试';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>重置密码 - Admin Pro</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
  <Card class="w-full max-w-md">
    <CardHeader class="space-y-1">
      <div class="flex items-center justify-center mb-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Lock class="h-6 w-6 text-primary" />
        </div>
      </div>
      <CardTitle class="text-2xl font-bold text-center">重置密码</CardTitle>
      <CardDescription class="text-center">请输入您的新密码</CardDescription>
    </CardHeader>

    <CardContent>
      {#if success}
        <div class="rounded-lg bg-green-50 p-4 text-green-800">
          <p class="font-medium">密码重置成功！</p>
          <p class="text-sm mt-1">正在跳转到登录页面...</p>
        </div>
      {:else}
        <form onsubmit={handleSubmit} class="space-y-4">
          {#if error}
            <div class="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          {/if}

          <div class="space-y-2">
            <Label for="password">新密码</Label>
            <Input
              id="password"
              type="password"
              placeholder="请输入新密码（至少8位）"
              bind:value={password}
              disabled={isSubmitting}
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="confirmPassword">确认密码</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              bind:value={confirmPassword}
              disabled={isSubmitting}
              required
            />
          </div>

          <Button type="submit" class="w-full" disabled={isSubmitting}>
            {isSubmitting ? '重置中...' : '重置密码'}
          </Button>

          <div class="text-center text-sm">
            <a href="/auth/login" class="text-primary hover:underline"> 返回登录 </a>
          </div>
        </form>
      {/if}
    </CardContent>
  </Card>
</div>
