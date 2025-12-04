/**
 * Page state interface
 */
export interface PageState {
  scrollY: number;
  formData?: Record<string, unknown>;
  customState?: Record<string, unknown>;
  timestamp: number;
}

/**
 * Page cache store using Svelte 5 runes
 */
class PageCacheStore {
  cache = $state<Map<string, PageState>>(new Map());

  /**
   * Set page state
   */
  setPageState(path: string, state: Partial<PageState>): void {
    const existing = this.cache.get(path) || { scrollY: 0, timestamp: Date.now() };
    this.cache.set(path, { ...existing, ...state, timestamp: Date.now() });
  }

  /**
   * Get page state
   */
  getPageState(path: string): PageState | undefined {
    return this.cache.get(path);
  }

  /**
   * Clear page state
   */
  clearPageState(path: string): void {
    this.cache.delete(path);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cache.clear();
  }
}

// Create singleton
export const pageCacheStore = new PageCacheStore();
