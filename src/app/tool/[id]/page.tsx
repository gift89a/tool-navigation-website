'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ToolCard } from '@/components/tools/tool-card';
import { ReviewSummary } from '@/components/reviews/review-summary';
import { ReviewForm } from '@/components/reviews/review-form';
import { ReviewList } from '@/components/reviews/review-list';
import { analyticsManager } from '@/lib/analytics';
import { useAppStore } from '@/store/app-store';
import { apiClient } from '@/lib/api';
import { getMockToolById, getMockTools } from '@/lib/mock-data';
import type { Tool } from '@/types';

export default function ToolDetailPage() {
  const params = useParams();
  const toolId = params.id as string;
  
  const { favorites, addFavorite, removeFavorite } = useAppStore();
  
  const [tool, setTool] = useState<Tool | null>(null);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // 加载工具详情
  useEffect(() => {
    const loadToolDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: 实现获取工具详情的API
        // const toolData = await apiClient.getTool(toolId);
        // setTool(toolData);
        
        // 使用 mock-data.ts 中的数据
        const mockTool = getMockToolById(toolId);
        if (!mockTool) {
          console.error('Tool not found:', toolId);
          return;
        }
        
        setTool(mockTool);
        
        // 记录工具浏览统计
        analyticsManager.recordToolView(mockTool.id, mockTool.name, mockTool.category.name);
        
        // 加载相关工具
        const relatedTools = getMockTools(mockTool.categoryId, 4)
          .filter(t => t.id !== toolId);
        
        // 过滤掉当前工具
        setRelatedTools(relatedTools.slice(0, 3));
        
      } catch (error) {
        console.error('Failed to load tool detail:', error);
        setError(error instanceof Error ? error.message : '加载失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadToolDetail();
  }, [toolId]);

  const handleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  const handleVisitTool = () => {
    if (tool) {
      // 记录工具点击统计
      analyticsManager.recordToolClick(tool.id, tool.name, tool.category.name);
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleReviewSubmit = (review: any) => {
    console.log('Review submitted:', review);
    setShowReviewForm(false);
    // 这里可以刷新评价列表或显示成功消息
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !tool) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              工具不存在
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              抱歉，您访问的工具页面不存在或已被删除
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
          <Link 
            href={`/category/${tool.category.slug}`}
            className="hover:text-gray-900 dark:hover:text-gray-100"
          >
            {tool.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100">
            {tool.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 工具头部信息 */}
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{tool.icon}</div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {tool.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {tool.description}
                  </p>
                  
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  
                  {/* 统计信息 */}
                  <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <div className="flex items-center space-x-1">
                      <span>⭐</span>
                      <span>{tool.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>👥</span>
                      <span>{tool.usageCount.toLocaleString()} 次使用</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>📂</span>
                      <span>{tool.category.name}</span>
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex space-x-3">
                    <Button onClick={handleVisitTool} className="flex-1 sm:flex-none">
                      🚀 使用工具
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleFavorite(tool.id)}
                      className={favorites.includes(tool.id) ? 'text-red-600 border-red-600' : ''}
                    >
                      {favorites.includes(tool.id) ? '❤️ 已收藏' : '🤍 收藏'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* 工具详细信息 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                工具详情
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    功能特点
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                    <li>支持JSON格式化和压缩</li>
                    <li>语法高亮显示</li>
                    <li>错误检测和提示</li>
                    <li>支持大文件处理</li>
                    <li>完全免费使用</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    使用说明
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    将您的JSON代码粘贴到输入框中，点击格式化按钮即可获得格式化后的结果。
                    工具会自动检测语法错误并提供修复建议。
                  </p>
                </div>
              </div>
            </Card>

            {/* 评价概览 */}
            <ReviewSummary toolId={tool.id} />

            {/* 评价表单 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  用户评价
                </h2>
                <Button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  variant="outline"
                >
                  {showReviewForm ? '取消评价' : '写评价'}
                </Button>
              </div>
              
              {showReviewForm && (
                <div className="mb-6">
                  <ReviewForm 
                    toolId={tool.id} 
                    userId="demo-user" // 在实际应用中应该使用真实的用户ID
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}
            </div>

            {/* 评价列表 */}
            <ReviewList toolId={tool.id} limit={10} />
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 相关工具 */}
            {relatedTools.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  相关工具
                </h3>
                <div className="space-y-4">
                  {relatedTools.map((relatedTool) => (
                    <ToolCard
                      key={relatedTool.id}
                      tool={relatedTool}
                      isFavorite={favorites.includes(relatedTool.id)}
                      onFavorite={handleFavorite}
                      compact
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* 分类信息 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                所属分类
              </h3>
              <Link href={`/category/${tool.category.slug}`}>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${tool.category.color}20` }}
                  >
                    {tool.category.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {tool.category.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {tool.category.description}
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}