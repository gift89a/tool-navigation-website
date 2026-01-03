'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AdAnalyticsData {
  stats: Array<{
    adId: string;
    position: string;
    impressions: number;
    clicks: number;
    ctr: number;
    date: string;
  }>;
  totals: {
    impressions: number;
    clicks: number;
    ctr: number;
  };
  period: {
    from: string;
    to: string;
  };
}

interface AdAnalyticsProps {
  position?: string;
  className?: string;
}

export function AdAnalytics({ position, className }: AdAnalyticsProps) {
  const [data, setData] = useState<AdAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  const [error, setError] = useState<string | null>(null);

  // 加载统计数据
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (position) params.set('position', position);
        params.set('period', period);

        const response = await fetch(`/api/ads/stats?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to load analytics data');
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [position, period]);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  if (isLoading) {
    return (
      <div className={className}>
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <Card className="p-6">
          <div className="text-center text-red-600">
            <div className="text-lg font-semibold mb-2">加载失败</div>
            <div className="text-sm">{error}</div>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={className}>
        <Card className="p-6">
          <div className="text-center text-gray-500">
            <div className="text-lg font-semibold mb-2">暂无数据</div>
            <div className="text-sm">没有找到广告统计数据</div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="p-6">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            广告统计
            {position && (
              <span className="ml-2 text-sm text-gray-500">
                ({position})
              </span>
            )}
          </h3>
          
          {/* 时间段选择 */}
          <div className="flex space-x-2">
            {['7d', '30d', '90d'].map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePeriodChange(p)}
              >
                {p === '7d' ? '7天' : p === '30d' ? '30天' : '90天'}
              </Button>
            ))}
          </div>
        </div>

        {/* 总计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.totals.impressions.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              总展示量
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.totals.clicks.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              总点击量
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data.totals.ctr.toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              平均点击率
            </div>
          </Card>
        </div>

        {/* 详细统计表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-gray-100">
                  广告位
                </th>
                <th className="text-right py-2 px-3 font-medium text-gray-900 dark:text-gray-100">
                  展示量
                </th>
                <th className="text-right py-2 px-3 font-medium text-gray-900 dark:text-gray-100">
                  点击量
                </th>
                <th className="text-right py-2 px-3 font-medium text-gray-900 dark:text-gray-100">
                  点击率
                </th>
              </tr>
            </thead>
            <tbody>
              {data.stats.map((stat) => (
                <tr 
                  key={stat.adId} 
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="py-2 px-3 text-gray-900 dark:text-gray-100">
                    {stat.position}
                  </td>
                  <td className="py-2 px-3 text-right text-gray-600 dark:text-gray-400">
                    {stat.impressions.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right text-gray-600 dark:text-gray-400">
                    {stat.clicks.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span className={`font-medium ${
                      stat.ctr >= 2 
                        ? 'text-green-600 dark:text-green-400' 
                        : stat.ctr >= 1 
                        ? 'text-yellow-600 dark:text-yellow-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.ctr.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 时间范围信息 */}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          统计时间: {new Date(data.period.from).toLocaleDateString()} - {new Date(data.period.to).toLocaleDateString()}
        </div>
      </Card>
    </div>
  );
}

// 简化的广告统计卡片
export function AdStatsCard({ 
  position, 
  className 
}: { 
  position: string; 
  className?: string; 
}) {
  const [stats, setStats] = useState<{
    impressions: number;
    clicks: number;
    ctr: number;
  } | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(`/api/ads/stats?position=${position}&period=7d`);
        if (response.ok) {
          const { data } = await response.json();
          if (data.stats.length > 0) {
            const stat = data.stats[0];
            setStats({
              impressions: stat.impressions,
              clicks: stat.clicks,
              ctr: stat.ctr,
            });
          }
        }
      } catch (error) {
        console.error('Failed to load ad stats:', error);
      }
    };

    loadStats();
  }, [position]);

  if (!stats) {
    return (
      <div className={className}>
        <Card className="p-3">
          <div className="text-xs text-gray-500">加载统计中...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="p-3">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {position} 广告统计 (7天)
        </div>
        <div className="flex justify-between text-xs">
          <span>展示: {stats.impressions.toLocaleString()}</span>
          <span>点击: {stats.clicks}</span>
          <span className={`font-medium ${
            stats.ctr >= 2 ? 'text-green-600' : 
            stats.ctr >= 1 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            CTR: {stats.ctr.toFixed(2)}%
          </span>
        </div>
      </Card>
    </div>
  );
}

// 实时广告监控组件
export function AdMonitor({ className }: { className?: string }) {
  const [realtimeData, setRealtimeData] = useState<{
    activeAds: number;
    totalImpressions: number;
    totalClicks: number;
    avgCtr: number;
  }>({
    activeAds: 0,
    totalImpressions: 0,
    totalClicks: 0,
    avgCtr: 0,
  });

  useEffect(() => {
    const loadRealtimeData = async () => {
      try {
        const response = await fetch('/api/ads/stats?period=1d');
        if (response.ok) {
          const { data } = await response.json();
          setRealtimeData({
            activeAds: data.stats.length,
            totalImpressions: data.totals.impressions,
            totalClicks: data.totals.clicks,
            avgCtr: data.totals.ctr,
          });
        }
      } catch (error) {
        console.error('Failed to load realtime data:', error);
      }
    };

    // 初始加载
    loadRealtimeData();

    // 每30秒更新一次
    const interval = setInterval(loadRealtimeData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={className}>
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          实时监控 (今日)
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {realtimeData.activeAds}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              活跃广告
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {realtimeData.totalImpressions.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              今日展示
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {realtimeData.totalClicks}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              今日点击
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {realtimeData.avgCtr.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              平均CTR
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}