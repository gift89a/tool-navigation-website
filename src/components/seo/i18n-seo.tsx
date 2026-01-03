'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { generateHreflangTags, LOCALE_CONFIG, type SupportedLocale } from '@/lib/i18n-seo';

interface I18nSEOProps {
  currentPath: string;
}

export function I18nSEO({ currentPath }: I18nSEOProps) {
  const { locale } = useAppStore();
  const currentLocale = (locale === 'zh' ? 'zh-CN' : 'en-US') as SupportedLocale;

  useEffect(() => {
    // 更新HTML lang属性
    const htmlElement = document.documentElement;
    const config = LOCALE_CONFIG[currentLocale];
    htmlElement.lang = config.htmlLang;
    htmlElement.dir = config.direction;

    // 生成并添加hreflang标签
    const hreflangTags = generateHreflangTags(currentPath, currentLocale);
    
    // 移除现有的hreflang标签
    const existingTags = document.querySelectorAll('link[hreflang]');
    existingTags.forEach(tag => tag.remove());

    // 添加新的hreflang标签
    hreflangTags.forEach(({ hrefLang, href }) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hrefLang;
      link.href = href;
      document.head.appendChild(link);
    });

    // 清理函数
    return () => {
      const tagsToRemove = document.querySelectorAll('link[hreflang]');
      tagsToRemove.forEach(tag => tag.remove());
    };
  }, [currentPath, currentLocale]);

  return null;
}

// 语言切换器组件
export function LanguageSwitcher({ 
  currentPath, 
  className = '' 
}: { 
  currentPath: string; 
  className?: string; 
}) {
  const { locale, setLocale } = useAppStore();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  const handleLanguageChange = (newLocale: 'zh' | 'en') => {
    setLocale(newLocale);
    
    // 更新URL
    const targetLocale = newLocale === 'zh' ? 'zh-CN' : 'en-US';
    const newUrl = targetLocale === 'zh-CN' 
      ? `${baseUrl}${currentPath}`
      : `${baseUrl}${currentPath}?lang=${targetLocale}`;
    
    // 使用replace而不是push，避免在历史记录中留下语言切换记录
    window.history.replaceState({}, '', newUrl);
  };

  return (
    <div className={`language-switcher ${className}`}>
      <button
        onClick={() => handleLanguageChange('zh')}
        className={`px-2 py-1 text-sm rounded ${
          locale === 'zh' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        aria-label="切换到中文"
      >
        中文
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-2 py-1 text-sm rounded ml-1 ${
          locale === 'en' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}

// 多语言面包屑组件
export function I18nBreadcrumb({ 
  items 
}: { 
  items: Array<{ name: string; url: string; nameEn?: string }> 
}) {
  const { locale } = useAppStore();
  const isEnglish = locale === 'en';

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          {index === items.length - 1 ? (
            <span className="text-gray-900 dark:text-gray-100">
              {isEnglish && item.nameEn ? item.nameEn : item.name}
            </span>
          ) : (
            <a 
              href={item.url} 
              className="hover:text-gray-900 dark:hover:text-gray-100"
            >
              {isEnglish && item.nameEn ? item.nameEn : item.name}
            </a>
          )}
        </span>
      ))}
    </nav>
  );
}

// 多语言元标签组件
export function I18nMetaTags({ 
  title, 
  description, 
  keywords 
}: { 
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  keywords?: { zh: string[]; en: string[] };
}) {
  const { locale } = useAppStore();
  const isEnglish = locale === 'en';

  useEffect(() => {
    // 更新页面标题
    document.title = isEnglish ? title.en : title.zh;

    // 更新meta描述
    const metaDescription = document.querySelector('meta[name="description"]');
    const desc = isEnglish ? description.en : description.zh;
    if (metaDescription) {
      metaDescription.setAttribute('content', desc);
    }

    // 更新关键词
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      const kw = isEnglish ? keywords.en.join(', ') : keywords.zh.join(', ');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', kw);
      }
    }

    // 更新Open Graph标签
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', isEnglish ? title.en : title.zh);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', desc);
    }

    // 更新Twitter标签
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', isEnglish ? title.en : title.zh);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', desc);
    }
  }, [locale, title, description, keywords, isEnglish]);

  return null;
}