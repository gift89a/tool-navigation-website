import { NextRequest, NextResponse } from 'next/server';
import { getMockTools } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // 获取模拟工具数据
    let filteredTools = getMockTools();

    // 过滤工具
    if (category) {
      filteredTools = filteredTools.filter(tool => tool.categoryId === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTools = filteredTools.filter(tool =>
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.tags.some(tag => tag.name.toLowerCase().includes(searchLower))
      );
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTools = filteredTools.slice(startIndex, endIndex);

    const pagination = {
      page,
      limit,
      total: filteredTools.length,
      totalPages: Math.ceil(filteredTools.length / limit),
      hasMore: endIndex < filteredTools.length,
    };

    return NextResponse.json({
      data: {
        tools: paginatedTools,
        pagination,
      },
      message: 'Tools fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch tools',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}