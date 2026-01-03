'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/layout';
import { AdAnalytics, AdMonitor } from '@/components/ads/ad-analytics';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'management'>('overview');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            广告管理后台
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            管理和监控网站广告位的展示效果和统计数据
          </p>
        </div>

        {/* 导航标签 */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
            className="flex-1"
          >
            概览
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('analytics')}
            className="flex-1"
          >
            详细统计
          </Button>
          <Button
            variant={activeTab === 'management' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('management')}
            className="flex-1"
          >
            广告管理
          </Button>
        </div>

        {/* 内容区域 */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 实时监控 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                实时监控
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdMonitor />
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    广告位状态
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Header</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                        活跃
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sidebar</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                        活跃
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Footer</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                        活跃
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Inline</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                        活跃
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* 快速统计 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                7天统计概览
              </h2>
              <AdAnalytics className="max-w-4xl" />
            </section>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* 各广告位详细统计 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                广告位详细统计
              </h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <AdAnalytics position="header" />
                <AdAnalytics position="sidebar" />
                <AdAnalytics position="footer" />
                <AdAnalytics position="inline" />
              </div>
            </section>
          </div>
        )}

        {activeTab === 'management' && (
          <div className="space-y-8">
            {/* 广告管理 */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  广告位管理
                </h2>
                <Button>
                  新增广告
                </Button>
              </div>
              
              <Card className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                          广告位
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                          格式
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                          状态
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                          7天展示
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                          7天点击
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                          CTR
                        </th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { position: 'header', format: 'HTML', status: '活跃', impressions: 15420, clicks: 234, ctr: 1.52 },
                        { position: 'sidebar', format: 'HTML', status: '活跃', impressions: 8900, clicks: 156, ctr: 1.75 },
                        { position: 'footer', format: 'HTML', status: '活跃', impressions: 12300, clicks: 189, ctr: 1.54 },
                        { position: 'inline', format: 'HTML', status: '活跃', impressions: 6700, clicks: 98, ctr: 1.46 },
                      ].map((ad) => (
                        <tr key={ad.position} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-3 px-4 text-gray-900 dark:text-gray-100 capitalize">
                            {ad.position}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {ad.format}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                              {ad.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                            {ad.impressions.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                            {ad.clicks.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`font-medium ${
                              ad.ctr >= 2 
                                ? 'text-green-600 dark:text-green-400' 
                                : ad.ctr >= 1 
                                ? 'text-yellow-600 dark:text-yellow-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {ad.ctr.toFixed(2)}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <Button variant="outline" size="sm">
                                编辑
                              </Button>
                              <Button variant="outline" size="sm">
                                暂停
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>

            {/* 广告效果分析 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                效果分析建议
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    📈 表现最佳
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sidebar</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        CTR: 1.75%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      侧边栏广告位点击率最高，建议优先投放高价值广告
                    </p>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    💡 优化建议
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Inline</span>
                      <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        CTR: 1.46%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      内联广告位可以尝试调整位置或更换创意内容
                    </p>
                  </div>
                </Card>
              </div>
            </section>
          </div>
        )}
      </div>
    </Layout>
  );
}