import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reports/category - 生成分类统计报告
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = new Date(searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const endDate = new Date(searchParams.get('endDate') || new Date());

    // 获取所有分类
    const categories = await prisma.category.findMany({
      include: {
        tools: {
          include: {
            analytics: {
              where: {
                date: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            },
          },
        },
      },
    });

    // 获取评价数据
    const reviews = await prisma.toolReview.findMany({
      where: {
        createdAt: {
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
    });

    // 计算上一个周期的数据用于增长率计算
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setTime(previousPeriodStart.getTime() - (endDate.getTime() - startDate.getTime()));
    
    const previousAnalytics = await prisma.toolAnalytics.findMany({
      where: {
        date: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
      include: {
        tool: {
          include: {
            category: true,
          },
        },
      },
    });

    // 按分类聚合上一周期数据
    const previousCategoryUsage = new Map();
    previousAnalytics.forEach((record) => {
      const categoryId = record.tool.categoryId;
      const existing = previousCategoryUsage.get(categoryId) || 0;
      previousCategoryUsage.set(categoryId, existing + record.clicks + record.views);
    });

    // 处理分类数据
    const reportData = categories.map((category) => {
      // 计算工具数量
      const toolCount = category.tools.length;

      // 计算总使用量
      const totalUsage = category.tools.reduce((sum, tool) => {
        return sum + tool.analytics.reduce((toolSum, analytics) => {
          return toolSum + analytics.clicks + analytics.views;
        }, 0);
      }, 0);

      // 计算平均评分 - 从评价数据中筛选该分类的工具
      const categoryReviews = reviews.filter(review => 
        category.tools.some(tool => tool.id === review.toolId)
      );
      const averageRating = categoryReviews.length > 0
        ? categoryReviews.reduce((sum, review) => sum + review.rating, 0) / categoryReviews.length
        : 0;

      // 计算增长率
      const previousUsage = previousCategoryUsage.get(category.id) || 0;
      const growthRate = previousUsage > 0 
        ? ((totalUsage - previousUsage) / previousUsage) * 100 
        : totalUsage > 0 ? 100 : 0;

      // 获取热门工具
      const topTools = category.tools
        .map((tool) => {
          const usage = tool.analytics.reduce((sum, analytics) => {
            return sum + analytics.clicks + analytics.views;
          }, 0);
          return {
            toolId: tool.id,
            toolName: tool.name,
            usage,
          };
        })
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 5);

      return {
        categoryId: category.id,
        categoryName: category.name,
        toolCount,
        totalUsage,
        averageRating: Math.round(averageRating * 10) / 10,
        growthRate: Math.round(growthRate * 10) / 10,
        topTools,
      };
    })
    .filter((category) => category.toolCount > 0)
    .sort((a, b) => b.totalUsage - a.totalUsage);

    const report = {
      id: `category_${Date.now()}`,
      title: '分类统计报告',
      description: `${startDate.toLocaleDateString()} 至 ${endDate.toLocaleDateString()} 的分类统计`,
      type: 'category',
      period: { start: startDate, end: endDate },
      data: reportData,
      metadata: {
        totalRecords: reportData.length,
        generatedAt: new Date(),
      },
    };

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Failed to generate category report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate category report' },
      { status: 500 }
    );
  }
}