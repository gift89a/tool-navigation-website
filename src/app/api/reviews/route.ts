import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// GET /api/reviews - 获取评论列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('toolId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // TODO: 实际实现应该从数据库获取数据
    // 暂时返回模拟数据
    const mockReviews = [
      {
        id: '1',
        toolId: toolId || '1',
        rating: 5,
        comment: '非常好用的工具，界面简洁，功能强大！',
        author: '用户A',
        createdAt: new Date('2024-01-15'),
        helpful: 12,
        isHelpful: false
      },
      {
        id: '2',
        toolId: toolId || '1',
        rating: 4,
        comment: '功能不错，但是加载速度有点慢。',
        author: '用户B',
        createdAt: new Date('2024-01-10'),
        helpful: 8,
        isHelpful: true
      },
      {
        id: '3',
        toolId: toolId || '1',
        rating: 5,
        comment: '完美的工具，推荐给所有开发者！',
        author: '用户C',
        createdAt: new Date('2024-01-05'),
        helpful: 15,
        isHelpful: false
      }
    ];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = mockReviews.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedReviews,
      pagination: {
        page,
        limit,
        total: mockReviews.length,
        hasMore: endIndex < mockReviews.length
      }
    });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - 创建新评论
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, rating, comment, author } = body;

    // TODO: 实际实现应该保存到数据库
    const newReview = {
      id: Date.now().toString(),
      toolId,
      rating,
      comment,
      author,
      createdAt: new Date(),
      helpful: 0,
      isHelpful: false
    };

    return NextResponse.json({
      success: true,
      data: newReview
    });
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}