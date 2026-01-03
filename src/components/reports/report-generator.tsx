'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { reportingManager } from '@/lib/reporting';
import type { ReportData } from '@/lib/reporting';

interface ReportGeneratorProps {
  onReportGenerated?: (report: ReportData) => void;
  className?: string;
}

export function ReportGenerator({ onReportGenerated, className }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<'usage' | 'trend' | 'category' | 'rating'>('usage');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [filters, setFilters] = useState({
    categoryId: '',
    minUsage: '',
    minReviews: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: '1', name: '开发工具' },
    { id: '2', name: '图片处理' },
    { id: '3', name: '文本处理' },
    { id: '4', name: '转换工具' },
  ];

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      let report: ReportData;

      switch (reportType) {
        case 'usage':
          report = await reportingManager.generateUsageReport(startDate, endDate, {
            categoryId: filters.categoryId || undefined,
            minUsage: filters.minUsage ? parseInt(filters.minUsage) : undefined,
          });
          break;
        case 'trend':
          report = await reportingManager.generateTrendReport(startDate, endDate);
          break;
        case 'category':
          report = await reportingManager.generateCategoryReport(startDate, endDate);
          break;
        case 'rating':
          report = await reportingManager.generateRatingReport(startDate, endDate, {
            categoryId: filters.categoryId || undefined,
            minReviews: filters.minReviews ? parseInt(filters.minReviews) : undefined,
          });
          break;
        default:
          throw new Error('Invalid report type');
      }

      onReportGenerated?.(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成报告失败');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        生成数据报告
      </h3>

      <div className="space-y-4">
        {/* 报告类型选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            报告类型
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="usage">使用统计报告</option>
            <option value="trend">趋势分析报告</option>
            <option value="category">分类统计报告</option>
            <option value="rating">评分统计报告</option>
          </select>
        </div>

        {/* 日期范围 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              开始日期
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              结束日期
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        {/* 筛选条件 */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            筛选条件
          </h4>
          
          {/* 分类筛选 */}
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              分类 (可选)
            </label>
            <select
              value={filters.categoryId}
              onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">全部分类</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* 使用量筛选 */}
          {(reportType === 'usage') && (
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                最小使用量 (可选)
              </label>
              <input
                type="number"
                value={filters.minUsage}
                onChange={(e) => setFilters(prev => ({ ...prev, minUsage: e.target.value }))}
                placeholder="例如: 100"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          )}

          {/* 评价数筛选 */}
          {(reportType === 'rating') && (
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                最小评价数 (可选)
              </label>
              <input
                type="number"
                value={filters.minReviews}
                onChange={(e) => setFilters(prev => ({ ...prev, minReviews: e.target.value }))}
                placeholder="例如: 5"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          )}
        </div>

        {/* 错误信息 */}
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* 生成按钮 */}
        <Button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? '生成中...' : '生成报告'}
        </Button>
      </div>
    </Card>
  );
}