// API 相关常量
export const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || '/api';
export const API_TIMEOUT = Number(import.meta.env.PUBLIC_API_TIMEOUT) || 30000;
export const ENABLE_MOCK = import.meta.env.PUBLIC_ENABLE_MOCK === 'true';

// 应用相关常量
export const APP_TITLE = import.meta.env.PUBLIC_APP_TITLE || 'Admin Pro';
export const BRAND_NAME = import.meta.env.PUBLIC_BRAND_NAME || 'Halolight';
export const APP_VERSION = '1.0.0';

// 认证相关常量
export const TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_INFO_KEY = 'user_info';
export const PERMISSIONS_KEY = 'permissions';
export const ROLES_KEY = 'roles';

// 主题相关常量
export const THEME_MODE_KEY = 'theme_mode';
export const THEME_SKIN_KEY = 'theme_skin';
export const SIDEBAR_COLLAPSED_KEY = 'sidebar_collapsed';
export const LAYOUT_SETTINGS_KEY = 'layout_settings';

// 缓存相关常量
export const CACHE_VERSION = 'v1';
export const CACHE_PREFIX = 'halolight_';

// 路由相关常量
export const ROUTE_WHITE_LIST = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/terms',
  '/privacy',
];
export const DEFAULT_ROUTE = '/dashboard';
export const LOGIN_ROUTE = '/auth/login';

// 分页相关常量
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// 时间相关常量
export const TOKEN_EXPIRE_TIME = 15 * 60 * 1000; // 15分钟
export const REFRESH_TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000; // 7天
export const CAPTCHA_EXPIRE_TIME = 5 * 60 * 1000; // 5分钟

// 响应状态码
export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// 业务状态码
export const BUSINESS_CODE = {
  SUCCESS: 0,
  ERROR: 1,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  VALIDATION_ERROR: 1001,
  BUSINESS_ERROR: 2001,
  SYSTEM_ERROR: 3001,
} as const;

// 正则表达式
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^1[3-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  NUMBER: /^\d+$/,
  DECIMAL: /^\d+(\.\d+)?$/,
  CHINESE: /[\u4e00-\u9fa5]/,
  IDCARD: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
} as const;

// 权限通配符
export const PERMISSION_WILDCARD = '*';
export const PERMISSION_SEPARATOR = ':';

// 组件尺寸
export const COMPONENT_SIZES = ['sm', 'md', 'lg'] as const;
export type ComponentSize = (typeof COMPONENT_SIZES)[number];

// 按钮变体
export const BUTTON_VARIANTS = ['default', 'outline', 'ghost', 'link', 'destructive'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

// 输入类型
export const INPUT_TYPES = ['text', 'password', 'email', 'number', 'tel', 'url', 'search'] as const;
export type InputType = (typeof INPUT_TYPES)[number];

// 消息类型
export const MESSAGE_TYPES = ['success', 'error', 'warning', 'info'] as const;
export type MessageType = (typeof MESSAGE_TYPES)[number];

// 日期格式
export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
} as const;

// 文件上传限制
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  VIDEO_TYPES: ['video/mp4', 'video/avi', 'video/mov'],
  AUDIO_TYPES: ['audio/mp3', 'audio/wav', 'audio/ogg'],
} as const;

// 拖拽配置
export const DRAG_CONFIG = {
  GHOST_CLASS: 'drag-ghost',
  CHOSEN_CLASS: 'drag-chosen',
  DRAG_CLASS: 'drag-dragging',
  ANIMATION: 150,
  DELAY: 0,
  DISTANCE: 0,
  THRESHOLD: 5,
} as const;

// 图表默认配置
export const CHART_DEFAULTS = {
  COLORS: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'],
  ANIMATION_DURATION: 1000,
  TOOLTIP_ENABLED: true,
  LEGEND_ENABLED: true,
  GRID_ENABLED: true,
} as const;

// 响应式断点
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// 侧边栏宽度
export const SIDEBAR_WIDTHS = {
  COLLAPSED: 64,
  EXPANDED: 240,
  MINI: 80,
} as const;
