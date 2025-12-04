import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatNumber,
  formatFileSize,
  formatPercentage,
  formatCurrency,
  truncateText,
  formatPhone,
  formatDuration,
  formatRelativeTime,
  formatStatus,
  formatBoolean,
  formatEmail,
  highlightText,
  generateRandomColor,
  getFileExtension,
  deepClone,
  generateId,
  randomString,
  randomNumber,
  groupBy,
  unique,
  intersection,
  difference,
  buildQueryString,
  parseQueryString,
} from './format';

describe('formatDate', () => {
  it('格式化日期字符串', () => {
    const date = '2024-01-15T10:30:00.000Z';
    expect(formatDate(date)).toMatch(/2024/);
  });

  it('处理 Date 对象', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toMatch(/2024/);
  });

  it('使用自定义格式', () => {
    const date = new Date('2024-01-15T10:30:00');
    const result = formatDate(date, 'YYYY-MM-DD');
    expect(result).toBe('2024-01-15');
  });

  it('格式化完整日期时间', () => {
    const date = new Date('2024-01-15T10:30:45');
    const result = formatDate(date, 'YYYY-MM-DD HH:mm:ss');
    expect(result).toBe('2024-01-15 10:30:45');
  });
});

describe('formatNumber', () => {
  it('格式化整数', () => {
    const result = formatNumber(1234567);
    expect(result).toContain('1');
    expect(result).toContain('234');
    expect(result).toContain('567');
  });

  it('格式化小数', () => {
    const result = formatNumber(1234.56);
    expect(result).toContain('1');
    expect(result).toContain('234');
  });

  it('处理零', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('处理负数', () => {
    const result = formatNumber(-1234);
    expect(result).toContain('1');
    expect(result).toContain('234');
  });
});

describe('formatFileSize', () => {
  it('格式化字节', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
  });

  it('格式化 KB', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
  });

  it('格式化 MB', () => {
    expect(formatFileSize(1048576)).toBe('1 MB');
  });

  it('格式化 GB', () => {
    expect(formatFileSize(1073741824)).toBe('1 GB');
  });

  it('格式化带小数', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });
});

describe('formatPercentage', () => {
  it('格式化百分比', () => {
    expect(formatPercentage(0.5)).toBe('50.00%');
    expect(formatPercentage(1)).toBe('100.00%');
    expect(formatPercentage(0)).toBe('0.00%');
  });

  it('指定小数位数', () => {
    expect(formatPercentage(0.1234, 2)).toBe('12.34%');
    expect(formatPercentage(0.5, 1)).toBe('50.0%');
  });

  it('处理大于1的值', () => {
    expect(formatPercentage(1.5)).toBe('150.00%');
  });
});

describe('formatCurrency', () => {
  it('格式化人民币', () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain('1,234.56');
  });

  it('格式化美元', () => {
    const result = formatCurrency(1234.56, 'USD');
    expect(result).toContain('1,234.56');
  });
});

describe('truncateText', () => {
  it('截断长文本', () => {
    const text = '这是一段很长的文本需要被截断';
    const result = truncateText(text, 10);
    expect(result.length).toBeLessThanOrEqual(13);
    expect(result).toContain('...');
  });

  it('不截断短文本', () => {
    const text = '短文本';
    expect(truncateText(text, 10)).toBe('短文本');
  });

  it('处理空字符串', () => {
    expect(truncateText('', 10)).toBe('');
  });

  it('处理 null/undefined', () => {
    expect(truncateText(null as unknown as string, 10)).toBeFalsy();
    expect(truncateText(undefined as unknown as string, 10)).toBeFalsy();
  });
});

describe('formatPhone', () => {
  it('脱敏手机号码', () => {
    expect(formatPhone('13812345678')).toBe('138****5678');
  });

  it('处理无效号码', () => {
    expect(formatPhone('')).toBe('');
    expect(formatPhone('123')).toBe('123');
  });

  it('长度不为11的号码返回原值', () => {
    expect(formatPhone('1381234567')).toBe('1381234567');
  });
});

describe('formatDuration', () => {
  it('格式化秒', () => {
    expect(formatDuration(45)).toBe('0:45');
  });

  it('格式化分钟', () => {
    expect(formatDuration(90)).toBe('1:30');
    expect(formatDuration(120)).toBe('2:00');
  });

  it('格式化小时', () => {
    expect(formatDuration(3661)).toBe('1:01:01');
  });

  it('格式化大于1小时', () => {
    expect(formatDuration(7200)).toBe('2:00:00');
  });
});

