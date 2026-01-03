'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/layout';
import { ReportGenerator } from '@/components/reports/report-generator';
import { ReportViewer } from '@/components/reports/report-viewer';
import { Card } from '@/components/ui/card';
import type { ReportData } from '@/lib/reporting';

export default function ReportsPage() {
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null);
  const [reportHistory, setReportHistory] = useState<ReportData[]>([]);

  const handleReportGenerated = (report: ReportData) => {
    setCurrentReport(report);
    setReportHistory(prev => [report, ...prev.slice(0, 9)]); // 保留最近10个报告
  };

  const handleSelectHistoryReport = (report: ReportData) => {
    setCurrentReport(report);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            数据报表中心
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            生成和查看工具使用统计、趋势分析等数据报告
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：报告生成器 */}
          <div className="lg:col-span-1 space-y-6">
            <ReportGenerator onReportGenerated={handleReportGenerated} />

            {/* 报告历史 */}
            {reportHistory.length > 0 && (
              <Card className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  最近报告
                </h3>
                <div className="space-y-2">
                  {reportHistory.map((report, index) => (
                    <button
                      key={report.id}
                      onClick={() => handleSelectHistoryReport(report)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        currentReport?.id === report.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                        {report.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {report.metadata.generatedAt.toLocaleDateString('zh-CN')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {report.metadata.totalRecords} 条数据
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* 右侧：报告查看器 */}
          <div className="lg:col-span-3">
            {currentReport ? (
              <ReportViewer report={currentReport} />
            ) : (
              <Card className="p-12 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                    开始生成数据报告
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    选择报告类型和时间范围，生成详细的数据分析报告
                  </p>
                  
                  {/* 功能介绍 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-left">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-2xl mb-2">📈</div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        使用统计报告
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        查看工具的点击量、浏览量、用户转化率等详细使用数据
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-2xl mb-2">📊</div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        趋势分析报告
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        分析工具使用趋势、用户增长和热门分类变化
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-2xl mb-2">📂</div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        分类统计报告
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        对比不同分类的工具数量、使用量和增长情况
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-2xl mb-2">⭐</div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        评分统计报告
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        统计工具评分分布、用户满意度和评价趋势
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}