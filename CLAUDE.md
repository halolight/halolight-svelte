# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Halolight Svelte 是一个基于 SvelteKit 2 + Svelte 5 的现代化中文后台管理系统，具备编译时优化和极致性能。

- **在线预览**: https://halolight-svelte.h7ml.cn
- **GitHub**: https://github.com/halolight/halolight-svelte

## 技术栈速览

| 类别     | 技术                     |
| -------- | ------------------------ |
| 核心框架 | Svelte 5 + SvelteKit 2   |
| 构建工具 | Vite 7                   |
| 路由     | SvelteKit 文件路由       |
| 样式     | Tailwind CSS 4           |
| 类型     | TypeScript 5.9           |
| UI 组件  | shadcn-svelte (bits-ui)  |
| 表单     | Superforms + Zod         |
| 部署     | Cloudflare Pages         |
| 测试     | Vitest + Testing Library |

## 常用命令

```bash
pnpm dev              # 启动开发服务器
pnpm build            # 生产构建 (Cloudflare Pages)
pnpm preview          # 预览构建产物
pnpm check            # 类型检查 (svelte-check)
pnpm check:watch      # 监听模式类型检查
pnpm lint             # ESLint 检查
pnpm lint:fix         # ESLint 自动修复
pnpm format           # Prettier 格式化
pnpm format:check     # Prettier 格式检查
pnpm test             # 运行测试
pnpm test:coverage    # 运行测试 + 覆盖率
pnpm ci               # 完整 CI 流程
```

## 目录结构

```
src/
├── routes/                    # 文件路由
│   ├── +page.svelte          # / 路由页面
│   ├── +layout.svelte        # 根布局
│   ├── +error.svelte         # 错误页面
│   ├── auth/                 # 认证页面
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   └── (dashboard)/          # 仪表盘路由组
│       ├── +layout.svelte    # 仪表盘布局
│       ├── dashboard/
│       ├── users/
│       ├── settings/
│       └── profile/
├── lib/                       # 库代码（$lib 别名）
│   ├── components/
│   │   ├── ui/               # shadcn-svelte 组件
│   │   └── layout/           # 布局组件
│   ├── stores/               # Svelte 5 响应式 stores
│   │   ├── auth.svelte.ts
│   │   └── ui-settings.svelte.ts
│   ├── utils/                # 工具函数
│   ├── types/                # TypeScript 类型
│   └── config/               # 配置文件
├── hooks.server.ts           # 服务端钩子
├── app.html                  # HTML 模板
└── app.css                   # 全局样式 + Tailwind
```

## Svelte 5 Runes（符文系统）

```svelte
<script lang="ts">
  // $state - 响应式状态
  let count = $state(0);

  // $derived - 派生值（自动追踪依赖）
  let doubled = $derived(count * 2);

  // $effect - 副作用（自动清理）
  $effect(() => {
    console.log('count changed:', count);
  });

  // $props - 组件属性
  let { title, onclick }: { title: string; onclick?: () => void } = $props();

  function increment() {
    count++;
  }
</script>

<button {onclick} onclick={increment}>
  Count: {count}, Doubled: {doubled}
</button>
```

### Svelte 5 vs Svelte 4 对照

| 特性   | Svelte 5       | Svelte 4             |
| ------ | -------------- | -------------------- |
| 状态   | `$state()`     | `let x = 0`          |
| 派生   | `$derived()`   | `$: doubled = x * 2` |
| 副作用 | `$effect()`    | `$: { ... }`         |
| Props  | `$props()`     | `export let prop`    |
| 事件   | `onclick={fn}` | `on:click={fn}`      |
| 子内容 | `Snippet`      | `<slot />`           |

## SvelteKit 路由约定

| 文件                | 说明                 |
| ------------------- | -------------------- |
| `+page.svelte`      | 页面组件             |
| `+page.ts`          | 页面数据加载（通用） |
| `+page.server.ts`   | 服务端数据加载       |
| `+layout.svelte`    | 布局组件             |
| `+layout.ts`        | 布局数据加载         |
| `+layout.server.ts` | 服务端布局数据加载   |
| `+error.svelte`     | 错误页面             |
| `+server.ts`        | API 端点             |

### 数据加载示例

```typescript
// src/routes/dashboard/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/api/stats');
  const stats = await res.json();
  return { stats };
};
```

```svelte
<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<h1>Dashboard</h1><p>Total: {data.stats.total}</p>
```

## 状态管理 (Svelte 5 Class Stores)

```typescript
// src/lib/stores/auth.svelte.ts
import { browser } from '$app/environment';

class AuthStore {
  user = $state<User | null>(null);
  token = $state<string | null>(null);

  isAuthenticated = $derived(!!this.token && !!this.user);
  permissions = $derived(this.user?.permissions ?? []);

  async login(credentials: LoginCredentials) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    this.user = data.user;
    this.token = data.token;
  }

  logout() {
    this.user = null;
    this.token = null;
  }
}

export const authStore = new AuthStore();
```

## UI 组件 (shadcn-svelte)

```svelte
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
</script>

<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
  </CardHeader>
  <CardContent>
    <Input placeholder="输入内容" />
    <Button>提交</Button>
  </CardContent>
</Card>
```

## 环境变量

| 变量名                  | 说明           | 默认值      |
| ----------------------- | -------------- | ----------- |
| `VITE_API_URL`          | API 基础 URL   | `/api`      |
| `VITE_MOCK`             | 启用 Mock 数据 | `true`      |
| `VITE_APP_TITLE`        | 应用标题       | `Admin Pro` |
| `PUBLIC_DEMO_EMAIL`     | 演示账号邮箱   | -           |
| `PUBLIC_DEMO_PASSWORD`  | 演示账号密码   | -           |
| `PUBLIC_SHOW_DEMO_HINT` | 显示演示提示   | `false`     |

## 部署配置

项目配置为 Cloudflare Pages 部署：

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare';

export default {
  kit: {
    adapter: adapter({
      routes: { include: ['/*'], exclude: ['<all>'] },
    }),
  },
};
```

## CI/CD 流程

GitHub Actions 包含以下 jobs：

1. **lint**: ESLint + Prettier 检查
2. **type-check**: svelte-check 类型检查
3. **test**: Vitest 测试 + 覆盖率
4. **build**: 生产构建

本地运行完整 CI：

```bash
pnpm ci
```

## 代码规范

- **Runes**: 使用 Svelte 5 的 `$state`、`$derived`、`$effect`
- **Props**: 使用 `$props()` 获取组件属性，带类型注解
- **事件**: 使用 `onclick` 而非 `on:click`
- **类型**: 使用 `$types` 自动生成的类型
- **响应式集合**: 使用 `SvelteSet`、`SvelteMap` 替代原生集合
- **Each 块**: 必须带 key `{#each items as item (item.id)}`

## 与其他 Halolight 项目的对照

| 功能     | Svelte 版本   | Vue 版本     | React 版本   |
| -------- | ------------- | ------------ | ------------ |
| 响应式   | $state Runes  | Ref/Reactive | useState     |
| 派生值   | $derived      | Computed     | useMemo      |
| 副作用   | $effect       | Watch        | useEffect    |
| 状态管理 | Class Stores  | Pinia        | Zustand      |
| 路由     | SvelteKit     | Vue Router   | React Router |
| 构建工具 | Vite          | Vite         | Next.js      |
| 组件库   | shadcn-svelte | shadcn-vue   | shadcn/ui    |
