'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  data: object | object[];
  id?: string;
}

export function StructuredData({ data, id }: StructuredDataProps) {
  useEffect(() => {
    // 确保数据有效
    if (!data) return;

    // 创建script标签
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id || `structured-data-${Date.now()}`;
    
    try {
      script.textContent = JSON.stringify(data, null, 0);
      document.head.appendChild(script);

      // 清理函数
      return () => {
        const existingScript = document.getElementById(script.id);
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    } catch (error) {
      console.error('Error adding structured data:', error);
    }
  }, [data, id]);

  return null;
}

// 预定义的结构化数据组件
export function WebsiteStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: process.env.NEXT_PUBLIC_APP_NAME || '工具导航',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    description: '发现和使用最好的在线工具，提高工作效率',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <StructuredData data={data} id="website-structured-data" />;
}

export function OrganizationStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: process.env.NEXT_PUBLIC_APP_NAME || '工具导航',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/logo.png`,
    description: '提供优质在线工具的导航平台',
    sameAs: [
      // 社交媒体链接
      'https://twitter.com/toolnavigator',
      'https://github.com/toolnavigator',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Chinese', 'English'],
    },
  };

  return <StructuredData data={data} id="organization-structured-data" />;
}

// FAQ结构化数据
export function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <StructuredData data={data} id="faq-structured-data" />;
}

// 面包屑导航结构化数据
export function BreadcrumbStructuredData({ 
  items 
}: { 
  items: Array<{ name: string; url: string }> 
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <StructuredData data={data} id="breadcrumb-structured-data" />;
}

// 工具评分结构化数据
export function RatingStructuredData({
  itemName,
  ratingValue,
  ratingCount,
  bestRating = 5,
  worstRating = 1,
}: {
  itemName: string;
  ratingValue: number;
  ratingCount: number;
  bestRating?: number;
  worstRating?: number;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: itemName,
    },
    ratingValue,
    ratingCount,
    bestRating,
    worstRating,
  };

  return <StructuredData data={data} id="rating-structured-data" />;
}

// 工具列表结构化数据
export function ToolListStructuredData({
  tools,
  listName,
  description,
}: {
  tools: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
  }>;
  listName: string;
  description?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description: description || `${listName}合集`,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        url: `${baseUrl}/tool/${tool.id}`,
        applicationCategory: tool.category,
        operatingSystem: 'Web Browser',
      },
    })),
  };

  return <StructuredData data={data} id="tool-list-structured-data" />;
}