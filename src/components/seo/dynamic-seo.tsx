'use client';

import { useEffect } from 'react';
import Head from 'next/head';

interface DynamicSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  structuredData?: object;
}

export function DynamicSEO({
  title,
  description,
  keywords = [],
  image,
  url,
  structuredData,
}: DynamicSEOProps) {
  useEffect(() => {
    // 动态更新页面标题
    if (title) {
      document.title = title;
    }

    // 动态更新meta描述
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }

    // 动态更新关键词
    if (keywords.length > 0) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      const keywordString = keywords.join(', ');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywordString);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = keywordString;
        document.head.appendChild(meta);
      }
    }

    // 动态更新Open Graph标签
    if (image) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', image);
      }
    }

    if (url) {
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute('content', url);
      }
    }
  }, [title, description, keywords, image, url]);

  return (
    <>
      {structuredData && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        </Head>
      )}
    </>
  );
}