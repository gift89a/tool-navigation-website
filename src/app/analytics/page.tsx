'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/layout';
import { PopularTools } from '@/components/analytics/popular-tools';
import { TrendingTools } from '@/components/analytics/trending-tools';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'popular' | 'trending' | 'stats'>('popular');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const categories = [
    { id: '1', name: '开发工具' },
    { id: '2', name: '图片处理' },
    { id: '3', name: '文本处理' },
    { id: '4', name: '转换工具' },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            工具统计分析
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            查看工具使用趋势和热门推荐
          </p>
        </div>

        {/* 筛选器 */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 时间段选择 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                时间段:
              </span>
              <div className="flex space-x-1">
                {['7d', '30d', '90d'].map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period === '7d' ? '7天' : period === '30d' ? '30天' : '90天'}
                  </Button>
                ))}
              </div>
            </div>

            {/* 分类选择 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                分类:
              </span>
              <div className="flex space-x-1">
                <Button
                  variant={!selectedCategory ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(undefined)}
                >
                  全部
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* 导航标签 */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <Button
            variant={activeTab === 'popular' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('popular')}
            className="flex-1"
          >
            🔥 热门工具
          </Button>
          <Button
            variant={activeTab === 'trending' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('trending')}
            className="flex-1"
          >
            📈 趋势工具
          </Button>
          <Button
            variant={activeTab === 'stats' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('stats')}
            className="flex-1"
          >
            📊 使用统计
          </Button>
        </div>

        {/* 内容区域 */}
        {activeTab === 'popular' && (
          <PopularTools
            limit={12}
            category={selectedCategory}
            period={selectedPeriod}
            showHeader={false}
          />
        )}

        {activeTab === 'trending' && (
          <TrendingTools
            limit={12}
            category={selectedCategory}
            period={selectedPeriod}
            showHeader={false}
          />
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* 总体统计 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  1,234
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  总工具数量
                </div>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  45,678
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  总使用次数
                </div>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  8,901
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  活跃用户
                </div>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  4.7
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  平均评分
                </div>
              </Card>
            </div>

            {/* 分类统计 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                分类使用统计
              </h3>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-gray-900 dark:text-gray-100">
                        {category.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.random() * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-16 text-right">
                        {Math.floor(Math.random() * 10000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 使用趋势图表占位 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                使用趋势
              </h3>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">📊</div>
                  <div>图表功能开发中...</div>
                  <div className="text-sm mt-1">将显示工具使用趋势图表</div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}