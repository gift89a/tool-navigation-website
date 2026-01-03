import { NextRequest, NextResponse } from 'next/server';

// 获取热门工具
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d

    // 模拟热门工具数据 - 在实际部署时会连接数据库
    const mockPopularTools = [
      {
        toolId: '1',
        name: 'JSON 格式化工具',
        category: '开发工具',
        usageCount: 15420,
        rating: 4.8,
        popularityScore: 95.2,
        icon: '📋',
        url: 'https://jsonformatter.org',
        description: '在线JSON格式化、压缩和验证工具',
        tags: ['JSON', '格式化'],
        growthRate: 32.8,
      },
      {
        toolId: '3',
        name: '图片压缩工具',
        category: '图片处理',
        usageCount: 18900,
        rating: 4.9,
        popularityScore: 94.8,
        icon: '🖼️',
        url: 'https://tinypng.com',
        description: '在线图片压缩，支持JPG、PNG、WebP格式',
        tags: ['图片', '压缩'],
        growthRate: 45.2,
      },
      {
        toolId: '2',
        name: 'Base64 编解码',
        category: '开发工具',
        usageCount: 12300,
        rating: 4.6,
        popularityScore: 89.5,
        icon: '🔐',
        url: 'https://base64encode.org',
        description: '在线Base64编码和解码工具',
        tags: ['Base64', '编码'],
        growthRate: 22.1,
      },
      {
        toolId: '4',
        name: '密码生成器',
        category: '开发工具',
        usageCount: 9800,
        rating: 4.7,
        popularityScore: 87.3,
        icon: '🔑',
        url: 'https://passwordgenerator.net',
        description: '生成安全的随机密码',
        tags: ['密码', '安全'],
        growthRate: 28.5,
      },
      {
        toolId: '5',
        name: 'URL 编解码',
        category: '开发工具',
        usageCount: 8500,
        rating: 4.5,
        popularityScore: 84.1,
        icon: '🔗',
        url: 'https://urlencode.org',
        description: '在线URL编码和解码工具',
        tags: ['URL', '编码'],
        growthRate: 18.3,
      },
      {
        toolId: '6',
        name: 'MD5 加密工具',
        category: '开发工具',
        usageCount: 7200,
        rating: 4.4,
        popularityScore: 81.7,
        icon: '🔒',
        url: 'https://md5hash.net',
        description: '在线MD5哈希加密工具',
        tags: ['MD5', '加密'],
        growthRate: 15.7,
      },
    ];

    // 如果指定了分类，过滤数据
    let filteredTools = mockPopularTools;
    if (category) {
      filteredTools = filteredTools.filter(tool => tool.category === category);
    }

    // 按热门度排序并限制数量
    const popularTools = filteredTools
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, limit);

    return NextResponse.json({
      data: popularTools,
      meta: {
        total: filteredTools.length,
        limit,
        period,
        category,
      },
      message: 'Popular tools fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching popular tools:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch popular tools',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}