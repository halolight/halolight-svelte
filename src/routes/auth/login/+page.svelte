<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
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
  import { validateLoginForm } from '$lib/utils/validation.js';
  import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
    Sparkles,
    Github,
    Chrome,
    MessageCircle,
  } from 'lucide-svelte';

  // 从环境变量获取演示账号和品牌信息
  const demoEmail = import.meta.env.VITE_DEMO_EMAIL || '';
  const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || '';
  const showDemoHint = import.meta.env.VITE_SHOW_DEMO_HINT === 'true';
  const appTitle = import.meta.env.VITE_APP_TITLE || 'Admin Pro';

  // 功能列表数据
  const features = [
    { icon: '🚀', text: '快速部署，即刻启动' },
    { icon: '📊', text: '实时数据分析与可视化' },
    { icon: '🔒', text: '企业级安全保障' },
    { icon: '⚡', text: '极致性能体验' },
  ];

  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let rememberMe = $state(false);
  let errors = $state({ email: '', password: '' });
  let message = $state('');
  let messageType = $state<'success' | 'error' | ''>('');

  // 从 URL 参数获取重定向地址
  const redirectTo = $derived($page.url.searchParams.get('redirect') || '/dashboard');

  /**
   * 填充演示账号
   */
  function fillDemoCredentials() {
    if (demoEmail && demoPassword) {
      email = demoEmail;
      password = demoPassword;
    }
  }

  /**
   * 社交登录
   */
  function handleSocialLogin(provider: string) {
    console.log(`使用 ${provider} 登录`);
  }

  /**
   * 处理登录表单提交
   */
  async function handleSubmit(event: Event) {
    event.preventDefault();
    message = '';
    messageType = '';
    errors = { email: '', password: '' };

    // 表单验证
    const validation = validateLoginForm({ username: email, password });
    if (!validation.valid) {
      validation.errors.forEach((error) => {
        if (error.includes('用户名') || error.includes('邮箱')) errors.email = error;
        if (error.includes('密码')) errors.password = error;
      });
      return;
    }

    try {
      // 调用登录
      await authStore.login(email, password, rememberMe);

      // 登录成功，跳转到指定页面
      await goto(redirectTo);
    } catch (error) {
      message = '登录失败，请检查邮箱和密码';
      messageType = 'error';
      console.error('Login error:', error);
    }
  }

  /**
   * 跳转到注册页面
   */
  function goToRegister() {
    goto('/auth/register');
  }

  /**
   * 跳转到忘记密码页面
   */
  function goToForgotPassword() {
    goto('/auth/forgot-password');
  }
</script>

<svelte:head>
  <title>登录 - {appTitle}</title>
  <meta name="description" content="登录到您的账户" />
</svelte:head>

<!-- AuthShell 风格布局 -->
<div
  class="relative min-h-screen lg:h-dvh overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
