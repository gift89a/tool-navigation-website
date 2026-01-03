import type { Metadata } from 'next';

// 支持的语言
export const SUPPORTED_LOCALES = ['zh-CN', 'en-US'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

// 语言配置
export const LOCALE_CONFIG = {
  'zh-CN': {
    name: '简体中文',
    htmlLang: 'zh-CN',
    ogLocale: 'zh_CN',
    direction: 'ltr',
  },
  'en-US': {
    name: 'English',
    htmlLang: 'en-US',
    ogLocale: 'en_US',
    direction: 'ltr',
  },
} as const;

// 多语言SEO文本
export const SEO_TRANSLATIONS = {
  'zh-CN': {
    siteName: '工具导航',
    siteDescription: '发现和使用最好的在线工具，提高工作效率。包含开发工具、设计工具、办公工具等多个分类。',
    keywords: [
      '在线工具',
      '工具导航',
      '开发工具',
      '设计工具',
      '办公工具',
      '效率工具',
      'JSON格式化',
      'Base64编解码',
      '图片压缩',
      '密码生成'
    ],
    pages: {
      home: {
        title: '工具导航 - 发现最好的在线工具',
        description: '发现和使用最好的在线工具，提高工作效率。包含JSON格式化、Base64编解码、图片压缩、密码生成等数百种实用工具。',
      },
      search: {
        title: '搜索工具',
        description: '搜索您需要的在线工具，包含开发、设计、办公等多个分类的实用工具。',
        titleWithQuery: '搜索"{query}"的结果',
        descriptionWithQuery: '找到{count}个与"{query}"相关的在线工具。',
      },
      favorites: {
        title: '我的收藏',
        description: '管理您收藏的在线工具，快速访问常用工具。',
        descriptionWithCount: '管理您收藏的{count}个在线工具，快速访问常用工具。',
      },
      category: {
        titleSuffix: ' - 在线工具合集',
        descriptionTemplate: '{description}。精选{count}个优质{name}，全部免费在线使用，提高工作效率。',
      },
      tool: {
        titleTemplate: '{name} - 在线{category}',
        descriptionTemplate: '{description}。免费在线使用，无需下载安装。评分{rating}，已被{usage}人使用。',
      },
    },
  },
  'en-US': {
    siteName: 'Tool Navigator',
    siteDescription: 'Discover and use the best online tools to boost your productivity. Including development tools, design tools, office tools and more.',
    keywords: [
      'online tools',
      'tool navigator',
      'development tools',
      'design tools',
      'office tools',
      'productivity tools',
      'JSON formatter',
      'Base64 encoder',
      'image compressor',
      'password generator'
    ],
    pages: {
      home: {
        title: 'Tool Navigator - Discover the Best Online Tools',
        description: 'Discover and use the best online tools to boost your productivity. Including JSON formatter, Base64 encoder, image compressor, password generator and hundreds of useful tools.',
      },
      search: {
        title: 'Search Tools',
        description: 'Search for the online tools you need, including practical tools in development, design, office and other categories.',
        titleWithQuery: 'Search results for "{query}"',
        descriptionWithQuery: 'Found {count} online tools related to "{query}".',
      },
      favorites: {
        title: 'My Favorites',
        description: 'Manage your favorite online tools and quickly access frequently used tools.',
        descriptionWithCount: 'Manage your {count} favorite online tools and quickly access frequently used tools.',
      },
      category: {
        titleSuffix: ' - Online Tools Collection',
        descriptionTemplate: '{description}. Curated {count} quality {name}, all free to use online to improve work efficiency.',
      },
      tool: {
        titleTemplate: '{name} - Online {category}',
        descriptionTemplate: '{description}. Free to use online, no download required. Rating {rating}, used by {usage} people.',
      },
    },
  },
} as const;

// 获取当前语言的SEO文本
export function getSEOTranslations(locale: SupportedLocale = 'zh-CN') {
  return SEO_TRANSLATIONS[locale] || SEO_TRANSLATIONS['zh-CN'];
}

// 生成多语言元数据
export function generateI18nMetadata(
  locale: SupportedLocale,
  title: string,
  description: string,
  path: string = '/',
  alternateLanguages?: Record<string, string>
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const config = LOCALE_CONFIG[locale];
  const translations = getSEOTranslations(locale);
  
  const fullTitle = title === translations.siteName ? title : `${title} - ${translations.siteName}`;
  const url = `${baseUrl}${path}`;
  const imageUrl = `${baseUrl}/og-${locale}.png`;

  // 构建alternate languages
  const alternates: Record<string, string> = {
    canonical: url,
  };

  // 添加语言版本
  SUPPORTED_LOCALES.forEach((supportedLocale) => {
    const localeConfig = LOCALE_CONFIG[supportedLocale];
    alternates[localeConfig.htmlLang] = supportedLocale === locale 
      ? url 
      : `${baseUrl}${path}?lang=${supportedLocale}`;
  });

  // 如果提供了自定义的alternate languages，合并它们
  if (alternateLanguages) {
    Object.assign(alternates, alternateLanguages);
  }

  return {
    title: fullTitle,
    description,
    keywords: [...translations.keywords],
    authors: [{ name: translations.siteName }],
    creator: translations.siteName,
    publisher: translations.siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: config.ogLocale,
      url,
      title: fullTitle,
      description,
      siteName: translations.siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: '@toolnavigator',
    },
    alternates: {
      canonical: url,
      languages: alternates,
    },
    other: {
      'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
    },
  };
}

