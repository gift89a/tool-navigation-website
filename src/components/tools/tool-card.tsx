'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToolIcon } from '@/components/ui/optimized-image';
import { analyticsManager } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import type { Tool } from '@/types';

interface ToolCardProps {
  tool: Tool;
  onFavorite?: (toolId: string) => void;
  isFavorite?: boolean;
  compact?: boolean;
  className?: string;
}

export function ToolCard({ 
  tool, 
  onFavorite, 
  isFavorite = false, 
  compact = false, 
  className 
}: ToolCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.(tool.id);
  };

  const handleToolClick = (e: React.MouseEvent) => {
    // 记录工具点击统计
    analyticsManager.recordToolClick(tool.id, tool.name, tool.category.name);
    
    // 如果不是紧凑模式，跳转到工具详情页
    if (!compact) {
      e.preventDefault();
      window.location.href = `/tool/${tool.id}`;
    } else {
      // 紧凑模式直接打开工具链接
      e.preventDefault();
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (compact) {
    return (
      <div 
        className={cn(
          'group flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer',
          className
        )}
        onClick={handleToolClick}
      >
        <div className="text-lg">{tool.icon || <ToolIcon src={`/icons/${tool.id}.png`} alt={tool.name} size={20} />}</div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {tool.name}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {tool.description}
          </div>
        </div>
        {onFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleFavoriteClick}
          >
            <span className={cn(
              'text-sm',
              isFavorite ? 'text-red-500' : 'text-gray-400'
            )}>
              {isFavorite ? '❤️' : '🤍'}
            </span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={cn(
      'group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer',
      className
    )}>
      <div className="block" onClick={handleToolClick}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {tool.icon || <ToolIcon src={`/icons/${tool.id}.png`} alt={tool.name} size={32} />}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold truncate">
                  {tool.name}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      {tool.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {tool.usageCount} 次使用
                  </span>
                </div>
              </div>
            </div>
            {onFavorite && (
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleFavoriteClick}
              >
                <span className={cn(
                  'text-lg',
                  isFavorite ? 'text-red-500' : 'text-gray-400'
                )}>
                  {isFavorite ? '❤️' : '🤍'}
                </span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
            {tool.description}
          </CardDescription>
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {tool.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                >
                  {tag.name}
                </span>
              ))}
              {tool.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{tool.tags.length - 3} 更多
                </span>
              )}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}