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
  import { Separator } from '$lib/components/ui/separator';
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { validateRegisterForm } from '$lib/utils/validation.js';
  import {
    Eye,
    EyeOff,
    Mail,
    User,
    Lock,
    Github,
    Chrome,
    MessageCircle,
    Phone,
  } from 'lucide-svelte';

  // 读取注册开关环境变量，默认关闭
  const registrationEnabled = import.meta.env.VITE_ENABLE_REGISTRATION === 'true';

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);
  let errors = $state({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  let message = $state('');
  let messageType = $state<'success' | 'error' | ''>('');

  /**
   * 社交登录链接配置
   */
  const SOCIAL_LINKS = {
    github: 'https://github.com/halolight/halolight-svelte',
    google: 'https://halolight-docs.h7ml.cn',
    wechat: 'https://github.com/halolight',
  };

  /**
   * 处理注册表单提交
   */
  async function handleSubmit(event: Event) {
    event.preventDefault();
    message = '';
    messageType = '';
    errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    // 检查姓名
    if (!name.trim()) {
      errors.name = '姓名不能为空';
      return;
    }

    // 表单验证
    const validation = validateRegisterForm({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validation.valid) {
      validation.errors.forEach((error) => {
        if (error.includes('姓名')) errors.name = error;
        if (error.includes('邮箱')) errors.email = error;
        if (error.includes('密码')) errors.password = error;
        if (error.includes('两次输入的密码')) errors.confirmPassword = error;
      });

      return;
    }

    try {
      // 调用注册
      await authStore.register({
        name,
        email,
        password,
        confirmPassword,
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
          {#if !registrationEnabled}
            <!-- 注册已关闭 UI -->
            <div class="space-y-6 py-6">
              <!-- 主要图标和标题 -->
              <div class="flex flex-col items-center justify-center space-y-4">
                <div class="relative">
                  <div
                    class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30"
                  >
                    <Lock class="h-10 w-10 text-amber-600 dark:text-amber-500" />
                  </div>
                  <div
                    class="absolute -inset-2 rounded-full border-2 border-dashed border-amber-300/50 dark:border-amber-700/50 animate-spin-slow"
                  ></div>
                </div>

                <div class="space-y-2 text-center">
                  <h3 class="text-xl font-semibold text-foreground sm:text-2xl">注册已关闭</h3>
                  <p class="max-w-sm text-sm text-muted-foreground">
                    系统管理员已暂时关闭新用户注册功能
                  </p>
                </div>
              </div>

              <!-- 信息卡片 -->
              <div class="space-y-3">
                <div
                  class="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/50 p-4 backdrop-blur-sm transition-colors hover:border-primary/20 hover:bg-muted/80"
                >
                  <div
                    class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30"
                  >
                    <Mail class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div class="flex-1 space-y-1">
                    <p class="text-sm font-medium text-foreground">联系管理员</p>
                    <p class="text-xs text-muted-foreground">
                      如需创建账号，请通过邮件联系系统管理员
                    </p>
                  </div>
                </div>

                <div
                  class="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/50 p-4 backdrop-blur-sm transition-colors hover:border-primary/20 hover:bg-muted/80"
                >
                  <div
                    class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30"
                  >
                    <Phone class="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div class="flex-1 space-y-1">
                    <p class="text-sm font-medium text-foreground">已有账号？</p>
                    <p class="text-xs text-muted-foreground">
                      如果您已有账号，请直接登录使用系统功能
                    </p>
                  </div>
                </div>
              </div>

              <!-- 装饰性分隔线 -->
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-border/50"></div>
                </div>
                <div class="relative flex justify-center">
                  <span class="bg-card px-4 text-xs text-muted-foreground"> 感谢您的理解 </span>
                </div>
              </div>
            </div>
          {:else}
            <!-- 正常注册表单 -->
            <!-- 社交登录按钮 -->
            <div class="grid grid-cols-3 gap-2 sm:gap-3">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                class="w-full h-11 sm:h-12 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group inline-flex items-center justify-center border rounded-lg"
              >
                <Github class="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href={SOCIAL_LINKS.google}
                target="_blank"
                rel="noopener noreferrer"
                class="w-full h-11 sm:h-12 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group inline-flex items-center justify-center border rounded-lg"
              >
                <Chrome class="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href={SOCIAL_LINKS.wechat}
                target="_blank"
                rel="noopener noreferrer"
                class="w-full h-11 sm:h-12 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group inline-flex items-center justify-center border rounded-lg"
              >
                <MessageCircle class="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>

            <!-- 分隔线 -->
            <div class="relative py-3">
              <div class="absolute inset-0 flex items-center">
                <Separator class="w-full" />
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-card px-3 text-muted-foreground font-medium"> 或使用邮箱注册 </span>
              </div>
            </div>

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

            <!-- 姓名输入 -->
            <div class="space-y-2">
              <label
                for="name"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                姓名
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User class="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="请输入姓名"
                  bind:value={name}
                  class={errors.name ? 'border-red-500 pl-10' : 'pl-10'}
                  required
                />
              </div>
              {#if errors.name}
                <p class="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
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
          {/if}
        </CardContent>

        <CardFooter class="flex flex-col space-y-4">
          {#if registrationEnabled}
            <!-- 已有账户链接（注册开启时） -->
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
          {:else}
            <!-- 注册关闭时的返回登录按钮 -->
            <div class="w-full space-y-3">
              <Button
                type="button"
                onclick={goToLogin}
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                ← 返回登录
              </Button>
              <p class="text-center text-xs text-muted-foreground">使用现有账号登录系统</p>
            </div>
          {/if}
        </CardFooter>
      </form>
    </Card>

    <!-- 底部信息 -->
    {#if registrationEnabled}
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
    {/if}
  </div>
</div>

<style>
  :global(html) {
    height: 100%;
  }
  :global(body) {
    min-height: 100%;
  }

  /* 20秒慢速旋转动画 */
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  :global(.animate-spin-slow) {
    animation: spin-slow 20s linear infinite;
  }
</style>
