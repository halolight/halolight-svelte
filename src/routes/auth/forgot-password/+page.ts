import type { PageLoad } from './$types.js';
import { redirect } from '@sveltejs/kit';
import { authStore } from '$lib/stores/auth.svelte.js';

export const load: PageLoad = async () => {
  // 如果用户已登录，重定向到首页
  if (authStore.isAuthenticated) {
    throw redirect(302, '/dashboard');
  }

  return {
    title: '忘记密码',
    description: '重置您的密码',
  };
};
