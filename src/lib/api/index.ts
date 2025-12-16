// 导出 HTTP 客户端
export { httpClient, createHttpClient, ApiError } from './client.js';
export type { RequestConfig } from './client.js';

// 导出所有服务
export { authService, AuthService } from './services/auth.js';
export { userService, UserService } from './services/users.js';
export { dashboardService, DashboardService } from './services/dashboard.js';

// 导入服务实例用于创建 API 对象
import { authService } from './services/auth.js';
import { userService } from './services/users.js';
import { dashboardService } from './services/dashboard.js';

// 可选：创建统一的 API 对象
export const api = {
  auth: authService,
  users: userService,
  dashboard: dashboardService,
} as const;

export default api;
