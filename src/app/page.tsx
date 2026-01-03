'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/layout';
import { CategoryGrid } from '@/components/tools/category-grid';
import { ToolGrid } from '@/components/tools/tool-grid';
import { HeaderAd, InlineAd, SidebarAd } from '@/components/ads/ad-slot';
import { PopularTools } from '@/components/analytics/popular-tools';
import { TrendingTools } from '@/components/analytics/trending-tools';
import { useTranslations } from '@/hooks/use-translations';
import { useAppStore } from '@/store/app-store';
import { apiClient } from '@/lib/api';

export default function Home() {
  const { t } = useTranslations();
  const { 
    categories, 
    tools, 
    favorites, 
    selectedCategory,
    isLoading,
    setCategories, 
    setTools, 
    setSelectedCategory,
    setIsLoading,
    addFavorite,
    removeFavorite
  } = useAppStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // 加载分类数据
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await apiClient.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categories.length === 0) {
      loadCategories();
    }
  }, [categories.length, setCategories, setIsLoading]);

  // 加载工具数据
  useEffect(() => {
    const loadTools = async (page = 1, append = false) => {
      try {
        if (!append) setIsLoading(true);
        
        const { tools: toolsData, pagination } = await apiClient.getTools({
          page,
          limit: 12,
          category: selectedCategory || undefined,
        });

        if (append) {
          setTools([...tools, ...toolsData]);
        } else {
          setTools(toolsData);
        }
        
        setHasMore(pagination.hasMore);
        setCurrentPage(page);
      } catch (error) {
        console.error('Failed to load tools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTools();
  }, [selectedCategory]); // 只依赖selectedCategory

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
    setCurrentPage(1);
  };

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    try {
      const { tools: toolsData, pagination } = await apiClient.getTools({
        page: nextPage,
        limit: 12,
        category: selectedCategory || undefined,
      });

      setTools([...tools, ...toolsData]);
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

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Ad */}
        <HeaderAd className="mb-8" />

        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {t('page.home.title').split(' - ')[0]}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('page.home.description')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* 分类网格 */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  工具分类
                </h2>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    查看全部
                  </button>
                )}
              </div>
              
              {isLoading && categories.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={`category-loading-${index}`}
                      className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <CategoryGrid
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategorySelect}
                />
              )}
            </section>

            {/* Inline Ad */}
            <InlineAd className="mb-8" />

            {/* 热门工具 */}
            <section className="mb-12">
              <PopularTools limit={6} />
            </section>

            {/* 趋势工具 */}
            <section className="mb-12">
              <TrendingTools limit={6} />
            </section>

            {/* 工具网格 */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedCategoryData ? selectedCategoryData.name : '所有工具'}
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  共 {tools.length} 个工具
                </div>
              </div>
              
              <ToolGrid
                tools={tools}
                favorites={favorites}
                onFavorite={handleFavorite}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                isLoading={isLoading && tools.length === 0}
              />
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-4 space-y-6">
              <SidebarAd />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
