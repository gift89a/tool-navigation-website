import { NextRequest, NextResponse } from 'next/server';

// 获取所有广告位
export async function GET() {
  try {
    // 模拟广告位数据 - 在实际部署时会连接数据库
    const mockAds = [
      {
        id: 'ad-header-1',
        name: '头部广告位',
        position: 'header',
        content: '<div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; padding: 20px; text-align: center; border-radius: 8px;">🚀 发现更多优质工具 - 点击了解</div>',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ad-sidebar-1',
        name: '侧边栏广告位',
        position: 'sidebar',
        content: '<div style="background: #f8f9fa; border: 2px dashed #dee2e6; padding: 40px; text-align: center; border-radius: 8px; color: #6c757d;">📢 广告位招租</div>',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ad-footer-1',
        name: '底部广告位',
        position: 'footer',
        content: '<div style="background: #e9ecef; border: 1px solid #dee2e6; padding: 15px; text-align: center; border-radius: 8px; color: #6c757d;">🎯 广告合作联系我们</div>',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ad-inline-1',
        name: '内联广告位',
        position: 'inline',
        content: '<div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; text-align: center; border-radius: 8px; color: #856404;">💡 推荐工具 - 提升工作效率</div>',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return NextResponse.json({
      data: mockAds,
      message: 'Ad slots fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching ad slots:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch ad slots',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// 创建新广告位
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position, content, isActive = true } = body;

    if (!name || !position || !content) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'name, position, and content are required',
        },
        { status: 400 }
      );
    }

    // 模拟创建广告位 - 在实际部署时会连接数据库
    const newAd = {
      id: `ad-${position}-${Date.now()}`,
      name,
      position,
      content,
      isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({
      data: newAd,
      message: 'Ad slot created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating ad slot:', error);
    return NextResponse.json(
      {
        error: 'Failed to create ad slot',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}