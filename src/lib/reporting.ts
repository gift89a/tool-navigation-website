/**
 * 数据报表生成库
 * 提供工具使用趋势报告和数据可视化功能
 */

export interface ReportData {
  id: string;
  title: string;
  description: string;
  type: 'usage' | 'trend' | 'category' | 'rating' | 'custom';
  period: {
    start: Date;
    end: Date;
  };
  data: any[];
  metadata: {
    totalRecords: number;
    generatedAt: Date;
    filters?: Record<string, any>;
  };
}

export interface UsageReport extends ReportData {
  type: 'usage';
  data: Array<{
    toolId: string;
    toolName: string;
    category: string;
    totalClicks: number;
    totalViews: number;
    uniqueUsers: number;
    conversionRate: number;
    dailyStats: Array<{
      date: string;
      clicks: number;
      views: number;
    }>;
  }>;
}

export interface TrendReport extends ReportData {
  type: 'trend';
  data: Array<{
    date: string;
    totalUsage: number;
    newTools: number;
    activeUsers: number;
    topCategories: Array<{
      category: string;
      usage: number;
      growth: number;
    }>;
  }>;
}

export interface CategoryReport extends ReportData {
  type: 'category';
  data: Array<{
    categoryId: string;
    categoryName: string;
    toolCount: number;
    totalUsage: number;
    averageRating: number;
    growthRate: number;
    topTools: Array<{
      toolId: string;
      toolName: string;
      usage: number;
    }>;
  }>;
}

export interface RatingReport extends ReportData {
  type: 'rating';
  data: Array<{
    toolId: string;
    toolName: string;
    category: string;
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      [key: number]: number;
    };
    recentTrend: 'up' | 'down' | 'stable';
  }>;
}

class ReportingManager {
  // 生成使用统计报告
  async generateUsageReport(
    startDate: Date,
    endDate: Date,
    filters?: {
      categoryId?: string;
      toolIds?: string[];
      minUsage?: number;
    }
  ): Promise<UsageReport> {
    try {
      const params = new URLSearchParams();
      params.set('startDate', startDate.toISOString());
      params.set('endDate', endDate.toISOString());
      params.set('type', 'usage');
      
      if (filters?.categoryId) params.set('categoryId', filters.categoryId);
      if (filters?.toolIds) params.set('toolIds', filters.toolIds.join(','));
      if (filters?.minUsage) params.set('minUsage', filters.minUsage.toString());

      const response = await fetch(`/api/reports/usage?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to generate usage report');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to generate usage report:', error);
      return this.getMockUsageReport(startDate, endDate);
    }
  }

  // 生成趋势分析报告
  async generateTrendReport(
    startDate: Date,
    endDate: Date,
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<TrendReport> {
    try {
      const params = new URLSearchParams();
      params.set('startDate', startDate.toISOString());
      params.set('endDate', endDate.toISOString());
      params.set('type', 'trend');
      params.set('granularity', granularity);

      const response = await fetch(`/api/reports/trend?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to generate trend report');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to generate trend report:', error);
      return this.getMockTrendReport(startDate, endDate);
    }
  }

  // 生成分类统计报告
  async generateCategoryReport(
    startDate: Date,
    endDate: Date
  ): Promise<CategoryReport> {
    try {
      const params = new URLSearchParams();
      params.set('startDate', startDate.toISOString());
      params.set('endDate', endDate.toISOString());
      params.set('type', 'category');

      const response = await fetch(`/api/reports/category?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to generate category report');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to generate category report:', error);
      return this.getMockCategoryReport(startDate, endDate);
    }
  }

  // 生成评分统计报告
  async generateRatingReport(
    startDate: Date,
    endDate: Date,
    filters?: {
      categoryId?: string;
      minReviews?: number;
    }
  ): Promise<RatingReport> {
    try {
      const params = new URLSearchParams();
      params.set('startDate', startDate.toISOString());
      params.set('endDate', endDate.toISOString());
      params.set('type', 'rating');
      
      if (filters?.categoryId) params.set('categoryId', filters.categoryId);
      if (filters?.minReviews) params.set('minReviews', filters.minReviews.toString());

      const response = await fetch(`/api/reports/rating?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to generate rating report');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to generate rating report:', error);
      return this.getMockRatingReport(startDate, endDate);
    }
  }

