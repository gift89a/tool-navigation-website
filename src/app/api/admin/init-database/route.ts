import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 一次性数据库初始化路由
// 部署后访问一次即可初始化数据库
export async function POST(request: NextRequest) {
  try {
    // 检查是否已经初始化过
    const existingCategories = await prisma.category.count();
    if (existingCategories > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already initialized',
        data: { categories: existingCategories }
      });
    }

    // 创建分类数据
    const categories = await prisma.category.createMany({
      data: [
        {
          name: '开发工具',
          slug: 'development',
          description: '编程开发相关的实用工具',
          icon: '💻',
          color: '#3B82F6',
          isActive: true,
        },
        {
          name: '设计工具',
          slug: 'design',
          description: 'UI/UX设计和图形处理工具',
          icon: '🎨',
          color: '#EF4444',
          isActive: true,
        },
        {
          name: '效率工具',
          slug: 'productivity',
          description: '提升工作效率的各类工具',
          icon: '⚡',
          color: '#10B981',
          isActive: true,
        },
        {
          name: '文档工具',
          slug: 'documentation',
          description: '文档编写和管理工具',
          icon: '📝',
          color: '#F59E0B',
          isActive: true,
        },
        {
          name: '测试工具',
          slug: 'testing',
          description: '软件测试和质量保证工具',
          icon: '🧪',
          color: '#8B5CF6',
          isActive: true,
        },
        {
          name: '数据工具',
          slug: 'data',
          description: '数据处理和分析工具',
          icon: '📊',
          color: '#06B6D4',
          isActive: true,
        },
      ]
    });

    // 获取创建的分类
    const createdCategories = await prisma.category.findMany();
    const categoryMap = Object.fromEntries(
      createdCategories.map(cat => [cat.slug, cat.id])
    );

    // 创建标签数据
    const tags = await prisma.tag.createMany({
      data: [
        { name: '在线工具' },
        { name: '免费' },
        { name: '开源' },
        { name: '编程' },
        { name: '设计' },
        { name: '效率' },
        { name: '协作' },
        { name: 'API' },
      ]
    });

    // 获取创建的标签
    const createdTags = await prisma.tag.findMany();

    // 创建工具数据
    const tools = await prisma.tool.createMany({
      data: [
        {
          name: 'Visual Studio Code',
          slug: 'vscode',
          description: '微软开发的免费代码编辑器，支持多种编程语言和丰富的插件生态',
          url: 'https://code.visualstudio.com',
          icon: '🔷',
          rating: 4.8,
          usageCount: 15420,
          isActive: true,
          isFeatured: true,
          categoryId: categoryMap['development'],
        },
        {
          name: 'Figma',
          slug: 'figma',
          description: '基于浏览器的协作式界面设计工具，支持实时协作和原型制作',
          url: 'https://figma.com',
          icon: '🎨',
          rating: 4.7,
          usageCount: 12800,
          isActive: true,
          isFeatured: true,
          categoryId: categoryMap['design'],
        },
        {
          name: 'Notion',
          slug: 'notion',
          description: '集笔记、任务管理、数据库于一体的全能工作空间',
          url: 'https://notion.so',
          icon: '📝',
          rating: 4.6,
          usageCount: 9500,
          isActive: true,
          isFeatured: false,
          categoryId: categoryMap['productivity'],
        },
        {
          name: 'GitHub',
          slug: 'github',
          description: '全球最大的代码托管平台，支持版本控制和协作开发',
          url: 'https://github.com',
          icon: '🐙',
          rating: 4.9,
          usageCount: 18900,
          isActive: true,
          isFeatured: true,
          categoryId: categoryMap['development'],
        },
        {
          name: 'Postman',
          slug: 'postman',
          description: 'API 开发和测试的完整平台，支持请求构建、测试和文档生成',
          url: 'https://postman.com',
          icon: '📮',
          rating: 4.5,
          usageCount: 7200,
          isActive: true,
          isFeatured: false,
          categoryId: categoryMap['testing'],
        },
      ]
    });

    const finalCounts = {
      categories: await prisma.category.count(),
      tools: await prisma.tool.count(),
      tags: await prisma.tag.count(),
    };

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      data: finalCounts
    });

  } catch (error) {
    console.error('Database initialization failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database initialization failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}