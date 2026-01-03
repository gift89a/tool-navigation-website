import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reviews - 获取评论列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('toolId');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};
    if (toolId) where.toolId = toolId;
    if (userId) where.userId = userId;

    // 获取评论
    const reviews = await prisma.toolReview.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        tool: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
      orderBy: {
        [sortBy]: order as 'asc' | 'desc',
      },
      skip,
      take: limit,
    });

    // 获取总数
    const total = await prisma.toolReview.count({ where });

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
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
    const { toolId, userId, rating, comment } = body;

    // 验证必需字段
    if (!toolId || !userId || !rating) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 验证评分范围
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // 检查工具是否存在
    const tool = await prisma.tool.findUnique({
      where: { id: toolId },
    });

    if (!tool) {
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      );
    }

    // 创建或更新评论
    const review = await prisma.toolReview.upsert({
      where: {
        userId_toolId: {
          userId,
          toolId,
        },
      },
      update: {
        rating,
        comment,
        updatedAt: new Date(),
      },
      create: {
        toolId,
        userId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        tool: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });

    // 更新工具的平均评分
    await updateToolRating(toolId);

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// 更新工具平均评分的辅助函数
async function updateToolRating(toolId: string) {
  try {
    const reviews = await prisma.toolReview.findMany({
      where: { toolId },
      select: { rating: true },
    });

    if (reviews.length > 0) {
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      await prisma.tool.update({
        where: { id: toolId },
        data: { rating: Math.round(averageRating * 10) / 10 }, // 保留一位小数
      });
    }
  } catch (error) {
    console.error('Failed to update tool rating:', error);
  }
}