// 生成hreflang标签
export function generateHreflangTags(currentPath: string, currentLocale: SupportedLocale) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const tags: Array<{ hrefLang: string; href: string }> = [];

  SUPPORTED_LOCALES.forEach((locale) => {
    const config = LOCALE_CONFIG[locale];
    const href = locale === 'zh-CN' 
      ? `${baseUrl}${currentPath}`
      : `${baseUrl}${currentPath}?lang=${locale}`;
    
    tags.push({
      hrefLang: config.htmlLang,
      href,
    });
  });

  // 添加x-default
  tags.push({
    hrefLang: 'x-default',
    href: `${baseUrl}${currentPath}`,
  });

  return tags;
}

// 生成多语言结构化数据
export function generateI18nStructuredData(
  locale: SupportedLocale,
  type: 'website' | 'organization' | 'breadcrumb',
  data?: any
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const translations = getSEOTranslations(locale);

  switch (type) {
    case 'website':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@language': locale,
        name: translations.siteName,
        url: baseUrl,
        description: translations.siteDescription,
        inLanguage: locale,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/search?q={search_term_string}&lang=${locale}`,
          },
          'query-input': 'required name=search_term_string',
        },
      };

    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@language': locale,
        name: translations.siteName,
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: translations.siteDescription,
        inLanguage: locale,
        sameAs: [
          'https://twitter.com/toolnavigator',
          'https://github.com/toolnavigator',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: SUPPORTED_LOCALES,
        },
      };

    case 'breadcrumb':
      if (!data || !Array.isArray(data)) return null;
      
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@language': locale,
        itemListElement: data.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${item.url}${locale !== 'zh-CN' ? `?lang=${locale}` : ''}`,
        })),
      };

    default:
      return null;
  }
}

// 检测用户首选语言
export function detectUserLocale(
  acceptLanguage?: string,
  defaultLocale: SupportedLocale = 'zh-CN'
): SupportedLocale {
  if (!acceptLanguage) return defaultLocale;

  // 解析Accept-Language头
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, q = '1'] = lang.trim().split(';q=');
      return { code: code.trim(), quality: parseFloat(q) };
    })
    .sort((a, b) => b.quality - a.quality);

  // 查找匹配的语言
  for (const { code } of languages) {
    // 精确匹配
    if (SUPPORTED_LOCALES.includes(code as SupportedLocale)) {
      return code as SupportedLocale;
    }
    
    // 语言代码匹配（如 'en' 匹配 'en-US'）
    const langCode = code.split('-')[0];
    const matchedLocale = SUPPORTED_LOCALES.find(locale => 
      locale.startsWith(langCode)
    );
    
    if (matchedLocale) {
      return matchedLocale;
    }
  }

  return defaultLocale;
}

// 生成多语言网站地图
export function generateI18nSitemap(locale: SupportedLocale) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const langParam = locale !== 'zh-CN' ? `?lang=${locale}` : '';

  return [
    {
      url: `${baseUrl}/${langParam}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          SUPPORTED_LOCALES.map(loc => [
            LOCALE_CONFIG[loc].htmlLang,
            `${baseUrl}/${loc !== 'zh-CN' ? `?lang=${loc}` : ''}`
          ])
        ),
      },
    },
    // 可以添加更多页面...
  ];
}