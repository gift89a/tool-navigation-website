'use client';

import React from 'react';
import { ToolCard } from './tool-card';
import { Button } from '@/components/ui/button';
import { useListLazyLoading } from '@/hooks/use-lazy-loading';
import type { Tool } from '@/types';

interface ToolGridProps {
  tools: Tool[];
  favorites?: string[];
  onFavorite?: (toolId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  className?: string;
  enableLazyLoading?: boolean;
  pageSize?: number;
}

export function ToolGrid({ 
  tools, 
  favorites = [],
  onFavorite,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  className,
  enableLazyLoading = true,
  pageSize = 12,
}: ToolGridProps) {
  // 使用懒加载 Hook
  const {
    visibleItems: visibleTools,
    hasMoreItems,
    isLoadingMore,
    loadMoreRef,
  } = useListLazyLoading(tools, {
    pageSize,
    hasMore,
    onLoadMore,
  });

  // 如果禁用懒加载，显示所有工具
  const displayTools = enableLazyLoading ? visibleTools : tools;
  const showLoadMore = enableLazyLoading ? hasMoreItems : hasMore;
  const showLoading = enableLazyLoading ? isLoadingMore : isLoading;
  if (displayTools.length === 0 && !showLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          暂无工具
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          没有找到符合条件的工具
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            isFavorite={favorites.includes(tool.id)}
            onFavorite={onFavorite}
          />
        ))}
        
        {/* 加载中的占位卡片 */}
        {showLoading && (
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`loading-${index}`}
                className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 animate-pulse"
              />
            ))}
          </>
        )}
      </div>

      {/* 懒加载触发器 */}
      {enableLazyLoading && showLoadMore && (
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center mt-8">
          {showLoading && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span>加载更多工具...</span>
            </div>
          )}
        </div>
      )}

      {/* 传统加载更多按钮 */}
      {!enableLazyLoading && showLoadMore && !showLoading && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
            className="px-8"
          >
            加载更多
          </Button>
        </div>
      )}

      {/* 加载中指示器 */}
      {!enableLazyLoading && showLoading && displayTools.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            <span>加载中...</span>
          </div>
        </div>
      )}
    </div>
  );
}