import { NextRequest, NextResponse } from 'next/server';

// 广告统计数据接口
interface AdStats {
  adId: string;
  position: string;
  impressions: number;
  clicks: number;
  ctr: number; // Click-through rate
  date: string;
}

// 获取广告统计数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d

    // 计算日期范围
    const now = new Date();
    let fromDate: Date;
    
    switch (period) {
      case '30d':
        fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    if (startDate) {
      fromDate = new Date(startDate);
    }

    const toDate = endDate ? new Date(endDate) : now;

    // TODO: 实际实现应该从数据库获取统计数据
    // 这里使用模拟数据
    const mockStats: AdStats[] = [
      {
        adId: 'ad-header-1',
        position: 'header',
        impressions: 15420,
        clicks: 234,
        ctr: 1.52,
        date: '2024-01-01',
      },
      {
        adId: 'ad-sidebar-1',
        position: 'sidebar',
        impressions: 8900,
        clicks: 156,
        ctr: 1.75,
        date: '2024-01-01',
      },
    ];

    // 如果指定了位置，过滤数据
    const filteredStats = position 
      ? mockStats.filter(stat => stat.position === position)
      : mockStats;

    // 计算总计
    const totals = filteredStats.reduce(
      (acc, stat) => ({
        impressions: acc.impressions + stat.impressions,
        clicks: acc.clicks + stat.clicks,
      }),
      { impressions: 0, clicks: 0 }
    );

    const totalCtr = totals.impressions > 0 
      ? (totals.clicks / totals.impressions) * 100 
      : 0;

    return NextResponse.json({
      data: {
        stats: filteredStats,
        totals: {
          ...totals,
          ctr: parseFloat(totalCtr.toFixed(2)),
        },
        period: {
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        },
      },
      message: 'Ad stats fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching ad stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch ad stats',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// 记录广告展示
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adId, position, type = 'impression' } = body;

    if (!adId || !position) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'adId and position are required',
        },
        { status: 400 }
      );
    }

    // TODO: 实际实现应该记录到数据库
    // 这里只是模拟记录
    console.log(`Ad ${type} recorded:`, { adId, position, timestamp: new Date() });

    return NextResponse.json({
      message: `Ad ${type} recorded successfully`,
    });
  } catch (error) {
    console.error('Error recording ad stat:', error);
    return NextResponse.json(
      {
        error: 'Failed to record ad stat',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}