>
  <!-- 背景网格 -->
  <div
    class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"
  ></div>

  <!-- 背景光晕 -->
  <div class="absolute inset-0 pointer-events-none overflow-hidden">
    <div
      class="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl bg-gradient-to-br from-blue-400/30 to-cyan-400/30 animate-pulse"
    ></div>
    <div
      class="absolute top-1/3 -right-32 w-80 h-80 rounded-full blur-3xl bg-gradient-to-br from-indigo-400/30 to-purple-400/30 animate-pulse"
      style="animation-delay: 1s;"
    ></div>
    <div
      class="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full blur-3xl bg-gradient-to-br from-violet-400/20 to-pink-400/20 animate-pulse"
      style="animation-delay: 2s;"
    ></div>
  </div>

  <div class="relative flex min-h-screen lg:h-full flex-col lg:flex-row">
    <!-- 左侧装饰区 (仅桌面端显示) -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700"
      ></div>
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"
      ></div>

      <div class="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-12">
          <div
            class="relative h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl"
          >
            <Sparkles class="h-7 w-7" />
            <div
              class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"
            ></div>
          </div>
          <div>
            <h2 class="text-2xl font-bold tracking-tight">{appTitle}</h2>
            <p class="text-xs text-white/60">企业级管理系统</p>
          </div>
        </div>

        <!-- 标题 -->
        <h1 class="text-5xl xl:text-6xl font-bold mb-6 leading-tight">
          欢迎回来
          <span class="inline-block ml-2 animate-bounce">👋</span>
        </h1>
        <p class="text-lg text-white/70 max-w-md leading-relaxed mb-12">
          登录您的账户，开始管理您的业务数据和团队协作，体验高效的工作流程。
        </p>

        <!-- 功能列表 -->
        <div class="space-y-4">
          {#each features as item (item.text)}
            <div class="flex items-center gap-3 group">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform"
              >
                {item.icon}
              </div>
              <span class="text-white/90">{item.text}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- 浮动点 -->
      {#each Array(6) as _, i (i)}
        <div
          class="absolute w-2 h-2 rounded-full bg-white/20 animate-bounce"
          style="left: {20 + i * 15}%; top: {30 + (i % 3) * 20}%; animation-delay: {i * 0.5}s;"
        ></div>
      {/each}
    </div>

    <!-- 右侧登录区 -->
    <div class="flex-1 flex items-center justify-center px-3 sm:px-5 lg:px-10 py-2 sm:py-3 lg:py-6">
      <div class="w-full max-w-md">
        <!-- 移动端 Logo -->
        <div class="mb-5 lg:hidden text-center">
          <div
            class="inline-flex items-center gap-3 mb-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl"
          >
            <Sparkles class="h-6 w-6 text-white" />
            <span class="text-xl font-bold text-white">{appTitle}</span>
          </div>
          <p class="text-sm text-muted-foreground">欢迎回来，请登录您的账户</p>
        </div>

        <!-- 登录卡片 -->
        <Card
          class="border border-border/50 shadow-2xl backdrop-blur-xl bg-card/80 overflow-hidden"
        >
          <div class="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>

          <CardHeader class="space-y-1 text-center pb-3 sm:pb-5 pt-4 sm:pt-7">
            <CardTitle
              class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              登录账户
            </CardTitle>
            <CardDescription class="text-xs sm:text-sm mt-2">
              输入您的邮箱和密码登录
            </CardDescription>
          </CardHeader>

          <form onsubmit={handleSubmit}>
            <CardContent class="space-y-3 sm:space-y-4 px-4 sm:px-6">
              <!-- 社交登录按钮 -->
              <div class="grid grid-cols-3 gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  class="w-full h-11 sm:h-12 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                  onclick={() => handleSocialLogin('github')}
                >
                  <Github class="h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  class="w-full h-11 sm:h-12 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                  onclick={() => handleSocialLogin('google')}
                >
                  <Chrome class="h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  class="w-full h-11 sm:h-12 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                  onclick={() => handleSocialLogin('wechat')}
                >
                  <MessageCircle class="h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
              </div>

              <!-- 分隔线 -->
              <div class="relative py-3">
                <div class="absolute inset-0 flex items-center">
                  <Separator class="w-full" />
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                  <span class="bg-card px-3 text-muted-foreground font-medium">
                    或使用邮箱登录
                  </span>
                </div>
              </div>

              <!-- 消息提示 -->
              {#if message}
                <div
                  class={`p-3 rounded-xl text-xs sm:text-sm ${
                    messageType === 'error'
                      ? 'bg-destructive/10 border border-destructive/20 text-destructive'
                      : 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                  }`}
                >
                  {message}
                </div>
              {/if}

              <!-- 邮箱输入 -->
              <div class="space-y-2">
                <label for="email" class="text-xs font-medium text-muted-foreground">邮箱地址</label
                >
                <div class="relative group">
                  <Mail
                    class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10"
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    bind:value={email}
                    class="pl-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all {errors.email
                      ? 'border-destructive'
                      : ''}"
                    required
                  />
                </div>
                {#if errors.email}
                  <p class="text-xs text-destructive">{errors.email}</p>
                {/if}
              </div>

              <!-- 密码输入 -->
              <div class="space-y-2">
                <label for="password" class="text-xs font-medium text-muted-foreground">密码</label>
                <div class="relative group">
                  <Lock
                    class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors"
                  />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    bind:value={password}
                    class="pl-10 pr-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all {errors.password
                      ? 'border-destructive'
                      : ''}"
                    required
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onclick={() => (showPassword = !showPassword)}
                  >
                    {#if showPassword}
                      <EyeOff class="h-4 w-4" />
                    {:else}
                      <Eye class="h-4 w-4" />
                    {/if}
                  </button>
                </div>
                {#if errors.password}
                  <p class="text-xs text-destructive">{errors.password}</p>
                {/if}
              </div>

              <!-- 记住我和忘记密码 -->
              <div class="flex items-center justify-between text-xs sm:text-sm">
                <label class="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    bind:checked={rememberMe}
                    class="rounded border-gray-300 w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span class="text-muted-foreground group-hover:text-foreground transition-colors"
                    >记住我</span
                  >
                </label>
                <button
                  type="button"
                  class="text-primary hover:text-primary/80 font-medium transition-colors"
                  onclick={goToForgotPassword}
                >
                  忘记密码？
                </button>
              </div>

              <!-- 演示账号按钮 -->
              {#if demoEmail && demoPassword}
                <div class="flex items-center gap-2 py-2">
                  <div class="flex-1 h-px bg-border/50"></div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onclick={fillDemoCredentials}
                    class="h-7 px-3 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg"
                  >
                    <User class="h-3 w-3 mr-1.5" />
                    测试账号
                  </Button>
                  <div class="flex-1 h-px bg-border/50"></div>
                </div>
              {/if}

              <!-- 登录按钮 -->
              <Button
                type="submit"
                class="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={authStore.isLoading}
              >
                {#if authStore.isLoading}
                  <span class="mr-2 animate-spin">⏳</span>
                  登录中...
                {:else}
                  登录
                  <span class="ml-2 animate-pulse">→</span>
                {/if}
              </Button>
            </CardContent>

            <CardFooter class="flex flex-col space-y-3 sm:space-y-4 px-4 sm:px-6 pb-5 sm:pb-8 pt-2">
              <Separator />
              <p class="text-xs sm:text-sm text-muted-foreground text-center">
                还没有账户？
                <button
                  type="button"
                  class="text-primary hover:text-primary/80 font-semibold transition-colors"
                  onclick={goToRegister}
                >
                  立即注册
                </button>
              </p>
              <p class="text-xs text-muted-foreground/70 text-center leading-relaxed">
                阅读我们的
                <a
                  href="/terms"
                  class="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  服务条款
                </a>
                和
                <a
                  href="/privacy"
                  class="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  隐私政策
                </a>
                了解更多信息。
              </p>
              {#if showDemoHint}
                <p class="text-xs text-muted-foreground/60 text-center leading-relaxed">
                  测试账号请点击上方"测试账号"按钮自动填充
                </p>
              {/if}
            </CardFooter>
          </form>
        </Card>
      </div>
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
