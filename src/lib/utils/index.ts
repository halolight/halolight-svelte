// 类合并工具函数
export { cn } from './cn.js';

// 其他工具函数导出
export * from './constants.js';
export * from './format.js';
export * from './validation.js';

// shadcn-svelte 组件所需的类型工具

/**
 * 为组件添加 ref 属性支持
 * 用于让 Svelte 组件支持 bind:this={ref} 模式
 */
export type WithElementRef<T, E extends HTMLElement = HTMLElement> = T & {
  ref?: E | null;
};

/**
 * 移除 children 和 child 属性
 * 用于组件包装时避免属性冲突
 */
export type WithoutChildrenOrChild<T> = Omit<T, 'children' | 'child'>;

/**
 * 移除 children 属性
 */
export type WithoutChildren<T> = Omit<T, 'children'>;

/**
 * 移除 child 属性
 */
export type WithoutChild<T> = Omit<T, 'child'>;
