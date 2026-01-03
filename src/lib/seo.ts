import type { Metadata } from 'next';
import type { Tool, Category } from '@/types';

// 基础SEO配置
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const SITE_NAME = process.env.NEXT_PUBLIC_APP_NAME || '工具导航';
const DEFAULT_DESCRIPTION = '发现和使用最好的在线工具，提高工作效率。包含开发工具、设计工具、办公工具等多个分类。';

// 生成基础元数据
export function generateBaseMetadata(
  title: string,
  description?: string,
  path?: string,
  image?: string
): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} - ${SITE_NAME}`;
  const finalDescription = description || DEFAULT_DESCRIPTION;
  const url = path ? `${BASE_URL}${path}` : BASE_URL;
  const imageUrl = image || `${BASE_URL}/og-default.png`;

  return {
    title: fullTitle,
    description: finalDescription,
    keywords: [
      '在线工具',
      '工具导航',
      '开发工具',
      '设计工具',
      '办公工具',
      '效率工具',
      'online tools',
      'productivity',
      'development',
      'design'
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    manifest: '/manifest.json',
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
      locale: 'zh_CN',
      url,
      title: fullTitle,
      description: finalDescription,
      siteName: SITE_NAME,
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
      description: finalDescription,
      images: [imageUrl],
      creator: '@toolnavigator',
    },
    alternates: {
      canonical: url,
      languages: {
        'zh-CN': url,
        'en-US': `${url}?lang=en`,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_SITE_VERIFICATION,
    },
  };
}

// 生成首页元数据
export function generateHomeMetadata(): Metadata {
  return generateBaseMetadata(
    SITE_NAME,
    '发现和使用最好的在线工具，提高工作效率。包含JSON格式化、Base64编解码、图片压缩、密码生成等数百种实用工具。',
    '/'
  );
}

// 生成工具详情页元数据
export function generateToolMetadata(tool: Tool): Metadata {
  const title = `${tool.name} - 在线${tool.category.name}`;
  const description = `${tool.description}。免费在线使用，无需下载安装。评分${tool.rating.toFixed(1)}，已被${tool.usageCount.toLocaleString()}人使用。`;
  const path = `/tool/${tool.id}`;
  
  const keywords = [
    tool.name,
    tool.category.name,
    ...tool.tags.map(tag => tag.name),
    '在线工具',
    '免费工具'
  ];

  const baseMetadata = generateBaseMetadata(title, description, path);
  
  return {
    ...baseMetadata,
    keywords,
    openGraph: {
      title: baseMetadata.openGraph?.title,
      description: baseMetadata.openGraph?.description,
      url: baseMetadata.openGraph?.url,
      siteName: baseMetadata.openGraph?.siteName,
      images: baseMetadata.openGraph?.images,
      locale: baseMetadata.openGraph?.locale,
      type: 'article',
    },
  };
}

// 生成分类页面元数据
export function generateCategoryMetadata(category: Category, toolCount?: number): Metadata {
  const title = `${category.name} - 在线工具合集`;
  const description = `${category.description}。精选${toolCount || '多个'}个优质${category.name}，全部免费在线使用，提高工作效率。`;
  const path = `/category/${category.slug}`;

  return generateBaseMetadata(title, description, path);
}

// 生成搜索页面元数据
export function generateSearchMetadata(query?: string, resultCount?: number): Metadata {
  const title = query ? `搜索"${query}"的结果` : '搜索工具';
  const description = query 
    ? `找到${resultCount || 0}个与"${query}"相关的在线工具。`
    : '搜索您需要的在线工具，包含开发、设计、办公等多个分类的实用工具。';
  const path = query ? `/search?q=${encodeURIComponent(query)}` : '/search';

  return generateBaseMetadata(title, description, path);
}

// 生成收藏页面元数据
export function generateFavoritesMetadata(favoriteCount?: number): Metadata {
  const title = '我的收藏';
  const description = `管理您收藏的${favoriteCount || 0}个在线工具，快速访问常用工具。`;
  const path = '/favorites';

  return generateBaseMetadata(title, description, path);
}

// 生成结构化数据
export function generateToolStructuredData(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: tool.url,
    applicationCategory: tool.category.name,
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.rating,
      ratingCount: Math.floor(tool.usageCount / 10), // 估算评分数量
      bestRating: 5,
      worstRating: 1,
    },
    keywords: tool.tags.map(tag => tag.name).join(', '),
  };
}

// 生成网站结构化数据
export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// 生成面包屑结构化数据
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// 生成工具列表结构化数据
export function generateToolListStructuredData(tools: Tool[], category?: Category) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: category ? `${category.name}工具列表` : '在线工具列表',
    description: category ? category.description : '精选在线工具合集',
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        url: `${BASE_URL}/tool/${tool.id}`,
        applicationCategory: tool.category.name,
      },
    })),
  };
}