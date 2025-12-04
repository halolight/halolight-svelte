import type { BaseEntity } from './index.js';

/**
 * 系统设置类别
 */
export type SettingCategory =
  | 'general'
  | 'security'
  | 'notification'
  | 'appearance'
  | 'privacy'
  | 'account'
  | 'advanced';

/**
 * 设置项类型
 */
export type SettingValueType = 'string' | 'number' | 'boolean' | 'object' | 'array';

/**
 * 设置项
 */
export interface SettingItem extends BaseEntity {
  key: string;
  value: any;
  category: SettingCategory;
  type: SettingValueType;
  label: string;
  description?: string;
  defaultValue: any;
  isPublic: boolean;
  isEditable: boolean;
  validationRules?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    options?: any[];
  };
}

/**
 * 通用设置
 */
export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
}

/**
 * 安全设置
 */
export interface SecuritySettings {
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSpecialChars: boolean;
  passwordExpiryDays: number;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'email' | 'sms' | 'authenticator';
  ipWhitelist?: string[];
  ipBlacklist?: string[];
}

/**
 * 通知设置
 */
export interface NotificationSettings {
  emailEnabled: boolean;
  emailHost: string;
  emailPort: number;
  emailUsername: string;
  emailPassword: string;
  emailFrom: string;
  emailFromName: string;
  smsEnabled: boolean;
  smsProvider?: string;
  smsApiKey?: string;
  pushEnabled: boolean;
  pushProvider?: string;
  notifyOnNewUser: boolean;
  notifyOnNewMessage: boolean;
  notifyOnSystemError: boolean;
}

/**
 * 外观设置
 */
export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  sidebarPosition: 'left' | 'right';
  sidebarCollapsed: boolean;
  showBreadcrumb: boolean;
  showFooter: boolean;
  customCss?: string;
  customJs?: string;
}

/**
 * 隐私设置
 */
export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowSearch: boolean;
  allowMessagesFrom: 'everyone' | 'friends' | 'nobody';
  dataRetentionDays: number;
  allowAnalytics: boolean;
  allowCookies: boolean;
}

/**
 * 账户设置
 */
export interface AccountSettings {
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  nickname: string;
  bio?: string;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  twoFactorEnabled: boolean;
}

/**
 * 高级设置
 */
export interface AdvancedSettings {
  apiRateLimit: number;
  cacheEnabled: boolean;
  cacheTTL: number;
  debugMode: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  maxUploadSize: number;
  allowedFileTypes: string[];
  backupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupRetentionDays: number;
}

/**
 * 设置更新参数
 */
export interface UpdateSettingsDto {
  category: SettingCategory;
  settings: Record<string, any>;
}

/**
 * 设置分组
 */
export interface SettingsGroup {
  category: SettingCategory;
  label: string;
  description?: string;
  icon?: string;
  items: SettingItem[];
}

/**
 * 设置变更历史
 */
export interface SettingChangeLog extends BaseEntity {
  settingKey: string;
  oldValue: any;
  newValue: any;
  changedBy: string;
  changedByName: string;
  reason?: string;
}
