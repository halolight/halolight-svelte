<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { validateRegisterForm } from '$lib/utils/validation.js';
  import { Eye, EyeOff, Mail, User, Lock } from 'lucide-svelte';

  let username = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let nickname = $state('');
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);
  let errors = $state({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  let message = $state('');
  let messageType = $state<'success' | 'error' | ''>('');

  /**
   * 处理注册表单提交
   */
  async function handleSubmit(event: Event) {
    event.preventDefault();
    message = '';
    messageType = '';
    errors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
    };

    // 表单验证
    const validation = validateRegisterForm({
      username,
      email,
      password,
      confirmPassword,
    });

    if (!validation.valid) {
      validation.errors.forEach((error) => {
        if (error.includes('用户名')) errors.username = error;
        if (error.includes('邮箱')) errors.email = error;
        if (error.includes('密码')) errors.password = error;
        if (error.includes('两次输入的密码')) errors.confirmPassword = error;
      });

      // 检查昵称
      if (!nickname.trim()) {
        errors.nickname = '昵称不能为空';
      }

      return;
    }

    // 检查昵称
    if (!nickname.trim()) {
      errors.nickname = '昵称不能为空';
      return;
    }

    try {
      // 调用注册
      await authStore.register({
        username,
        email,
        password,
        nickname,
      });

      message = '注册成功！正在跳转到登录页面...';
      messageType = 'success';

      // 2秒后跳转到登录页面
      setTimeout(() => {
        goto('/auth/login');
      }, 2000);
    } catch (error) {
      message = '注册失败，请稍后再试';
      messageType = 'error';
      console.error('Registration error:', error);
    }
  }

  /**
   * 跳转到登录页面
   */
  function goToLogin() {
    goto('/auth/login');
  }
</script>

<svelte:head>
  <title>注册 - {import.meta.env.PUBLIC_APP_TITLE || 'Admin Pro'}</title>
  <meta name="description" content="创建新账户" />
</svelte:head>

<div
  class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8"
>
  <div class="max-w-md w-full space-y-8">
    <!-- Logo 和标题 -->
    <div class="text-center">
      <div
        class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600 text-white mb-4"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      </div>
      <h2 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">创建账户</h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">填写以下信息完成注册</p>
    </div>

    <!-- 注册卡片 -->
    <Card class="mt-8">
      <form onsubmit={handleSubmit}>
        <CardHeader class="space-y-1">
          <CardTitle class="text-2xl">注册</CardTitle>
          <CardDescription>创建您的新账户</CardDescription>
        </CardHeader>

        <CardContent class="space-y-4">
          <!-- 消息提示 -->
          {#if message}
            <div
              class={`p-3 rounded-md text-sm ${
                messageType === 'error'
                  ? 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                  : 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
              }`}
            >
              {message}
            </div>
          {/if}

          <!-- 用户名输入 -->
          <div class="space-y-2">
            <label
              for="username"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              用户名
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User class="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名"
                bind:value={username}
                class={errors.username ? 'border-red-500 pl-10' : 'pl-10'}
                required
              />
            </div>
            {#if errors.username}
              <p class="text-sm text-red-600 dark:text-red-400">{errors.username}</p>
            {/if}
          </div>

          <!-- 昵称输入 -->
          <div class="space-y-2">
            <label
              for="nickname"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              昵称
            </label>
            <Input
              id="nickname"
              type="text"
              placeholder="请输入昵称"
              bind:value={nickname}
              class={errors.nickname ? 'border-red-500' : ''}
              required
            />
            {#if errors.nickname}
              <p class="text-sm text-red-600 dark:text-red-400">{errors.nickname}</p>
            {/if}
          </div>

          <!-- 邮箱输入 -->
          <div class="space-y-2">
            <label
              for="email"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              邮箱地址
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="请输入邮箱地址"
                bind:value={email}
                class={errors.email ? 'border-red-500 pl-10' : 'pl-10'}
                required
              />
            </div>
            {#if errors.email}
              <p class="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            {/if}
          </div>

          <!-- 密码输入 -->
          <div class="space-y-2">
            <label
              for="password"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              密码
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                bind:value={password}
                class={errors.password ? 'border-red-500 pl-10 pr-10' : 'pl-10 pr-10'}
                required
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                onclick={() => (showPassword = !showPassword)}
              >
                {#if showPassword}
                  <EyeOff class="h-4 w-4 text-gray-400 hover:text-gray-600" />
                {:else}
                  <Eye class="h-4 w-4 text-gray-400 hover:text-gray-600" />
                {/if}
              </button>
            </div>
            {#if errors.password}
              <p class="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
            {/if}
          </div>

          <!-- 确认密码输入 -->
          <div class="space-y-2">
            <label
              for="confirmPassword"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              确认密码
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="请再次输入密码"
                bind:value={confirmPassword}
                class={errors.confirmPassword ? 'border-red-500 pl-10 pr-10' : 'pl-10 pr-10'}
                required
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                onclick={() => (showConfirmPassword = !showConfirmPassword)}
              >
                {#if showConfirmPassword}
                  <EyeOff class="h-4 w-4 text-gray-400 hover:text-gray-600" />
                {:else}
                  <Eye class="h-4 w-4 text-gray-400 hover:text-gray-600" />
                {/if}
              </button>
            </div>
            {#if errors.confirmPassword}
              <p class="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
            {/if}
          </div>
        </CardContent>

        <CardFooter class="flex flex-col space-y-4">
          <!-- 注册按钮 -->
          <Button type="submit" class="w-full" disabled={authStore.isLoading}>
            {authStore.isLoading ? '注册中...' : '注册'}
          </Button>

          <!-- 其他链接 -->
          <div class="text-center text-sm">
            已有账户？
            <button
              type="button"
              class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              onclick={goToLogin}
            >
              立即登录
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>

    <!-- 底部信息 -->
    <div class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
      <p>
        注册即表示您同意我们的
        <a
          href="/terms"
          class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >服务条款</a
        >
        和
        <a
          href="/privacy"
          class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >隐私政策</a
        >
      </p>
    </div>
  </div>
</div>

<style>
  :global(html) {
    height: 100%;
  }
  :global(body) {
    min-height: 100%;
  }
</style>
