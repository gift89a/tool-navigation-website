'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/layout';
import { ToolGrid } from '@/components/tools/tool-grid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';
import type { Tool } from '@/types';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useAppStore();
  
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'rating' | 'recent'>('recent');

  // 加载收藏的工具
  useEffect(() => {
    const loadFavoriteTools = async () => {
      if (favorites.length === 0) {
        setFavoriteTools([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // TODO: 实现批量获取工具的API
        // const tools = await apiClient.getToolsByIds(favorites);
        
        // 暂时使用模拟数据
        const mockTools: Tool[] = favorites.map((id, index) => ({
          id,
          name: `工具 ${index + 1}`,
          slug: `tool-${index + 1}`,
          description: `这是收藏的工具 ${index + 1} 的描述`,
          icon: ['🔧', '📊', '🎨', '💻', '🔒'][index % 5],
          url: `https://example.com/tool${index + 1}`,
          category: {
            id: `cat${index % 3 + 1}`,
            name: ['开发工具', '设计工具', '办公工具'][index % 3],
            description: '分类描述',
            icon: ['💻', '🎨', '📄'][index % 3],
            color: ['#3B82F6', '#10B981', '#F59E0B'][index % 3],
            slug: ['development', 'design', 'office'][index % 3],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          categoryId: `cat${index % 3 + 1}`,
          tags: [
            { id: `tag${index * 2 + 1}`, name: `标签${index * 2 + 1}`, createdAt: new Date(), updatedAt: new Date() },
            { id: `tag${index * 2 + 2}`, name: `标签${index * 2 + 2}`, createdAt: new Date(), updatedAt: new Date() }
          ],
          rating: 4.0 + Math.random(),
          usageCount: Math.floor(Math.random() * 10000),
          isActive: true,
          isFeatured: index % 3 === 0,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        }));
        
        setFavoriteTools(mockTools);
      } catch (error) {
        console.error('Failed to load favorite tools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavoriteTools();
  }, [favorites]);

  // 排序工具
  const sortedTools = [...favoriteTools].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'category':
        return a.category.name.localeCompare(b.category.name);
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // 按分类分组
  const toolsByCategory = sortedTools.reduce((acc, tool) => {
    const categoryName = tool.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  const handleFavorite = (toolId: string) => {
    removeFavorite(toolId);
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有收藏吗？')) {
      favorites.forEach(id => removeFavorite(id));
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`loading-${index}`}
                  className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48"
                />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (favoriteTools.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⭐</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              还没有收藏任何工具
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              浏览工具并点击收藏按钮来添加到您的收藏夹
            </p>
            <Link href="/">
              <Button>浏览工具</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              我的收藏
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              共收藏了 {favoriteTools.length} 个工具
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 排序选择 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'category' | 'rating' | 'recent')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="recent">最近收藏</option>
              <option value="name">按名称</option>
              <option value="category">按分类</option>
              <option value="rating">按评分</option>
            </select>
            
            {/* 清空收藏 */}
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              清空收藏
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {favoriteTools.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              收藏工具
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Object.keys(toolsByCategory).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              涉及分类
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {(favoriteTools.reduce((sum, tool) => sum + tool.rating, 0) / favoriteTools.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              平均评分
            </div>
          </Card>
        </div>

        {/* 工具列表 */}
        {sortBy === 'category' ? (
          // 按分类分组显示
          <div className="space-y-8">
            {Object.entries(toolsByCategory).map(([categoryName, tools]) => (
              <div key={categoryName}>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {categoryName} ({tools.length})
                </h2>
                <ToolGrid
                  tools={tools}
                  favorites={favorites}
                  onFavorite={handleFavorite}
                />
              </div>
            ))}
          </div>
        ) : (
          // 统一显示
          <ToolGrid
            tools={sortedTools}
            favorites={favorites}
            onFavorite={handleFavorite}
          />
        )}
      </div>
    </Layout>
  );
}