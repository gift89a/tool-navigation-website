'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/layout';
import { ToolGrid } from '@/components/tools/tool-grid';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import { apiClient } from '@/lib/api';
import type { Category, Tool } from '@/types';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const { favorites, addFavorite, removeFavorite } = useAppStore();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载分类和工具数据
  useEffect(() => {
    const loadCategoryTools = async (page = 1, append = false) => {
      try {
        if (!append) setIsLoading(true);
        setError(null);
        
        const { category: categoryData, tools: toolsData, pagination } = 
          await apiClient.getCategoryTools(slug, {
            page,
            limit: 12,
          });

        setCategory(categoryData);
        
        if (append) {
          setTools(prev => [...prev, ...toolsData]);
        } else {
          setTools(toolsData);
        }
        
        setHasMore(pagination.hasMore);
        setCurrentPage(page);
      } catch (error) {
        console.error('Failed to load category tools:', error);
        setError(error instanceof Error ? error.message : '加载失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryTools();
  }, [slug]);

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    try {
      const { tools: toolsData, pagination } = await apiClient.getCategoryTools(slug, {
        page: nextPage,
        limit: 12,
      });

      setTools(prev => [...prev, ...toolsData]);
      setHasMore(pagination.hasMore);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Failed to load more tools:', error);
    }
  };

  const handleFavorite = (toolId: string) => {
    if (favorites.includes(toolId)) {
      removeFavorite(toolId);
    } else {
      addFavorite(toolId);
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              分类不存在
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              抱歉，您访问的分类页面不存在或已被删除
            </p>
            <Link href="/">
              <Button>返回首页</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
            首页
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100">
            {category?.name || '分类'}
          </span>
        </nav>

        {/* 分类头部 */}
        {category && (
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${category.color}20` }}
              >
                {category.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {category.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {category.description}
                </p>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              共 {tools.length} 个工具
            </div>
          </div>
        )}

        {/* 工具网格 */}
        <ToolGrid
          tools={tools}
          favorites={favorites}
          onFavorite={handleFavorite}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
}