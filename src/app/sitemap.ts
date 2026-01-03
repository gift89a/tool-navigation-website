import { MetadataRoute } from 'next';
// import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const currentDate = new Date();

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/favorites`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    // TODO: 实际实现应该从数据库获取数据
    // 模拟分类数据
    const mockCategories = [
      { slug: 'development', updatedAt: currentDate },
      { slug: 'design', updatedAt: currentDate },
      { slug: 'office', updatedAt: currentDate },
      { slug: 'security', updatedAt: currentDate },
      { slug: 'media', updatedAt: currentDate },
    ];

    // 模拟工具数据
    const mockTools = [
      { id: '1', updatedAt: currentDate },
      { id: '2', updatedAt: currentDate },
      { id: '3', updatedAt: currentDate },
      { id: '4', updatedAt: currentDate },
      { id: '5', updatedAt: currentDate },
    ];

    // 分类页面
    const categoryPages: MetadataRoute.Sitemap = mockCategories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // 工具详情页面
    const toolPages: MetadataRoute.Sitemap = mockTools.map((tool) => ({
      url: `${baseUrl}/tool/${tool.id}`,
      lastModified: tool.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...categoryPages, ...toolPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // 如果数据库连接失败，至少返回静态页面
    return staticPages;
  }
}

// 生成分类特定的网站地图
export async function generateCategorySitemap(categorySlug: string): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    // TODO: 实际实现应该从数据库获取该分类下的工具
    const mockTools = [
      { id: '1', updatedAt: new Date() },
      { id: '2', updatedAt: new Date() },
    ];

    return mockTools.map((tool) => ({
      url: `${baseUrl}/tool/${tool.id}`,
      lastModified: tool.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error(`Error generating sitemap for category ${categorySlug}:`, error);
    return [];
  }
}