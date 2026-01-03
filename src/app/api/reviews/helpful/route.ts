import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/reviews/helpful - 标记评论为有用
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, userId } = body;

    if (!reviewId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 检查评论是否存在
    const review = await prisma.toolReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // 增加有用计数
    const updatedReview = await prisma.toolReview.update({
      where: { id: reviewId },
      data: {
        helpful: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        reviewId,
        helpful: updatedReview.helpful,
      },
    });
  } catch (error) {
    console.error('Failed to mark review as helpful:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark review as helpful' },
      { status: 500 }
    );
  }
}