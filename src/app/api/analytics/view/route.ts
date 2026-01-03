import { NextRequest, NextResponse } from 'next/server';

// 记录工具浏览
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, toolName, category, timestamp, userAgent, referrer } = body;

    if (!toolId || !toolName) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'toolId and toolName are required',
        },
        { status: 400 }
      );
    }

    // TODO: 实际实现应该记录到数据库
    // 这里只是模拟记录
    console.log('Tool view recorded:', {
      toolId,
      toolName,
      category,
      timestamp: new Date(timestamp),
      userAgent,
      referrer,
    });

    return NextResponse.json({
      message: 'Tool view recorded successfully',
    });
  } catch (error) {
    console.error('Error recording tool view:', error);
    return NextResponse.json(
      {
        error: 'Failed to record tool view',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}