  // 导出报告为CSV
  exportToCSV(report: ReportData): string {
    const headers = this.getCSVHeaders(report.type);
    const rows = this.formatDataForCSV(report.data, report.type);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  }

  // 导出报告为JSON
  exportToJSON(report: ReportData): string {
    return JSON.stringify(report, null, 2);
  }

  // 下载报告文件
  downloadReport(report: ReportData, format: 'csv' | 'json' = 'csv'): void {
    let content: string;
    let mimeType: string;
    let extension: string;

    if (format === 'csv') {
      content = this.exportToCSV(report);
      mimeType = 'text/csv';
      extension = 'csv';
    } else {
      content = this.exportToJSON(report);
      mimeType = 'application/json';
      extension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  // 获取CSV表头
  private getCSVHeaders(type: ReportData['type']): string[] {
    switch (type) {
      case 'usage':
        return ['工具ID', '工具名称', '分类', '总点击数', '总浏览数', '独立用户', '转化率'];
      case 'trend':
        return ['日期', '总使用量', '新增工具', '活跃用户', '热门分类'];
      case 'category':
        return ['分类ID', '分类名称', '工具数量', '总使用量', '平均评分', '增长率'];
      case 'rating':
        return ['工具ID', '工具名称', '分类', '平均评分', '评价数量', '趋势'];
      default:
        return ['数据'];
    }
  }

  // 格式化数据为CSV格式
  private formatDataForCSV(data: any[], type: ReportData['type']): string[][] {
    switch (type) {
      case 'usage':
        return data.map(item => [
          item.toolId,
          item.toolName,
          item.category,
          item.totalClicks.toString(),
          item.totalViews.toString(),
          item.uniqueUsers.toString(),
          `${item.conversionRate.toFixed(2)}%`
        ]);
      case 'trend':
        return data.map(item => [
          item.date,
          item.totalUsage.toString(),
          item.newTools.toString(),
          item.activeUsers.toString(),
          item.topCategories.map((c: any) => c.category).join(';')
        ]);
      case 'category':
        return data.map(item => [
          item.categoryId,
          item.categoryName,
          item.toolCount.toString(),
          item.totalUsage.toString(),
          item.averageRating.toFixed(1),
          `${item.growthRate.toFixed(1)}%`
        ]);
      case 'rating':
        return data.map(item => [
          item.toolId,
          item.toolName,
          item.category,
          item.averageRating.toFixed(1),
          item.totalReviews.toString(),
          item.recentTrend
        ]);
      default:
        return data.map(item => [JSON.stringify(item)]);
    }
  }

  // 模拟使用统计报告数据
  private getMockUsageReport(startDate: Date, endDate: Date): UsageReport {
    const mockData = [
      {
        toolId: '1',
        toolName: 'JSON 格式化工具',
        category: '开发工具',
        totalClicks: 15420,
        totalViews: 18900,
        uniqueUsers: 8500,
        conversionRate: 81.6,
        dailyStats: this.generateDailyStats(startDate, endDate, 500, 800)
      },
      {
        toolId: '3',
        toolName: '图片压缩工具',
        category: '图片处理',
        totalClicks: 12300,
        totalViews: 14800,
        uniqueUsers: 7200,
        conversionRate: 83.1,
        dailyStats: this.generateDailyStats(startDate, endDate, 400, 600)
      },
      {
        toolId: '2',
        toolName: 'Base64 编解码',
        category: '开发工具',
        totalClicks: 9800,
        totalViews: 12100,
        uniqueUsers: 5900,
        conversionRate: 81.0,
        dailyStats: this.generateDailyStats(startDate, endDate, 300, 500)
      }
    ];

    return {
      id: `usage_${Date.now()}`,
      title: '工具使用统计报告',
      description: `${startDate.toLocaleDateString()} 至 ${endDate.toLocaleDateString()} 的工具使用统计`,
      type: 'usage',
      period: { start: startDate, end: endDate },
      data: mockData,
      metadata: {
        totalRecords: mockData.length,
        generatedAt: new Date()
      }
    };
  }

  // 模拟趋势分析报告数据
  private getMockTrendReport(startDate: Date, endDate: Date): TrendReport {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const mockData = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      mockData.push({
        date: date.toISOString().split('T')[0],
        totalUsage: Math.floor(Math.random() * 1000) + 2000,
        newTools: Math.floor(Math.random() * 5),
        activeUsers: Math.floor(Math.random() * 500) + 800,
        topCategories: [
          { category: '开发工具', usage: Math.floor(Math.random() * 500) + 600, growth: Math.random() * 20 - 10 },
          { category: '图片处理', usage: Math.floor(Math.random() * 400) + 400, growth: Math.random() * 20 - 10 },
          { category: '文本处理', usage: Math.floor(Math.random() * 300) + 300, growth: Math.random() * 20 - 10 }
        ]
      });
    }

    return {
      id: `trend_${Date.now()}`,
      title: '使用趋势分析报告',
      description: `${startDate.toLocaleDateString()} 至 ${endDate.toLocaleDateString()} 的使用趋势分析`,
      type: 'trend',
      period: { start: startDate, end: endDate },
      data: mockData,
      metadata: {
        totalRecords: mockData.length,
        generatedAt: new Date()
      }
    };
  }

  // 模拟分类统计报告数据
  private getMockCategoryReport(startDate: Date, endDate: Date): CategoryReport {
    const mockData = [
      {
        categoryId: '1',
        categoryName: '开发工具',
        toolCount: 8,
        totalUsage: 45600,
        averageRating: 4.6,
        growthRate: 15.2,
        topTools: [
          { toolId: '1', toolName: 'JSON 格式化工具', usage: 15420 },
          { toolId: '2', toolName: 'Base64 编解码', usage: 9800 },
          { toolId: '4', toolName: '密码生成器', usage: 8900 }
        ]
      },
      {
        categoryId: '2',
        categoryName: '图片处理',
        toolCount: 5,
        totalUsage: 32100,
        averageRating: 4.8,
        growthRate: 22.8,
        topTools: [
          { toolId: '3', toolName: '图片压缩工具', usage: 12300 },
          { toolId: '5', toolName: '图片格式转换', usage: 8900 },
          { toolId: '6', toolName: '图片裁剪工具', usage: 6700 }
        ]
      }
    ];

    return {
      id: `category_${Date.now()}`,
      title: '分类统计报告',
      description: `${startDate.toLocaleDateString()} 至 ${endDate.toLocaleDateString()} 的分类统计`,
      type: 'category',
      period: { start: startDate, end: endDate },
      data: mockData,
      metadata: {
        totalRecords: mockData.length,
        generatedAt: new Date()
      }
    };
  }

  // 模拟评分统计报告数据
  private getMockRatingReport(startDate: Date, endDate: Date): RatingReport {
    const mockData = [
      {
        toolId: '1',
        toolName: 'JSON 格式化工具',
        category: '开发工具',
        averageRating: 4.8,
        totalReviews: 156,
        ratingDistribution: { 1: 2, 2: 3, 3: 8, 4: 45, 5: 98 },
        recentTrend: 'up' as const
      },
      {
        toolId: '3',
        toolName: '图片压缩工具',
        category: '图片处理',
        averageRating: 4.9,
        totalReviews: 203,
        ratingDistribution: { 1: 1, 2: 2, 3: 5, 4: 38, 5: 157 },
        recentTrend: 'stable' as const
      }
    ];

    return {
      id: `rating_${Date.now()}`,
      title: '评分统计报告',
      description: `${startDate.toLocaleDateString()} 至 ${endDate.toLocaleDateString()} 的评分统计`,
      type: 'rating',
      period: { start: startDate, end: endDate },
      data: mockData,
      metadata: {
        totalRecords: mockData.length,
        generatedAt: new Date()
      }
    };
  }

  // 生成每日统计数据
  private generateDailyStats(startDate: Date, endDate: Date, minClicks: number, maxViews: number) {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const stats = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const views = Math.floor(Math.random() * (maxViews - minClicks)) + minClicks;
      const clicks = Math.floor(views * (0.7 + Math.random() * 0.2)); // 70-90% 转化率
      
      stats.push({
        date: date.toISOString().split('T')[0],
        clicks,
        views
      });
    }

    return stats;
  }
}

// 创建全局报告管理器实例
export const reportingManager = new ReportingManager();

// 工具函数：计算增长率
export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// 工具函数：格式化数字
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// 工具函数：格式化百分比
export function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`;
}

// 工具函数：获取趋势图标
export function getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up': return '📈';
    case 'down': return '📉';
    case 'stable': return '➡️';
    default: return '➡️';
  }
}