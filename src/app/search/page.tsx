'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/layout';
import { SearchBar } from '@/components/tools/search-bar';
import { ToolGrid } from '@/components/tools/tool-grid';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import { apiClient } from '@/lib/api';
import type { Tool } from '@/types';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const { favorites, addFavorite, removeFavorite } = useAppStore();
  
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [totalResults, setTotalResults] = useState(0);

  // 从URL参数获取搜索查询
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
    if (query) {
      performSearch(query, 1, false);
    }
  }, [searchParams]);

  // 执行搜索
  const performSearch = async (query: string, page = 1, append = false) => {
    if (!query.trim()) {
      setTools([]);
      setTotalResults(0);
      return;
    }

    try {
      if (!append) setIsLoading(true);
      
      const { tools: searchResults, pagination } = await apiClient.searchTools({
        query,
        page,
        limit: 12,
      });

      if (append) {
        setTools(prev => [...prev, ...searchResults]);
      } else {
        setTools(searchResults);
      }
      
      setHasMore(pagination.hasMore);
      setCurrentPage(page);
      setTotalResults(pagination.total);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // 更新URL
    const params = new URLSearchParams();
    if (query) {
      params.set('q', query);
    }
    router.push(`/search?${params.toString()}`);
  };

  // 获取搜索建议
  const handleSearchInput = async (query: string) => {
    if (query.length >= 2) {
      try {
        const suggestionResults = await apiClient.getSearchSuggestions(query);
        setSuggestions(suggestionResults);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  // 加载更多
  const handleLoadMore = async () => {
    if (searchQuery) {
      await performSearch(searchQuery, currentPage + 1, true);
    }
  };

  // 处理收藏
  const handleFavorite = (toolId: string) => {
    if (favorites.includes(toolId)) {
      removeFavorite(toolId);
    } else {
      addFavorite(toolId);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* 搜索头部 */}
        <div className="text-center space-y-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            搜索工具
          </h1>
          <div className="flex justify-center">
            <SearchBar
              onSearch={handleSearch}
              onInput={handleSearchInput}
              suggestions={suggestions}
              isLoading={isLoading}
              placeholder="搜索工具名称、描述或标签..."
              className="w-full max-w-2xl"
            />
          </div>
        </div>

        {/* 搜索结果 */}
        {searchQuery && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                搜索结果
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                找到 {totalResults} 个相关工具
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              搜索关键词: <span className="font-medium">&quot;{searchQuery}&quot;</span>
            </div>
          </div>
        )}

        {/* 工具网格 */}
        {searchQuery ? (
          <ToolGrid
            tools={tools}
            favorites={favorites}
            onFavorite={handleFavorite}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoading={isLoading && tools.length === 0}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              开始搜索
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              输入关键词搜索您需要的工具
            </p>
            <Link href="/">
              <Button variant="outline">浏览所有工具</Button>
            </Link>
          </div>
        )}

        {/* 空搜索结果 */}
        {searchQuery && tools.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              未找到相关工具
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              尝试使用其他关键词或浏览所有工具
            </p>
            <div className="space-x-4">
              <Button onClick={() => handleSearch('')} variant="outline">
                清除搜索
              </Button>
              <Link href="/">
                <Button>浏览所有工具</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </Layout>
    }>
      <SearchPageContent />
    </Suspense>
  );
}