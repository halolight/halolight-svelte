import type { SetupWorker } from 'msw/browser';
import { handlers } from './handlers/index.js';

/**
 * MSW worker instance (lazy initialized)
 */
let worker: SetupWorker | null = null;

/**
 * 启动 MSW
 *
 * 仅在浏览器环境中启动 Service Worker 拦截请求
 */
export async function startMockServiceWorker() {
  // 仅在浏览器环境时启动
  if (typeof window === 'undefined') {
    return;
  }

  const enableMock = import.meta.env.PUBLIC_ENABLE_MOCK === 'true';

  if (!enableMock) {
    console.log('[MSW] Mock is disabled');
    return;
  }

  try {
    // 动态导入 msw/browser 以避免 SSR 问题
    const { setupWorker } = await import('msw/browser');
    worker = setupWorker(...handlers);

    await worker.start({
      onUnhandledRequest: 'bypass', // 忽略未处理的请求
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    console.log('[MSW] Mock Service Worker started');
  } catch (error) {
    console.error('[MSW] Failed to start:', error);
  }
}

/**
 * 停止 MSW
 */
export function stopMockServiceWorker() {
  if (worker) {
    worker.stop();
    worker = null;
    console.log('[MSW] Mock Service Worker stopped');
  }
}
