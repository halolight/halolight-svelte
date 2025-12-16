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
  import { validateForgotPasswordForm } from '$lib/utils/validation.js';
  import { Mail } from 'lucide-svelte';

  let email = $state('');
  let errors = $state({ email: '' });
  let message = $state('');
  let messageType = $state<'success' | 'error' | ''>('');
  let isSubmitted = $state(false);

  /**
   * 处理忘记密码表单提交
   */
  async function handleSubmit(event: Event) {
    event.preventDefault();
    message = '';
    messageType = '';
    errors = { email: '' };

    // 表单验证
    const validation = validateForgotPasswordForm({ email });
    if (!validation.valid) {
      validation.errors.forEach((error) => {
        if (error.includes('邮箱')) errors.email = error;
      });
      return;
    }

    try {
      // 调用忘记密码
      await authStore.forgotPassword(email);

      message = '重置密码的邮件已发送到您的邮箱，请查收！';
      messageType = 'success';
      isSubmitted = true;

      // 5秒后跳转到登录页面
      setTimeout(() => {
        goto('/auth/login');
      }, 5000);
    } catch (error) {
      message = '发送邮件失败，请稍后再试';
      messageType = 'error';
      console.error('Forgot password error:', error);
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
  <title>忘记密码 - {import.meta.env.PUBLIC_APP_TITLE || 'Admin Pro'}</title>
  <meta name="description" content="重置您的密码" />
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
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      </div>
      <h2 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">忘记密码</h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        输入您的邮箱地址，我们将发送重置密码的链接
      </p>
    </div>

    <!-- 忘记密码卡片 -->
    <Card class="mt-8">
      <form onsubmit={handleSubmit}>
        <CardHeader class="space-y-1">
          <CardTitle class="text-2xl">重置密码</CardTitle>
          <CardDescription>通过邮箱重置您的密码</CardDescription>
        </CardHeader>

        <CardContent class="space-y-4">
          <!-- 成功消息 -->
          {#if isSubmitted}
            <div
              class="bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 p-3 rounded-md text-sm"
            >
              <div class="flex items-center">
                <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                邮件发送成功！
              </div>
              <p class="mt-2">{message}</p>
              <p class="mt-2 text-xs">5秒后将自动跳转到登录页面...</p>
            </div>
          {:else}
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
                  placeholder="请输入您的邮箱地址"
                  bind:value={email}
                  class={errors.email ? 'border-red-500 pl-10' : 'pl-10'}
                  required
                />
              </div>
              {#if errors.email}
                <p class="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              {/if}
            </div>
          {/if}
        </CardContent>

        {#if !isSubmitted}
          <CardFooter class="flex flex-col space-y-4">
            <!-- 发送按钮 -->
            <Button type="submit" class="w-full" disabled={authStore.isLoading}>
              {authStore.isLoading ? '发送中...' : '发送重置邮件'}
            </Button>

            <!-- 返回登录 -->
            <div class="text-center text-sm">
              想起密码了？
              <button
                type="button"
                class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                onclick={goToLogin}
              >
                返回登录
              </button>
            </div>
          </CardFooter>
        {/if}
      </form>
    </Card>

    <!-- 帮助信息 -->
    <div class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
      <p>
        没有收到邮件？请检查您的垃圾邮件箱，或
        <button
          type="button"
          class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          onclick={() => {
            isSubmitted = false;
            message = '';
            messageType = '';
          }}
          disabled={isSubmitted}
        >
          重新发送
        </button>
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
