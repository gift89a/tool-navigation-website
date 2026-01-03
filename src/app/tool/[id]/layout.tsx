import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateToolMetadata, generateToolStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo';
import type { Tool } from '@/types';

// 模拟获取工具数据的函数（实际应该从数据库获取）
async function getTool(id: string): Promise<Tool | null> {
  // TODO: 实际实现应该从数据库获取工具数据
  // 这里使用模拟数据
  const mockTool: Tool = {
    id,
    name: 'JSON格式化工具',
    slug: 'json-formatter',
    description: '在线JSON格式化、压缩、验证工具，支持语法高亮和错误提示',
    icon: '🔧',
    url: 'https://jsonformatter.org',
    category: {
      id: '1',
      name: '开发工具',
      description: '程序开发相关工具',
      icon: '💻',
      color: '#3B82F6',
      slug: 'development',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    categoryId: '1',
    tags: [
      { id: '1', name: 'JSON', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', name: '格式化', createdAt: new Date(), updatedAt: new Date() },
      { id: '3', name: '验证', createdAt: new Date(), updatedAt: new Date() }
    ],
    rating: 4.8,
    usageCount: 15420,
    isActive: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return mockTool;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const tool = await getTool(id);

  if (!tool) {
    return {
      title: '工具不存在',
      description: '您访问的工具页面不存在或已被删除',
    };
  }

  return generateToolMetadata(tool);
}

export default async function ToolLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = await getTool(id);

  if (!tool) {
    notFound();
  }

  const toolStructuredData = generateToolStructuredData(tool);
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: '首页', url: '/' },
    { name: tool.category.name, url: `/category/${tool.category.slug}` },
    { name: tool.name, url: `/tool/${tool.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(toolStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      {children}
    </>
  );
}