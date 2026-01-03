import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reports/usage - 生成使用统计报告
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = new Date(searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const endDate = new Date(searchParams.get('endDate') || new Date());
    const categoryId = searchParams.get('categoryId');
    const toolIds = searchParams.get('toolIds')?.split(',');
    const minUsage = parseInt(searchParams.get('minUsage') || '0');

    // 构建查询条件
    const where: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (categoryId) {
      where.tool = {
        categoryId,
      };
    }

    if (toolIds && toolIds.length > 0) {
      where.toolId = {
        in: toolIds,
      };
    }

    // 获取工具使用统计
    const analytics = await prisma.toolAnalytics.findMany({
      where,
      include: {
        tool: {
          include: {
            category: true,
          },
        },
      },
    });

    // 按工具聚合数据
    const toolStats = new Map();

    analytics.forEach((record) => {
      const toolId = record.toolId;
      const existing = toolStats.get(toolId) || {
        toolId,
        toolName: record.tool.name,
        category: record.tool.category.name,
        totalClicks: 0,
        totalViews: 0,
        uniqueUsers: 0, // 简化处理，实际应该统计唯一用户
        dailyStats: [],
      };

      existing.totalClicks += record.clicks;
      existing.totalViews += record.views;
      existing.dailyStats.push({
        date: record.date.toISOString().split('T')[0],
        clicks: record.clicks,
        views: record.views,
      });

      toolStats.set(toolId, existing);
    });

    // 转换为数组并计算转化率
    const reportData = Array.from(toolStats.values())
      .map((tool) => ({
        ...tool,
        uniqueUsers: Math.floor(tool.totalViews * 0.6), // 模拟唯一用户数
        conversionRate: tool.totalViews > 0 ? (tool.totalClicks / tool.totalViews) * 100 : 0,
      }))
      .filter((tool) => tool.totalClicks >= minUsage)
      .sort((a, b) => b.totalClicks - a.totalClicks);

    const report = {
      id: `usage_${Date.now()}`,
      title: '工具使用统计报告',
      description: `${startDate.toLocaleDateString()} 至 ${endDate.toLocaleDateString()} 的工具使用统计`,
      type: 'usage',
      period: { start: startDate, end: endDate },
      data: reportData,
      metadata: {
        totalRecords: reportData.length,
        generatedAt: new Date(),
        filters: {
          categoryId,
          toolIds,
          minUsage,
        },
      },
    };

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Failed to generate usage report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate usage report' },
      { status: 500 }
    );
  }
}