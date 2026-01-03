/**
 * SEO验证工具
 * 用于验证页面SEO元素的完整性和正确性
 */

export interface SEOValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

export interface PageSEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  structuredData?: object[];
}

// 验证页面SEO
export function validatePageSEO(data: PageSEOData): SEOValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // 验证标题
  if (!data.title) {
    errors.push('缺少页面标题');
    score -= 20;
  } else {
    if (data.title.length < 10) {
      warnings.push('页面标题过短，建议至少10个字符');
      score -= 5;
    }
    if (data.title.length > 60) {
      warnings.push('页面标题过长，建议不超过60个字符');
      score -= 5;
    }
  }

  // 验证描述
  if (!data.description) {
    errors.push('缺少页面描述');
    score -= 15;
  } else {
    if (data.description.length < 50) {
      warnings.push('页面描述过短，建议至少50个字符');
      score -= 3;
    }
    if (data.description.length > 160) {
      warnings.push('页面描述过长，建议不超过160个字符');
      score -= 3;
    }
  }

  // 验证关键词
  if (!data.keywords || data.keywords.length === 0) {
    warnings.push('缺少关键词');
    score -= 5;
  } else if (data.keywords.length > 10) {
    warnings.push('关键词过多，建议不超过10个');
    score -= 3;
  }

  // 验证Open Graph
  if (!data.ogTitle) {
    warnings.push('缺少Open Graph标题');
    score -= 5;
  }
  if (!data.ogDescription) {
    warnings.push('缺少Open Graph描述');
    score -= 5;
  }
  if (!data.ogImage) {
    warnings.push('缺少Open Graph图片');
    score -= 5;
  }
  if (!data.ogUrl) {
    warnings.push('缺少Open Graph URL');
    score -= 3;
  }

  // 验证Twitter Card
  if (!data.twitterCard) {
    warnings.push('缺少Twitter Card类型');
    score -= 3;
  }
  if (!data.twitterTitle) {
    warnings.push('缺少Twitter标题');
    score -= 3;
  }
  if (!data.twitterDescription) {
    warnings.push('缺少Twitter描述');
    score -= 3;
  }
  if (!data.twitterImage) {
    warnings.push('缺少Twitter图片');
    score -= 3;
  }

  // 验证规范URL
  if (!data.canonicalUrl) {
    warnings.push('缺少规范URL');
    score -= 5;
  }

  // 验证结构化数据
  if (!data.structuredData || data.structuredData.length === 0) {
    warnings.push('缺少结构化数据');
    score -= 10;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score),
  };
}

// 从DOM中提取SEO数据
export function extractSEODataFromDOM(): PageSEOData {
  if (typeof window === 'undefined') {
    return {};
  }

  const getMetaContent = (selector: string): string | undefined => {
    const element = document.querySelector(selector);
    return element?.getAttribute('content') || undefined;
  };

  const getStructuredData = (): object[] => {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const data: object[] = [];
    
    scripts.forEach((script) => {
      try {
        const jsonData = JSON.parse(script.textContent || '');
        data.push(jsonData);
      } catch (error) {
        console.warn('Invalid structured data found:', error);
      }
    });
    
    return data;
  };

  return {
    title: document.title,
    description: getMetaContent('meta[name="description"]'),
    keywords: getMetaContent('meta[name="keywords"]')?.split(',').map(k => k.trim()),
    ogTitle: getMetaContent('meta[property="og:title"]'),
    ogDescription: getMetaContent('meta[property="og:description"]'),
    ogImage: getMetaContent('meta[property="og:image"]'),
    ogUrl: getMetaContent('meta[property="og:url"]'),
    twitterCard: getMetaContent('meta[name="twitter:card"]'),
    twitterTitle: getMetaContent('meta[name="twitter:title"]'),
    twitterDescription: getMetaContent('meta[name="twitter:description"]'),
    twitterImage: getMetaContent('meta[name="twitter:image"]'),
    canonicalUrl: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || undefined,
    structuredData: getStructuredData(),
  };
}

// 生成SEO报告
export function generateSEOReport(data: PageSEOData): string {
  const result = validatePageSEO(data);
  
  let report = `SEO分析报告\n`;
  report += `=================\n`;
  report += `总分: ${result.score}/100\n`;
  report += `状态: ${result.isValid ? '✅ 通过' : '❌ 需要改进'}\n\n`;

  if (result.errors.length > 0) {
    report += `错误 (${result.errors.length}):\n`;
    result.errors.forEach((error, index) => {
      report += `${index + 1}. ❌ ${error}\n`;
    });
    report += '\n';
  }

  if (result.warnings.length > 0) {
    report += `警告 (${result.warnings.length}):\n`;
    result.warnings.forEach((warning, index) => {
      report += `${index + 1}. ⚠️ ${warning}\n`;
    });
    report += '\n';
  }

  if (result.errors.length === 0 && result.warnings.length === 0) {
    report += '🎉 所有SEO检查都通过了！\n';
  }

  return report;
}

// 检查页面加载性能对SEO的影响
export function checkPagePerformance(): Promise<{
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
}> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({
        loadTime: 0,
        domContentLoaded: 0,
      });
      return;
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const result = {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    };

    // 尝试获取Web Vitals数据
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            (result as any).firstContentfulPaint = entry.startTime;
          }
          if (entry.entryType === 'largest-contentful-paint') {
            (result as any).largestContentfulPaint = entry.startTime;
          }
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            (result as any).cumulativeLayoutShift = (result as any).cumulativeLayoutShift || 0;
            (result as any).cumulativeLayoutShift += (entry as any).value;
          }
        });
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
      
      // 5秒后停止观察并返回结果
      setTimeout(() => {
        observer.disconnect();
        resolve(result);
      }, 5000);
    } else {
      resolve(result);
    }
  });
}