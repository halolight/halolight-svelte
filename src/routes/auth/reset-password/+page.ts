import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
  // 获取重置令牌
  const token = url.searchParams.get('token');

  // 如果没有令牌，重定向到忘记密码页面
  if (!token) {
    throw redirect(307, '/auth/forgot-password');
  }

  return {
    token,
  };
};
