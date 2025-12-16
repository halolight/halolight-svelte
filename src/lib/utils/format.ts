import { DATE_FORMATS, REGEX } from './constants.js';

/**
 * 格式化日期
 */
export function formatDate(date: string | Date, format: string = DATE_FORMATS.DATE): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 格式化数字（千位分隔符）
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}

/**
 * 格式化货币
 */
export function formatCurrency(amount: number, currency: string = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化手机号
 */
export function formatPhone(phone: string): string {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
}

/**
 * 格式化邮箱
 */
export function formatEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [username, domain] = email.split('@');
  if (username.length <= 3) return email;
  return `${username.slice(0, 3)}***@${domain}`;
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diff = now.getTime() - target.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}年前`;
  if (months > 0) return `${months}个月前`;
  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  if (seconds > 0) return `${seconds}秒前`;
  return '刚刚';
}

/**
 * 格式化持续时间
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

/**
 * 格式化状态文本
 */
export function formatStatus(status: string, type: 'user' | 'order' | 'product' = 'user'): string {
  const statusMap = {
    user: {
      active: '正常',
      inactive: '禁用',
      banned: '封禁',
      pending: '待审核',
      rejected: '已拒绝',
    },
    order: {
      pending: '待支付',
      paid: '已支付',
      shipped: '已发货',
      delivered: '已送达',
      cancelled: '已取消',
      refunded: '已退款',
    },
    product: {
      active: '在售',
      inactive: '下架',
      out_of_stock: '缺货',
      pre_sale: '预售',
      discontinued: '停产',
    },
  };

  return statusMap[type][status as keyof (typeof statusMap)[typeof type]] || status;
}

/**
 * 格式化布尔值
 */
export function formatBoolean(value: boolean): string {
  return value ? '是' : '否';
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * 高亮文本
 */
export function highlightText(text: string, keyword: string): string {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * 生成随机颜色
 */
export function generateRandomColor(): string {
  const colors = [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#06b6d4',
    '#84cc16',
    '#f97316',
    '#ec4899',
    '#6366f1',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * 获取文件图标
 */
export function getFileIcon(filename: string): string {
  const ext = getFileExtension(filename).toLowerCase();
  const iconMap: Record<string, string> = {
    // 图片
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    webp: '🖼️',
    svg: '🖼️',
    // 文档
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    txt: '📄',
    rtf: '📝',
    // 表格
    xls: '📊',
    xlsx: '📊',
    csv: '📊',
    // 演示文稿
    ppt: '📽️',
    pptx: '📽️',
    // 压缩包
    zip: '📦',
    rar: '📦',
    '7z': '📦',
    tar: '📦',
    gz: '📦',
    // 视频
    mp4: '🎬',
    avi: '🎬',
    mov: '🎬',
    mkv: '🎬',
    wmv: '🎬',
    // 音频
    mp3: '🎵',
    wav: '🎵',
    flac: '🎵',
    aac: '🎵',
    ogg: '🎵',
    // 代码
    js: '💻',
    ts: '💻',
    py: '🐍',
    java: '☕',
    cpp: '⚙️',
    html: '🌐',
    css: '🎨',
  };

  return iconMap[ext] || '📄';
}

/**
 * 深度克隆对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 等待指定时间
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 判断是否为移动端
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 判断是否为深色模式
 */
export function isDarkMode(): boolean {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

/**
 * 下载文件
 */
export function downloadFile(
  content: string | Blob,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 解析查询参数
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(queryString);

  for (const [key, value] of searchParams) {
    params[key] = value;
  }

  return params;
}

/**
 * 构建查询字符串
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

/**
 * 扁平化数组
 */
export function flattenArray<T>(arr: T[]): T[] {
  return arr.reduce((flat: T[], item: T) => {
    return flat.concat(Array.isArray(item) ? flattenArray(item) : item);
  }, [] as T[]);
}

/**
 * 分组数组
 */
export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
}

/**
 * 数组去重
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * 数组交集
 */
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((item) => arr2.includes(item));
}

/**
 * 数组差集
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((item) => !arr2.includes(item));
}

/**
 * 深度合并对象
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge((result[key] || {}) as any, source[key] as any) as T[Extract<
          keyof T,
          string
        >];
      } else {
        result[key] = source[key] as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

/**
 * 获取对象深度值
 */
export function getNestedValue(obj: any, path: string, defaultValue?: any): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : defaultValue;
  }, obj);
}

/**
 * 设置对象深度值
 */
export function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop();
  if (!lastKey) return;
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * 安全解析 JSON
 */
export function safeParseJSON<T = any>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
}

/**
 * 安全执行函数
 */
export function safeExec<T>(fn: () => T, defaultValue: T): T {
  try {
    return fn();
  } catch {
    return defaultValue;
  }
}

/**
 * 生成随机字符串
 */
export function randomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 生成随机数字
 */
export function randomNumber(min: number = 0, max: number = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  return REGEX.EMAIL.test(email);
}

/**
 * 验证手机号格式
 */
export function isValidPhone(phone: string): boolean {
  return REGEX.PHONE.test(phone);
}

/**
 * 验证密码强度
 */
export function isValidPassword(password: string): boolean {
  return REGEX.PASSWORD.test(password);
}

/**
 * 验证用户名格式
 */
export function isValidUsername(username: string): boolean {
  return REGEX.USERNAME.test(username);
}

/**
 * 验证URL格式
 */
export function isValidUrl(url: string): boolean {
  return REGEX.URL.test(url);
}

/**
 * 验证身份证号
 */
export function isValidIdCard(idCard: string): boolean {
  return REGEX.IDCARD.test(idCard);
}

/**
 * 验证是否为数字
 */
export function isNumber(value: any): boolean {
  return REGEX.NUMBER.test(String(value));
}

/**
 * 验证是否为小数
 */
export function isDecimal(value: any): boolean {
  return REGEX.DECIMAL.test(String(value));
}

/**
 * 验证是否包含中文
 */
export function hasChinese(text: string): boolean {
  return REGEX.CHINESE.test(text);
}
