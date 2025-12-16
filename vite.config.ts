import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
  plugins: [sveltekit()],

  // 构建优化
  build: {
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 目标环境
    target: 'esnext',
    // 压缩配置
    minify: 'esbuild',
    // Rollup 选项
    rollupOptions: {
      output: {
        // 手动分块策略
        manualChunks: (id) => {
          // UI 组件库
          if (id.includes('bits-ui') || id.includes('cmdk-sv') || id.includes('vaul-svelte')) {
            return 'ui-vendor';
          }
          // 图标库
          if (id.includes('lucide-svelte') || id.includes('@lucide/svelte')) {
            return 'icons';
          }
          // 表单处理
          if (id.includes('superforms') || id.includes('formsnap') || id.includes('zod')) {
            return 'forms';
          }
          // 其他 node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // 报告压缩后大小
    reportCompressedSize: true,
    // chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,
  },

  // 开发服务器配置
  server: {
    port: 5173,
    strictPort: false,
    // 热更新
    hmr: {
      overlay: true,
    },
    // API 代理配置 - 解决跨域问题
    proxy: {
      '/api': {
        target: process.env.VITE_API_BACKEND_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // 预览服务器配置
  preview: {
    port: 4173,
  },

  // 优化依赖
  optimizeDeps: {
    include: ['clsx', 'tailwind-merge', 'lucide-svelte', 'bits-ui'],
    exclude: ['@sveltejs/kit'],
  },

  // CSS 配置
  css: {
    devSourcemap: mode === 'development',
  },

  // 环境变量
  envPrefix: ['VITE_', 'PUBLIC_'],

  // 测试配置
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockServiceWorker.js',
        'src/lib/mocks/**',
        'static/**',
      ],
    },
    exclude: ['node_modules', 'e2e'],
  },
}));
