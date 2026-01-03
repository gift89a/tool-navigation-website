import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateCategoryMetadata, generateBreadcrumbStructuredData, generateToolListStructuredData } from '@/lib/seo';
import type { Category, Tool } from '@/types';

// 模拟获取分类数据的函数
async function getCategory(slug: string): Promise<{ category: Category; tools: Tool[] } | null> {
  // TODO: 实际实现应该从数据库获取分类和工具数据
  const mockCategory: Category = {
    id: '1',
    name: '开发工具',
    description: '程序开发相关的在线工具，包含代码格式化、编解码、调试等功能',
    icon: '💻',
    color: '#3B82F6',
    slug,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockTools: Tool[] = [
    {
      id: '1',
      name: 'JSON格式化工具',
      slug: 'json-formatter',
      description: '在线JSON格式化、压缩、验证工具',
      icon: '🔧',
      url: 'https://jsonformatter.org',
      category: mockCategory,
      categoryId: '1',
      tags: [{ id: '1', name: 'JSON', createdAt: new Date(), updatedAt: new Date() }],
      rating: 4.8,
      usageCount: 15420,
      isActive: true,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  return { category: mockCategory, tools: mockTools };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategory(slug);

  if (!data) {
    return {
      title: '分类不存在',
      description: '您访问的分类页面不存在或已被删除',
    };
  }

  return generateCategoryMetadata(data.category, data.tools.length);
}

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCategory(slug);

  if (!data) {
    notFound();
  }

  const { category, tools } = data;
  
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: '首页', url: '/' },
    { name: category.name, url: `/category/${category.slug}` },
  ]);

  const toolListStructuredData = generateToolListStructuredData(tools, category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(toolListStructuredData),
        }}
      />
      {children}
    </>
  );
}