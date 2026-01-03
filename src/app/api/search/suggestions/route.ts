import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!query || query.length < 2) {
      return NextResponse.json({
        data: [],
        message: 'Query too short or empty',
      });
    }

    // 模拟搜索建议 - 在实际部署时会连接数据库
    const mockSuggestions = [
      'JSON 格式化工具',
      'Base64 编解码',
      '图片压缩工具',
      '密码生成器',
      'URL 编解码',
      'MD5 加密工具',
      'QR码生成器',
      '颜色选择器',
    ];

    // 简单的建议过滤
    const queryLower = query.toLowerCase();
    const filteredSuggestions = mockSuggestions
      .filter(suggestion => suggestion.toLowerCase().includes(queryLower))
      .slice(0, limit);

    return NextResponse.json({
      data: filteredSuggestions,
      message: 'Suggestions fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch suggestions',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}