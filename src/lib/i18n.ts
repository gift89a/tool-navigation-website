/**
 * 国际化工具库
 * 提供语言检测、切换和状态保持功能
 */

export type SupportedLocale = 'zh' | 'en';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['zh', 'en'];

export const LOCALE_NAMES = {
  zh: '中文',
  en: 'English',
} as const;

export const DEFAULT_LOCALE: SupportedLocale = 'zh';

/**
 * 检测用户首选语言
 */
export function detectUserLocale(): SupportedLocale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  // 1. 检查 URL 参数
  const urlParams = new URLSearchParams(window.location.search);
  const urlLocale = urlParams.get('lang') as SupportedLocale;
  if (urlLocale && SUPPORTED_LOCALES.includes(urlLocale)) {
    return urlLocale;
  }

  // 2. 检查 localStorage
  const storedLocale = localStorage.getItem('app-locale') as SupportedLocale;
  if (storedLocale && SUPPORTED_LOCALES.includes(storedLocale)) {
    return storedLocale;
  }

  // 3. 检查浏览器语言设置
  const browserLanguages = navigator.languages || [navigator.language];
  
  for (const lang of browserLanguages) {
    // 提取主要语言代码 (例如: 'zh-CN' -> 'zh')
    const primaryLang = lang.split('-')[0] as SupportedLocale;
    if (SUPPORTED_LOCALES.includes(primaryLang)) {
      return primaryLang;
    }
  }

  // 4. 返回默认语言
  return DEFAULT_LOCALE;
}

/**
 * 保存语言设置到 localStorage
 */
export function saveLocalePreference(locale: SupportedLocale): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('app-locale', locale);
  }
}

/**
 * 更新 URL 中的语言参数
 */
export function updateUrlLocale(locale: SupportedLocale): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.set('lang', locale);
  
  // 使用 replaceState 避免在历史记录中添加新条目
  window.history.replaceState({}, '', url.toString());
}

/**
 * 获取本地化的日期格式
 */
export function getLocaleDateFormat(locale: SupportedLocale): Intl.DateTimeFormatOptions {
  const formats: Record<SupportedLocale, Intl.DateTimeFormatOptions> = {
    zh: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    },
    en: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    },
  };

  return formats[locale];
}

/**
 * 格式化日期
 */
export function formatDate(date: Date, locale: SupportedLocale): string {
  const localeMap = {
    zh: 'zh-CN',
    en: 'en-US',
  };

  return new Intl.DateTimeFormat(localeMap[locale], getLocaleDateFormat(locale)).format(date);
}

/**
 * 格式化数字
 */
export function formatNumber(number: number, locale: SupportedLocale): string {
  const localeMap = {
    zh: 'zh-CN',
    en: 'en-US',
  };

  return new Intl.NumberFormat(localeMap[locale]).format(number);
}

/**
 * 获取相对时间格式
 */
export function getRelativeTime(date: Date, locale: SupportedLocale): string {
  const localeMap = {
    zh: 'zh-CN',
    en: 'en-US',
  };

  const rtf = new Intl.RelativeTimeFormat(localeMap[locale], { numeric: 'auto' });
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

  // 计算时间差
  const intervals = [
    { unit: 'year' as const, seconds: 31536000 },
    { unit: 'month' as const, seconds: 2592000 },
    { unit: 'day' as const, seconds: 86400 },
    { unit: 'hour' as const, seconds: 3600 },
    { unit: 'minute' as const, seconds: 60 },
    { unit: 'second' as const, seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    if (count >= 1) {
      return rtf.format(diffInSeconds < 0 ? -count : count, interval.unit);
    }
  }

  return rtf.format(0, 'second');
}

/**
 * 获取本地化的货币格式
 */
export function formatCurrency(amount: number, locale: SupportedLocale, currency?: string): string {
  const localeMap = {
    zh: 'zh-CN',
    en: 'en-US',
  };

  const currencyMap = {
    zh: 'CNY',
    en: 'USD',
  };

  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency: currency || currencyMap[locale],
  }).format(amount);
}

/**
 * 获取本地化的文本方向
 */
export function getTextDirection(locale: SupportedLocale): 'ltr' | 'rtl' {
  // 目前支持的语言都是从左到右
  return 'ltr';
}

/**
 * 检查是否为 RTL 语言
 */
export function isRTL(locale: SupportedLocale): boolean {
  return getTextDirection(locale) === 'rtl';
}

/**
 * 获取语言的本地化名称
 */
export function getLocaleName(locale: SupportedLocale, displayLocale: SupportedLocale): string {
  const names = {
    zh: {
      zh: '中文',
      en: 'Chinese',
    },
    en: {
      zh: '英语',
      en: 'English',
    },
  };

  return names[locale][displayLocale];
}