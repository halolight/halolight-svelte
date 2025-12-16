<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { ArrowLeft, Lock, Eye, Database, Share2, Shield, UserCheck, Cookie } from 'lucide-svelte';

  const brandName = import.meta.env.VITE_APP_TITLE || 'Admin Pro';
  const lastUpdated = '2024年12月1日';
</script>

<svelte:head>
  <title>隐私政策 - {brandName}</title>
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
        <Lock class="h-8 w-8 text-primary" />
      </div>
      <h1 class="text-3xl font-bold">{brandName} 隐私政策</h1>
      <p class="mt-2 text-muted-foreground">最后更新：{lastUpdated}</p>
    </div>

    <!-- 概述 -->
    <Card class="mb-6">
      <CardContent class="p-6">
        <p class="text-muted-foreground">
          我们非常重视您的隐私。本隐私政策旨在帮助您了解我们如何收集、使用、存储和保护您的个人信息。请仔细阅读本政策，如有任何疑问，欢迎随时联系我们。
        </p>
      </CardContent>
    </Card>

    <!-- 内容卡片 -->
    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Eye class="h-5 w-5 text-primary" />
            1. 信息收集
          </CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>我们可能收集以下类型的信息：</p>
          <h4>1.1 您主动提供的信息</h4>
          <ul>
            <li>账户注册信息（用户名、邮箱、密码等）</li>
            <li>个人资料信息（姓名、头像、联系方式等）</li>
            <li>您提交的反馈和支持请求</li>
          </ul>
          <h4>1.2 自动收集的信息</h4>
          <ul>
            <li>设备信息（设备类型、操作系统、浏览器版本）</li>
            <li>使用数据（访问时间、页面浏览、功能使用情况）</li>
            <li>日志信息（IP 地址、访问时间、请求 URL）</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Database class="h-5 w-5 text-primary" />
            2. 信息使用
          </CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>我们使用收集的信息用于以下目的：</p>
          <ul>
            <li>提供、维护和改进我们的服务</li>
            <li>处理您的请求和交易</li>
            <li>发送服务通知和更新</li>
            <li>分析使用趋势以改善用户体验</li>
            <li>检测和预防欺诈及安全问题</li>
            <li>遵守法律义务</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Share2 class="h-5 w-5 text-primary" />
            3. 信息共享
          </CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>我们不会出售您的个人信息。在以下情况下，我们可能会共享您的信息：</p>
          <ul>
            <li>
              <strong>服务提供商</strong
              >：与帮助我们运营服务的第三方服务提供商共享（如云服务、数据分析）
            </li>
            <li>
              <strong>法律要求</strong>：当法律要求或为了保护我们的权利时
            </li>
            <li>
              <strong>业务转让</strong>：在合并、收购或资产出售的情况下
            </li>
            <li>
              <strong>您的同意</strong>：在您明确同意的其他情况下
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Shield class="h-5 w-5 text-primary" />
            4. 数据安全
          </CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>我们采取多种安全措施来保护您的个人信息：</p>
          <ul>
            <li>使用 SSL/TLS 加密传输敏感数据</li>
            <li>实施访问控制和身份验证机制</li>
            <li>定期进行安全审计和漏洞扫描</li>
            <li>对敏感信息进行加密存储</li>
            <li>限制员工对个人数据的访问</li>
          </ul>
          <p>尽管我们尽最大努力保护您的信息，但请理解互联网上的数据传输无法保证 100% 安全。</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Cookie class="h-5 w-5 text-primary" />
            5. Cookie 使用
          </CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>我们使用 Cookie 和类似技术来：</p>
          <ul>
            <li>保持您的登录状态</li>
            <li>记住您的偏好设置</li>
            <li>分析网站流量和使用情况</li>
            <li>提供个性化的用户体验</li>
          </ul>
          <p>
            您可以通过浏览器设置管理或删除 Cookie。但请注意，禁用 Cookie
            可能会影响某些功能的正常使用。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <UserCheck class="h-5 w-5 text-primary" />
            6. 您的权利
          </CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>根据适用的数据保护法律，您可能享有以下权利：</p>
          <ul>
            <li>
              <strong>访问权</strong>：请求获取我们持有的您的个人信息副本
            </li>
            <li>
              <strong>更正权</strong>：请求更正不准确或不完整的信息
            </li>
            <li>
              <strong>删除权</strong>：请求删除您的个人信息
            </li>
            <li>
              <strong>限制处理权</strong>：请求限制对您信息的处理
            </li>
            <li>
              <strong>数据可携带权</strong>：请求以结构化格式接收您的数据
            </li>
            <li>
              <strong>撤回同意</strong>：随时撤回您之前给予的同意
            </li>
          </ul>
          <p>如需行使上述权利，请通过下方联系方式与我们联系。</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. 儿童隐私</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>
            本服务不面向 16
            岁以下的儿童。我们不会故意收集儿童的个人信息。如果您发现我们无意中收集了儿童的信息，请立即联系我们，我们将采取措施删除相关数据。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. 政策更新</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>
            我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，并更新"最后更新"日期。对于重大变更，我们将通过服务内通知或电子邮件告知您。
          </p>
          <p>我们建议您定期查看本政策以了解我们如何保护您的信息。</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>9. 联系我们</CardTitle>
        </CardHeader>
        <CardContent class="prose prose-slate dark:prose-invert max-w-none">
          <p>如果您对本隐私政策有任何疑问、意见或投诉，请通过以下方式联系我们：</p>
          <ul>
            <li>邮箱：privacy@halolight.cn</li>
            <li>GitHub：https://github.com/halolight</li>
          </ul>
          <p>我们将在收到您的请求后尽快回复。</p>
        </CardContent>
      </Card>
    </div>

    <!-- 底部导航 -->
    <div class="mt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground">
      <a href="/terms" class="hover:text-primary hover:underline">服务条款</a>
      <span>•</span>
      <a href="/auth/login" class="hover:text-primary hover:underline">返回登录</a>
    </div>
  </div>
</div>
