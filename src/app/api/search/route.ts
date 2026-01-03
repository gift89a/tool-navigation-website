import { NextRequest, NextResponse } from 'next/server';
import { searchMockTools } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    if (!query) {
      return NextResponse.json(
        {
          error: 'Query parameter is required',
          message: 'Please provide a search query',
        },
        { status: 400 }
      );
    }

    // 搜索工具
    const searchResults = searchMockTools(query);

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = searchResults.slice(startIndex, endIndex);

    const pagination = {
      page,
      limit,
      total: searchResults.length,
      totalPages: Math.ceil(searchResults.length / limit),
      hasMore: endIndex < searchResults.length,
    };

    return NextResponse.json({
      data: {
        tools: paginatedResults,
        pagination,
        query,
      },
      message: 'Search completed successfully',
    });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      {
        error: 'Search failed',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}