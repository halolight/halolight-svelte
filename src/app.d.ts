// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  // 扩展 Window 类型以包含 Google Analytics dataLayer
  interface Window {
    dataLayer: unknown[];
  }
}

export {};
