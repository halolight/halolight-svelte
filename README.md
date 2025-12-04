# Halolight Svelte | Admin Pro

[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/halolight/halolight-svelte/blob/main/LICENSE)
[![Svelte](https://img.shields.io/badge/Svelte-5-%23FF3E00.svg)](https://svelte.dev/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2-%23FF3E00.svg)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-%233178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-%2306B6D4.svg)](https://tailwindcss.com/)
[![CI](https://github.com/halolight/halolight-svelte/actions/workflows/ci.yml/badge.svg)](https://github.com/halolight/halolight-svelte/actions/workflows/ci.yml)

基于 SvelteKit 2 + Svelte 5 的现代化中文后台管理系统，具备编译时优化、Runes 响应式系统和极致性能。

- **在线预览**：<https://halolight-svelte.h7ml.cn>
- **GitHub**：<https://github.com/halolight/halolight-svelte>

## 功能亮点

- **Svelte 5 Runes**：`$state`、`$derived`、`$effect`、`$props` 全新响应式系统
- **SvelteKit 2**：文件路由、SSR/SSG、API 端点、布局嵌套
- **编译时优化**：无虚拟 DOM，极小运行时开销
- **TypeScript 5.9**：完整类型安全与自动类型推导
- **Tailwind CSS v4**：原子化样式 + `@tailwindcss/postcss` 插件
- **View Transitions API**：主题/皮肤切换动画
- **Cloudflare Pages**：边缘部署，全球加速
- **shadcn-svelte**：高质量 UI 组件库

## 目录结构

```
src/
├── routes/                    # 文件路由
│   ├── (dashboard)/           # 仪表盘路由组
│   │   ├── dashboard/         # 首页
│   │   ├── analytics/         # 数据分析
│   │   ├── users/             # 用户管理
│   │   ├── settings/          # 系统设置
│   │   └── +layout.svelte     # 仪表盘布局
│   ├── auth/                  # 认证相关
│   │   ├── login/             # 登录
│   │   ├── register/          # 注册
│   │   └── forgot-password/   # 忘记密码
│   ├── +layout.svelte         # 根布局
│   └── +error.svelte          # 错误页面
├── lib/                       # 库代码 ($lib 别名)
│   ├── components/            # 可复用组件
│   │   ├── layout/            # 布局组件
│   │   └── ui/                # UI 组件 (shadcn-svelte)
│   ├── config/                # 配置文件
│   ├── stores/                # 状态管理
│   ├── types/                 # 类型定义
│   └── utils/                 # 工具函数
├── app.html                   # HTML 模板
├── app.css                    # 全局样式 (Tailwind)
└── hooks.server.ts            # 服务端钩子
```

## 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 9

### 安装与运行

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 类型检查
pnpm check

# 生产构建
pnpm build

# 预览构建产物
pnpm preview
```

### 代码质量

```bash
# ESLint 检查
pnpm lint

# ESLint 自动修复
pnpm lint:fix

# Prettier 格式化
pnpm format

# Prettier 检查
pnpm format:check

# 运行测试
pnpm test

# 测试覆盖率
pnpm test:coverage

# 完整 CI 检查
pnpm ci
```

## 技术栈

| 类别     | 技术                                    |
| -------- | --------------------------------------- |
| 核心框架 | Svelte 5 + SvelteKit 2                  |
| 类型系统 | TypeScript 5.9                          |
| 构建工具 | Vite 7                                  |
| 样式     | Tailwind CSS v4 + @tailwindcss/postcss  |
| UI 组件  | shadcn-svelte + bits-ui + lucide-svelte |
| 状态管理 | Svelte 5 Runes + Stores                 |
| 表单验证 | sveltekit-superforms + zod              |
| 测试框架 | Vitest + @testing-library/svelte        |
| 部署平台 | Cloudflare Pages                        |

## Svelte 5 Runes 示例

```svelte
<script lang="ts">
  import { SvelteSet } from 'svelte/reactivity';

  // $state - 响应式状态
  let count = $state(0);
  let items = $state<string[]>([]);
  let selected = new SvelteSet<string>();

  // $derived - 派生值（自动追踪依赖）
  let doubled = $derived(count * 2);
  let total = $derived(items.length);

  // $effect - 副作用（自动清理）
  $effect(() => {
    console.log('count changed:', count);
    return () => console.log('cleanup');
  });

  // $props - 组件属性
  interface Props {
    title: string;
    onSave?: (data: unknown) => void;
  }
  let { title, onSave }: Props = $props();
</script>

<h1>{title}</h1>
<button onclick={() => count++}>
  Count: {count}, Doubled: {doubled}
</button>
```

## SvelteKit 路由约定

| 文件              | 用途           |
| ----------------- | -------------- |
| `+page.svelte`    | 页面组件       |
| `+page.ts`        | 页面数据加载   |
| `+page.server.ts` | 服务端数据加载 |
| `+layout.svelte`  | 布局组件       |
| `+layout.ts`      | 布局数据加载   |
| `+error.svelte`   | 错误页面       |
| `+server.ts`      | API 端点       |

## 环境变量

| 变量名                   | 说明                | 默认值      |
| ------------------------ | ------------------- | ----------- |
| `VITE_API_URL`           | API 基础 URL        | `/api`      |
| `VITE_MOCK`              | 启用 Mock 数据      | `true`      |
| `VITE_APP_TITLE`         | 应用标题            | `Admin Pro` |
| `VITE_51LA_SITE_ID`      | 51.la 统计 ID       | -           |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics ID | -           |

## 部署

项目已配置 Cloudflare Pages 适配器，支持边缘部署：

```bash
# 本地构建
pnpm build

# Cloudflare Pages 会自动部署 main 分支
```

## CI/CD

GitHub Actions 自动运行以下检查：

1. **lint** - ESLint 代码检查
2. **format** - Prettier 格式检查
3. **type-check** - TypeScript 类型检查
4. **test** - Vitest 单元测试
5. **build** - 生产构建验证

## 与其他 Halolight 项目的对照

| 功能     | Svelte 版本        | Vue 版本     | React 版本   |
| -------- | ------------------ | ------------ | ------------ |
| 响应式   | $state Runes       | ref/reactive | useState     |
| 派生值   | $derived           | computed     | useMemo      |
| 副作用   | $effect            | watch        | useEffect    |
| 路由     | SvelteKit 文件路由 | Vue Router   | React Router |
| 构建工具 | Vite               | Vite         | Next.js      |

## 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE) &copy; 2024 [h7ml](https://github.com/h7ml)
