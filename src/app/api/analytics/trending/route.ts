import { NextRequest, NextResponse } from 'next/server';

// 获取趋势工具
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const period = searchParams.get('period') || '7d'; // 7d, 30d

    // 模拟趋势工具数据 - 在实际部署时会连接数据库
    const mockTrendingTools = [
      {
        toolId: '3',
        name: '图片压缩工具',
        category: '图片处理',
        trendScore: 98.5,
        growthRate: 45.2,
        totalUsage: 18900,
        recentUsage: 2340,
        icon: '🖼️',
        url: 'https://tinypng.com',
        description: '在线图片压缩，支持JPG、PNG、WebP格式',
        tags: ['图片', '压缩'],
        rating: 4.9,
      },
      {
        toolId: '1',
        name: 'JSON 格式化工具',
        category: '开发工具',
        trendScore: 92.1,
        growthRate: 32.8,
        totalUsage: 15420,
        recentUsage: 1890,
        icon: '📋',
        url: 'https://jsonformatter.org',
        description: '在线JSON格式化、压缩和验证工具',
        tags: ['JSON', '格式化'],
        rating: 4.8,
      },
      {
        toolId: '4',
        name: '密码生成器',
        category: '开发工具',
        trendScore: 88.7,
        growthRate: 28.5,
        totalUsage: 9800,
        recentUsage: 1250,
        icon: '🔑',
        url: 'https://passwordgenerator.net',
        description: '生成安全的随机密码',
        tags: ['密码', '安全'],
        rating: 4.7,
      },
      {
        toolId: '7',
        name: 'QR码生成器',
        category: '转换工具',
        trendScore: 85.9,
        growthRate: 38.7,
        totalUsage: 6500,
        recentUsage: 980,
        icon: '📱',
        url: 'https://qr-code-generator.com',
        description: '在线生成QR码，支持文本、URL、WiFi等',
        tags: ['QR码', '生成'],
        rating: 4.6,
      },
      {
        toolId: '2',
        name: 'Base64 编解码',
        category: '开发工具',
        trendScore: 82.3,
        growthRate: 22.1,
        totalUsage: 12300,
        recentUsage: 1120,
        icon: '🔐',
        url: 'https://base64encode.org',
        description: '在线Base64编码和解码工具',
        tags: ['Base64', '编码'],
        rating: 4.6,
      },
      {
        toolId: '8',
        name: '颜色选择器',
        category: '设计工具',
        trendScore: 79.4,
        growthRate: 41.3,
        totalUsage: 5200,
        recentUsage: 720,
        icon: '🎨',
        url: 'https://colorpicker.me',
        description: '在线颜色选择和调色板工具',
        tags: ['颜色', '设计'],
        rating: 4.5,
      },
    ];

    // 如果指定了分类，过滤数据
    let filteredTools = mockTrendingTools;
    if (category) {
      filteredTools = filteredTools.filter(tool => tool.category === category);
    }

    // 按趋势分数排序并限制数量
    const trendingTools = filteredTools
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit);

    return NextResponse.json({
      data: trendingTools,
      meta: {
        total: filteredTools.length,
        limit,
        period,
        category,
        generatedAt: new Date().toISOString(),
      },
      message: 'Trending tools fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching trending tools:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch trending tools',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}