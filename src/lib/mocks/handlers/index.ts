import { authHandlers } from './auth.js';
import { userHandlers } from './users.js';
import { messageHandlers } from './messages.js';
import { fileHandlers } from './files.js';
import { dashboardHandlers } from './dashboard.js';

/**
 * 所有 MSW handlers
 */
export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...messageHandlers,
  ...fileHandlers,
  ...dashboardHandlers,
];
