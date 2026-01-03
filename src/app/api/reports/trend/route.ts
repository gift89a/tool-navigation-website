import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reports/trend - 生成趋势分析报告
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = new Date(searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const endDate = new Date(searchParams.get('endDate') || new Date());
    const granularity = searchParams.get('granularity') || 'daily';

    // 获取时间范围内的所有分析数据
    const analytics = await prisma.toolAnalytics.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        tool: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // 获取新增工具数据
    const newTools = await prisma.tool.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    // 按日期聚合数据
    const dailyData = new Map();

    // 处理使用统计数据
    analytics.forEach((record) => {
      const dateKey = record.date.toISOString().split('T')[0];
      const existing = dailyData.get(dateKey) || {
        date: dateKey,
        totalUsage: 0,
        newTools: 0,
        activeUsers: 0,
        categories: new Map(),
      };

      existing.totalUsage += record.clicks + record.views;
      existing.activeUsers += Math.floor((record.clicks + record.views) * 0.3); // 模拟活跃用户

      // 统计分类使用情况
      const categoryName = record.tool.category.name;
      const categoryStats = existing.categories.get(categoryName) || { usage: 0, growth: 0 };
      categoryStats.usage += record.clicks + record.views;
      existing.categories.set(categoryName, categoryStats);

      dailyData.set(dateKey, existing);
    });

    // 处理新增工具数据
    newTools.forEach((tool) => {
      const dateKey = tool.createdAt.toISOString().split('T')[0];
      const existing = dailyData.get(dateKey);
      if (existing) {
        existing.newTools++;
      }
    });

    // 计算分类增长率
    const sortedDates = Array.from(dailyData.keys()).sort();
    sortedDates.forEach((date, index) => {
      const current = dailyData.get(date);
      if (index > 0) {
        const previous = dailyData.get(sortedDates[index - 1]);
        if (previous) {
          current.categories.forEach((stats: { usage: number; growth: number }, categoryName: string) => {
            const prevStats = previous.categories.get(categoryName);
            if (prevStats && prevStats.usage > 0) {
              stats.growth = ((stats.usage - prevStats.usage) / prevStats.usage) * 100;
            }
          });
        }
      }
    });

    // 转换为报告格式
    const reportData = sortedDates.map((date) => {
      const dayData = dailyData.get(date);
      const topCategories = (Array.from(dayData.categories.entries()) as [string, { usage: number; growth: number }][])
        .map(([category, stats]) => ({
          category,
          usage: stats.usage,
          growth: stats.growth,
        }))
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 5);

      return {
        date,
        totalUsage: dayData.totalUsage,
        newTools: dayData.newTools,
        activeUsers: Math.floor(dayData.activeUsers * 0.1), // 调整活跃用户数
        topCategories,
      };
    });

    const report = {
      id: `trend_${Date.now()}`,
      title: '使用趋势分析报告',
      description: `${startDate.toLocaleDateString()} 至 ${endDate.toLocaleDateString()} 的使用趋势分析`,
      type: 'trend',
      period: { start: startDate, end: endDate },
      data: reportData,
      metadata: {
        totalRecords: reportData.length,
        generatedAt: new Date(),
        filters: {
          granularity,
        },
      },
    };

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Failed to generate trend report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate trend report' },
      { status: 500 }
    );
  }
}