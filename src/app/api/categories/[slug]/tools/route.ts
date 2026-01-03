import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // 模拟分类工具数据 - 在实际部署时会连接数据库
    const mockCategoryTools = {
      'development-tools': [
        {
          id: '1',
          name: 'JSON 格式化工具',
          description: '在线JSON格式化、压缩和验证工具',
          url: 'https://jsonformatter.org',
          icon: '📋',
          category: { id: '3', name: '开发工具', slug: 'development-tools' },
          tags: [{ id: '1', name: 'JSON' }, { id: '2', name: '格式化' }],
          rating: 4.8,
          usageCount: 15420,
          isActive: true,
          isFeatured: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Base64 编解码',
          description: '在线Base64编码和解码工具',
          url: 'https://base64encode.org',
          icon: '🔐',
          category: { id: '3', name: '开发工具', slug: 'development-tools' },
          tags: [{ id: '3', name: 'Base64' }, { id: '4', name: '编码' }],
          rating: 4.6,
          usageCount: 12300,
          isActive: true,
          isFeatured: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      'image-processing': [
        {
          id: '3',
          name: '图片压缩工具',
          description: '在线图片压缩，支持JPG、PNG、WebP格式',
          url: 'https://tinypng.com',
          icon: '🖼️',
          category: { id: '2', name: '图片处理', slug: 'image-processing' },
          tags: [{ id: '5', name: '图片' }, { id: '6', name: '压缩' }],
          rating: 4.9,
          usageCount: 18900,
          isActive: true,
          isFeatured: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const tools = mockCategoryTools[slug as keyof typeof mockCategoryTools] || [];

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTools = tools.slice(startIndex, endIndex);

    const pagination = {
      page,
      limit,
      total: tools.length,
      totalPages: Math.ceil(tools.length / limit),
      hasMore: endIndex < tools.length,
    };

    return NextResponse.json({
      data: {
        tools: paginatedTools,
        pagination,
      },
      message: 'Category tools fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching category tools:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch category tools',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}