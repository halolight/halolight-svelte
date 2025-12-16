<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { ArrowLeft, FileText, Scale, Shield, AlertCircle } from 'lucide-svelte';

  const brandName = import.meta.env.VITE_APP_TITLE || 'Admin Pro';
  const lastUpdated = '2024年12月1日';
</script>

<svelte:head>
  <title>服务条款 - {brandName}</title>
</svelte:head>

<div
  class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900"
>
  <div class="container mx-auto max-w-4xl px-4 py-8">
    <!-- 返回按钮 -->
    <div class="mb-6">
      <Button variant="ghost" href="/auth/login" class="gap-2">
        <ArrowLeft class="h-4 w-4" />
        返回登录
      </Button>
    </div>

    <!-- 标题 -->
    <div class="mb-8 text-center">
      <div
        class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
      >
        <FileText class="h-8 w-8 text-primary" />
      </div>
      <h1 class="text-3xl font-bold">{brandName} 服务条款</h1>
      <p class="mt-2 text-muted-foreground">最后更新：{lastUpdated}</p>
    </div>

    <!-- 内容卡片 -->
    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Scale class="h-5 w-5 text-primary" />
            1. 服务协议的接受
          </CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>
            欢迎使用 {brandName}（以下简称"本服务"）。在使用本服务之前，请您仔细阅读并充分理解本服务条款的全部内容。
          </p>
          <p>
            当您访问或使用本服务时，即表示您已阅读、理解并同意接受本服务条款的约束。如果您不同意本条款的任何内容，请勿使用本服务。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Shield class="h-5 w-5 text-primary" />
            2. 服务内容
          </CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>本服务为用户提供企业级后台管理系统，主要功能包括但不限于：</p>
          <ul>
            <li>用户身份认证与权限管理</li>
            <li>数据可视化与报表分析</li>
            <li>系统配置与个性化设置</li>
            <li>消息通知与协作功能</li>
            <li>文件管理与存储服务</li>
          </ul>
          <p>我们保留随时修改、暂停或终止部分或全部服务的权利，恕不另行通知。</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <AlertCircle class="h-5 w-5 text-primary" />
            3. 用户责任
          </CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>作为本服务的用户，您同意：</p>
          <ul>
            <li>提供真实、准确、完整的注册信息</li>
            <li>妥善保管您的账户凭据，对账户下的所有活动负责</li>
            <li>不从事任何非法或侵犯他人权益的行为</li>
            <li>不尝试未经授权访问系统或其他用户的数据</li>
            <li>遵守所有适用的法律法规</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. 知识产权</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>
            本服务及其所有内容（包括但不限于文本、图形、徽标、图标、图像、音频、视频和软件）均受知识产权法保护。
          </p>
          <p>未经我们书面许可，您不得复制、修改、分发、销售或以其他方式利用本服务的任何部分。</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. 免责声明</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>
            本服务按"现状"提供，我们不对服务的适用性、可靠性、可用性、及时性或准确性作任何明示或暗示的保证。
          </p>
          <p>
            在法律允许的最大范围内，我们不对因使用或无法使用本服务而导致的任何直接、间接、附带、特殊或后果性损害承担责任。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. 条款修改</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>
            我们保留随时修改本服务条款的权利。修改后的条款将在本页面上发布，并更新"最后更新"日期。
          </p>
          <p>您继续使用本服务即表示接受修改后的条款。我们建议您定期查看本条款以了解任何更改。</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. 联系我们</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>如果您对本服务条款有任何疑问或意见，请通过以下方式联系我们：</p>
          <ul>
            <li>邮箱：support@halolight.cn</li>
            <li>GitHub：https://github.com/halolight</li>
          </ul>
        </CardContent>
      </Card>
    </div>

    <!-- 底部导航 -->
    <div class="mt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground">
      <a href="/privacy" class="hover:text-primary hover:underline">隐私政策</a>
      <span>•</span>
      <a href="/auth/login" class="hover:text-primary hover:underline">返回登录</a>
    </div>
  </div>
</div>
