import { NextRequest, NextResponse } from 'next/server';

// 获取指定位置的广告数据
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ position: string }> }
) {
  try {
    const { position } = await params;

    if (!position) {
      return NextResponse.json(
        {
          error: 'Position parameter is required',
          message: 'Please specify an ad position',
        },
        { status: 400 }
      );
    }

    // 模拟广告数据 - 在实际部署时会连接数据库
    const mockAdData = {
      id: `ad-${position}-${Date.now()}`,
      position,
      content: getDefaultAdContent(position),
      isActive: true,
      format: 'html',
      width: position === 'header' ? 728 : 300,
      height: position === 'header' ? 90 : 250,
    };

    return NextResponse.json({
      data: mockAdData,
      message: 'Ad data fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching ad data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch ad data',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// 获取默认广告内容
function getDefaultAdContent(position: string): string {
  const defaultContent = {
    header: '<div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; padding: 20px; text-align: center; border-radius: 8px;">🚀 发现更多优质工具 - 点击了解</div>',
    sidebar: '<div style="background: #f8f9fa; border: 2px dashed #dee2e6; padding: 40px; text-align: center; border-radius: 8px; color: #6c757d;">📢 广告位招租</div>',
    footer: '<div style="background: #e9ecef; border: 1px solid #dee2e6; padding: 15px; text-align: center; border-radius: 8px; color: #6c757d;">🎯 广告合作联系我们</div>',
    inline: '<div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; text-align: center; border-radius: 8px; color: #856404;">💡 推荐工具 - 提升工作效率</div>',
  };

  return defaultContent[position as keyof typeof defaultContent] || defaultContent.sidebar;
}