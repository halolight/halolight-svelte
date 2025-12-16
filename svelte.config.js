import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // 预处理器配置
  preprocess: vitePreprocess(),

  // 编译器选项
  compilerOptions: {
    // 生产环境移除开发时的警告
    dev: process.env.NODE_ENV !== 'production',
  },

  kit: {
    // Cloudflare Pages 适配器
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['<all>'],
      },
      platformProxy: {
        configPath: 'wrangler.toml',
        environment: undefined,
        experimentalJsonConfig: false,
        persist: false,
      },
    }),

    // 别名配置
    alias: {
      $lib: './src/lib',
      $components: './src/lib/components',
      $stores: './src/lib/stores',
      $utils: './src/lib/utils',
      $types: './src/lib/types',
    },

    // CSP 配置（可选，增强安全性）
    csp: {
      mode: 'auto',
      directives: {
        'script-src': ['self'],
        'style-src': ['self', 'unsafe-inline'],
      },
    },

    // 预渲染配置
    prerender: {
      handleHttpError: 'warn',
      handleMissingId: 'warn',
    },

    // 环境变量前缀
    env: {
      publicPrefix: 'PUBLIC_',
    },
  },
};

export default config;
