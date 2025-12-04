import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn (className utility)', () => {
  it('合并单个类名', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('合并多个类名', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('处理条件类名', () => {
    const showBar = true;
    const showBaz = false;
    expect(cn('foo', showBar && 'bar', showBaz && 'baz')).toBe('foo bar');
  });

  it('处理对象形式的类名', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('处理数组形式的类名', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('合并 Tailwind 冲突类名', () => {
    // tailwind-merge 会处理冲突
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('处理空值和 undefined', () => {
    expect(cn('foo', null, undefined, 'bar')).toBe('foo bar');
  });

  it('处理空字符串', () => {
    expect(cn('foo', '', 'bar')).toBe('foo bar');
  });

  it('处理复杂的混合输入', () => {
    const result = cn(
      'base-class',
      { 'conditional-class': true, 'disabled-class': false },
      ['array-class-1', 'array-class-2'],
      undefined,
      'final-class'
    );
    expect(result).toBe('base-class conditional-class array-class-1 array-class-2 final-class');
  });
});
