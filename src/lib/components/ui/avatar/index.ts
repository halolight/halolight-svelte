import { type VariantProps, tv } from 'tailwind-variants';

export const avatarVariants = tv({
  slots: {
    root: 'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
    image: 'aspect-square h-full w-full',
    fallback: 'flex h-full w-full items-center justify-center rounded-full bg-muted',
  },
  variants: {
    size: {
      sm: {
        root: 'h-8 w-8 text-xs',
      },
      default: {
        root: 'h-10 w-10 text-sm',
      },
      lg: {
        root: 'h-12 w-12 text-base',
      },
      xl: {
        root: 'h-16 w-16 text-lg',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type AvatarVariants = VariantProps<typeof avatarVariants>;

export { default as Avatar } from './Avatar.svelte';
export { default as AvatarImage } from './AvatarImage.svelte';
export { default as AvatarFallback } from './AvatarFallback.svelte';
