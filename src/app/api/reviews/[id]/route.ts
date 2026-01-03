import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reviews/[id] - 获取单个评论
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const review = await prisma.toolReview.findUnique({
      where: { id },
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

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Failed to fetch review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

// PUT /api/reviews/[id] - 更新评论
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { rating, comment, userId } = body;

    // 验证评分范围
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // 检查评论是否存在
    const existingReview = await prisma.toolReview.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // 检查用户权限（只能更新自己的评论）
    if (userId && existingReview.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // 更新评论
    const updatedReview = await prisma.toolReview.update({
      where: { id },
      data: {
        ...(rating && { rating }),
        ...(comment !== undefined && { comment }),
        updatedAt: new Date(),
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

    // 如果评分有变化，更新工具的平均评分
    if (rating) {
      await updateToolRating(existingReview.toolId);
    }

    return NextResponse.json({
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    console.error('Failed to update review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - 删除评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // 检查评论是否存在
    const existingReview = await prisma.toolReview.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // 检查用户权限（只能删除自己的评论）
    if (userId && existingReview.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // 删除评论
    await prisma.toolReview.delete({
      where: { id },
    });

    // 更新工具的平均评分
    await updateToolRating(existingReview.toolId);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
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

    let averageRating = 0;
    if (reviews.length > 0) {
      averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      averageRating = Math.round(averageRating * 10) / 10; // 保留一位小数
    }

    await prisma.tool.update({
      where: { id: toolId },
      data: { rating: averageRating },
    });
  } catch (error) {
    console.error('Failed to update tool rating:', error);
  }
}