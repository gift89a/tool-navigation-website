import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// POST /api/reviews/helpful - 标记评论为有用
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, helpful } = body;

    // TODO: 实际实现应该更新数据库
    const result = {
      reviewId,
      helpful,
      newHelpfulCount: helpful ? 13 : 11 // 模拟数据
    };

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Failed to update helpful status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update helpful status' },
      { status: 500 }
    );
  }
}