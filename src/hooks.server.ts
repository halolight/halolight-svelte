import type { Handle } from '@sveltejs/kit';
import { ROUTE_WHITE_LIST, LOGIN_ROUTE, TOKEN_KEY, DEFAULT_ROUTE } from '$lib/utils/constants.js';

/**
 * 服务端路由守卫
 *
 * 注意：服务端无法访问客户端的 localStorage，因此使用 cookies 来检查认证状态
 */
export const handle: Handle = async ({ event, resolve }) => {
  const { url, cookies } = event;
  const pathname = url.pathname;

  // 检查是否为静态资源或 API 路由
  const isStaticRoute = pathname.startsWith('/_app') || pathname.startsWith('/favicon');
  const isApiRoute = pathname.startsWith('/api');

  // 跳过静态资源
  if (isStaticRoute) {
    return resolve(event);
  }

  // 从 cookie 获取 token 来判断认证状态
  const token = cookies.get(TOKEN_KEY);
  const isAuthenticated = !!token;

  // 根路由重定向：已登录去 dashboard，未登录去登录页
  if (pathname === '/') {
    return new Response(null, {
      status: 302,
      headers: {
        Location: isAuthenticated ? DEFAULT_ROUTE : LOGIN_ROUTE,
      },
    });
  }

  // 检查是否在白名单中
  const isWhitelisted = ROUTE_WHITE_LIST.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 检查是否需要认证的路由（排除 API、静态资源和白名单路由）
  const isProtectedRoute = !isWhitelisted && !isApiRoute;

  // 如果是受保护的路由且用户未登录，重定向到登录页
  if (isProtectedRoute && !isAuthenticated) {
    // 保存当前路径，登录后重定向回来
    const redirectTo = encodeURIComponent(pathname + url.search);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${LOGIN_ROUTE}?redirect=${redirectTo}`,
      },
    });
  }

  // 如果用户已登录但访问登录页，重定向到 dashboard
  if (isAuthenticated && pathname === LOGIN_ROUTE) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: DEFAULT_ROUTE,
      },
    });
  }

  // 继续处理请求
  const response = await resolve(event);

  return response;
};
