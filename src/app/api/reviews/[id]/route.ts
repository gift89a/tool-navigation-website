import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// GET /api/reviews/[id] - 获取单个评论
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: 实际实现应该从数据库获取数据
    const mockReview = {
      id,
      toolId: '1',
      rating: 5,
      comment: '非常好用的工具，界面简洁，功能强大！',
      author: '用户A',
      createdAt: new Date('2024-01-15'),
      helpful: 12,
      isHelpful: false
    };

    return NextResponse.json({
      success: true,
      data: mockReview
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

    // TODO: 实际实现应该更新数据库
    const updatedReview = {
      id,
      ...body,
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: updatedReview
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

    // TODO: 实际实现应该从数据库删除
    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}