describe('formatRelativeTime', () => {
  it('返回相对时间', () => {
    const now = new Date();
    const result = formatRelativeTime(now);
    expect(['刚刚', '0秒前', '1秒前']).toContain(result);
  });

  it('返回X分钟前', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5分钟前');
  });
});

describe('formatStatus', () => {
  it('格式化用户状态', () => {
    expect(formatStatus('active', 'user')).toBe('正常');
    expect(formatStatus('inactive', 'user')).toBe('禁用');
    expect(formatStatus('banned', 'user')).toBe('封禁');
  });

  it('格式化订单状态', () => {
    expect(formatStatus('pending', 'order')).toBe('待支付');
    expect(formatStatus('paid', 'order')).toBe('已支付');
  });

  it('未知状态返回原值', () => {
    expect(formatStatus('unknown', 'user')).toBe('unknown');
  });
});

describe('formatBoolean', () => {
  it('格式化布尔值', () => {
    expect(formatBoolean(true)).toBe('是');
    expect(formatBoolean(false)).toBe('否');
  });
});

describe('formatEmail', () => {
  it('脱敏邮箱', () => {
    expect(formatEmail('test@example.com')).toBe('tes***@example.com');
  });

  it('短用户名不脱敏', () => {
    expect(formatEmail('ab@example.com')).toBe('ab@example.com');
  });

  it('无效邮箱返回原值', () => {
    expect(formatEmail('invalid')).toBe('invalid');
  });
});

describe('highlightText', () => {
  it('高亮关键字', () => {
    expect(highlightText('hello world', 'world')).toBe('hello <mark>world</mark>');
  });

  it('空关键字返回原文', () => {
    expect(highlightText('hello world', '')).toBe('hello world');
  });
});

describe('generateRandomColor', () => {
  it('返回有效的颜色值', () => {
    const color = generateRandomColor();
    expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

describe('getFileExtension', () => {
  it('获取文件扩展名', () => {
    expect(getFileExtension('test.txt')).toBe('txt');
    expect(getFileExtension('image.png')).toBe('png');
    expect(getFileExtension('file.tar.gz')).toBe('gz');
  });

  it('无扩展名返回空字符串', () => {
    expect(getFileExtension('noextension')).toBe('');
  });
});

describe('deepClone', () => {
  it('深度克隆对象', () => {
    const original = { a: 1, b: { c: 2 } };
    const cloned = deepClone(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
  });

  it('深度克隆数组', () => {
    const original = [1, [2, 3]];
    const cloned = deepClone(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });

  it('克隆原始值', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(null)).toBe(null);
  });
});

describe('generateId', () => {
  it('生成唯一ID', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
  });
});

describe('randomString', () => {
  it('生成指定长度的随机字符串', () => {
    const str = randomString(10);
    expect(str.length).toBe(10);
  });

  it('默认长度为8', () => {
    const str = randomString();
    expect(str.length).toBe(8);
  });
});

describe('randomNumber', () => {
  it('生成范围内的随机数', () => {
    const num = randomNumber(10, 20);
    expect(num).toBeGreaterThanOrEqual(10);
    expect(num).toBeLessThanOrEqual(20);
  });

  it('默认范围0-100', () => {
    const num = randomNumber();
    expect(num).toBeGreaterThanOrEqual(0);
    expect(num).toBeLessThanOrEqual(100);
  });
});

describe('groupBy', () => {
  it('按键分组', () => {
    const items = [
      { type: 'a', value: 1 },
      { type: 'b', value: 2 },
      { type: 'a', value: 3 },
    ];
    const grouped = groupBy(items, 'type');
    expect(grouped['a'].length).toBe(2);
    expect(grouped['b'].length).toBe(1);
  });
});

describe('unique', () => {
  it('数组去重', () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    expect(unique(['a', 'b', 'a'])).toEqual(['a', 'b']);
  });
});

describe('intersection', () => {
  it('数组交集', () => {
    expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    expect(intersection([1, 2], [3, 4])).toEqual([]);
  });
});

describe('difference', () => {
  it('数组差集', () => {
    expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
    expect(difference([1, 2, 3], [1, 2, 3])).toEqual([]);
  });
});

describe('buildQueryString', () => {
  it('构建查询字符串', () => {
    const result = buildQueryString({ a: 1, b: 'test' });
    expect(result).toContain('a=1');
    expect(result).toContain('b=test');
  });

  it('忽略空值', () => {
    const result = buildQueryString({ a: 1, b: null, c: '' });
    expect(result).toBe('a=1');
  });
});

describe('parseQueryString', () => {
  it('解析查询字符串', () => {
    const result = parseQueryString('a=1&b=test');
    expect(result).toEqual({ a: '1', b: 'test' });
  });
});
