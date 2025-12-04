import { pageCacheStore } from './page-cache.svelte';

/**
 * Create a form store with caching
 */
export function createFormStore<T extends Record<string, unknown>>(
  key: string,
  initialValues: T
): {
  values: T;
  saveValues: (newValues: T) => void;
  clearCache: () => void;
} {
  // Try to get cached values
  const pageState = pageCacheStore.getPageState(key);
  const cachedValues = (pageState?.formData as T) || initialValues;

  let values = $state<T>(cachedValues);

  function saveValues(newValues: T) {
    values = newValues;
    pageCacheStore.setPageState(key, { formData: newValues });
  }

  function clearCache() {
    values = initialValues;
    pageCacheStore.clearPageState(key);
  }

  return {
    get values() {
      return values;
    },
    saveValues,
    clearCache,
  };
}
