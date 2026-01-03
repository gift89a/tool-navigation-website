'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { analyticsManager } from '@/lib/analytics';
import type { PopularTool } from '@/lib/analytics';

interface PopularToolsProps {
  limit?: number;
  category?: string;
  period?: string;
  className?: string;
  showHeader?: boolean;
}

export function PopularTools({ 
  limit = 6, 
  category, 
  period = '30d',
  className,
  showHeader = true 
}: PopularToolsProps) {
  const [tools, setTools] = useState<PopularTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPopularTools = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set('limit', limit.toString());
        if (category) params.set('category', category);
        params.set('period', period);

        const response = await fetch(`/api/analytics/popular?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to load popular tools');
        }

        const { data } = await response.json();
        setTools(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load popular tools');
        // 使用本地模拟数据作为后备
        const mockTools = await analyticsManager.getPopularTools(limit);
        setTools(mockTools);
      } finally {
        setIsLoading(false);
      }
    };

    loadPopularTools();
  }, [limit, category, period]);

  const handleToolClick = (tool: PopularTool) => {
    analyticsManager.recordToolClick(tool.toolId, tool.name, tool.category);
  };

  if (isLoading) {
    return (
      <div className={className}>
        {showHeader && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            热门工具
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <Card key={`loading-${index}`} className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && tools.length === 0) {
    return (
      <div className={className}>
        {showHeader && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            热门工具
          </h2>
        )}
        <Card className="p-6 text-center">
          <div className="text-red-600 dark:text-red-400 mb-2">
            加载失败
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {error}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            热门工具
            {category && (
              <span className="ml-2 text-sm text-gray-500">
                ({category})
              </span>
            )}
          </h2>
          <Link href="/analytics/popular">
            <Button variant="outline" size="sm">
              查看更多
            </Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, index) => (
          <Card key={tool.toolId} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{(tool as any).icon || '🛠️'}</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    #{index + 1}
                  </span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i < Math.floor(tool.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      {tool.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-green-600 dark:text-green-400">
                  {tool.popularityScore.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500">热度</div>
              </div>
            </div>

            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
              {tool.name}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {(tool as any).description || '实用的在线工具'}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span>{tool.category}</span>
              <span>{tool.usageCount.toLocaleString()} 次使用</span>
            </div>

            <div className="flex space-x-2">
              <Link 
                href={`/tool/${tool.toolId}`}
                className="flex-1"
                onClick={() => handleToolClick(tool)}
              >
                <Button size="sm" className="w-full">
                  使用工具
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleToolClick(tool)}
              >
                详情
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {tools.length === 0 && !isLoading && (
        <Card className="p-6 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            暂无热门工具数据
          </div>
        </Card>
      )}
    </div>
  );
}

// 简化的热门工具卡片
export function PopularToolsCard({ className }: { className?: string }) {
  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
        🔥 热门工具
      </h3>
      <PopularTools 
        limit={3} 
        showHeader={false}
        className="space-y-3"
      />
    </Card>
  );
}