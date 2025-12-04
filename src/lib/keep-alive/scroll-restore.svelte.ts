import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { pageCacheStore } from './page-cache.svelte';

/**
 * Hook to save and restore scroll position
 */
export function useScrollRestore(pathname: string) {
  if (!browser) return;

  let isRestoring = $state(false);
  let timeoutId: number | undefined;

  // Save scroll position with throttling
  function handleScroll() {
    if (!isRestoring) {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        pageCacheStore.setPageState(pathname, { scrollY: window.scrollY });
      }, 100);
    }
  }

  // Restore scroll position
  function restoreScroll() {
    const pageState = pageCacheStore.getPageState(pathname);
    if (pageState && pageState.scrollY > 0) {
      isRestoring = true;
      requestAnimationFrame(() => {
        window.scrollTo(0, pageState.scrollY);
        setTimeout(() => {
          isRestoring = false;
        }, 100);
      });
    }
  }

  onMount(() => {
    // Restore on mount
    restoreScroll();

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  });
}
