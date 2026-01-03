import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reports/rating - 生成评分统计报告
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = new Date(searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const endDate = new Date(searchParams.get('endDate') || new Date());
    const categoryId = searchParams.get('categoryId');
    const minReviews = parseInt(searchParams.get('minReviews') || '1');

    // 构建查询条件
    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // 获取工具及其评价数据
    const tools = await prisma.tool.findMany({
      where,
      include: {
        category: true,
        reviews: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // 计算上一个周期的评分用于趋势分析
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setTime(previousPeriodStart.getTime() - (endDate.getTime() - startDate.getTime()));

    const previousReviews = await prisma.toolReview.findMany({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: startDate,
        },
        ...(categoryId && {
          tool: {
            categoryId,
          },
        }),
      },
      include: {
        tool: true,
      },
    });

    // 按工具聚合上一周期评分
    const previousToolRatings = new Map();
    previousReviews.forEach((review) => {
      const toolId = review.toolId;
      const existing = previousToolRatings.get(toolId) || { total: 0, count: 0 };
      existing.total += review.rating;
      existing.count += 1;
      previousToolRatings.set(toolId, existing);
    });

    // 处理工具评分数据
    const reportData = tools
      .map((tool) => {
        const reviews = tool.reviews;
        
        if (reviews.length < minReviews) {
          return null;
        }

        // 计算平均评分
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        // 计算评分分布
        const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach((review) => {
          ratingDistribution[review.rating]++;
        });

        // 计算趋势
        const previousData = previousToolRatings.get(tool.id);
        let recentTrend: 'up' | 'down' | 'stable' = 'stable';
        
        if (previousData && previousData.count > 0) {
          const previousAverage = previousData.total / previousData.count;
          const difference = averageRating - previousAverage;
          
          if (difference > 0.1) {
            recentTrend = 'up';
          } else if (difference < -0.1) {
            recentTrend = 'down';
          }
        } else if (reviews.length > 0) {
          // 新工具，如果评分高则标记为上升
          recentTrend = averageRating >= 4.0 ? 'up' : 'stable';
        }

        return {
          toolId: tool.id,
          toolName: tool.name,
          category: tool.category.name,
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: reviews.length,
          ratingDistribution,
          recentTrend,
        };
      })
      .filter((tool) => tool !== null)
      .sort((a, b) => {
        // 按平均评分降序，然后按评价数量降序
        if (Math.abs(a!.averageRating - b!.averageRating) < 0.1) {
          return b!.totalReviews - a!.totalReviews;
        }
        return b!.averageRating - a!.averageRating;
      });

    const report = {
      id: `rating_${Date.now()}`,
      title: '评分统计报告',
      description: `${startDate.toLocaleDateString()} 至 ${endDate.toLocaleDateString()} 的评分统计`,
      type: 'rating',
      period: { start: startDate, end: endDate },
      data: reportData,
      metadata: {
        totalRecords: reportData.length,
        generatedAt: new Date(),
        filters: {
          categoryId,
          minReviews,
        },
      },
    };

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Failed to generate rating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate rating report' },
      { status: 500 }
    );
  }
}