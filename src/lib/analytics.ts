/**
 * 工具使用统计分析库
 * 提供工具点击、使用统计和推荐功能
 */

export interface ToolUsageStats {
  toolId: string;
  clicks: number;
  views: number;
  lastUsed: Date;
  dailyStats: Array<{
    date: string;
    clicks: number;
    views: number;
  }>;
}

export interface TrendingTool {
  toolId: string;
  name: string;
  category: string;
  trendScore: number;
  growthRate: number;
  totalUsage: number;
}

export interface PopularTool {
  toolId: string;
  name: string;
  category: string;
  usageCount: number;
  rating: number;
  popularityScore: number;
}

class AnalyticsManager {
  private usageStats: Map<string, ToolUsageStats> = new Map();
  private sessionStorage: Storage | null = null;

  constructor() {
    // 初始化存储
    if (typeof window !== 'undefined') {
      this.sessionStorage = window.localStorage;
      this.loadStoredStats();
    }
  }

  // 记录工具点击
  async recordToolClick(toolId: string, toolName: string, category: string): Promise<void> {
    try {
      // 发送到服务器
      await fetch('/api/analytics/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolId,
          toolName,
          category,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        }),
      });

      // 更新本地统计
      this.updateLocalStats(toolId, 'click');
    } catch (error) {
      console.error('Failed to record tool click:', error);
      // 即使服务器请求失败，也要更新本地统计
      this.updateLocalStats(toolId, 'click');
    }
  }

  // 记录工具浏览
  async recordToolView(toolId: string, toolName: string, category: string): Promise<void> {
    try {
      // 发送到服务器
      await fetch('/api/analytics/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolId,
          toolName,
          category,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        }),
      });

      // 更新本地统计
      this.updateLocalStats(toolId, 'view');
    } catch (error) {
      console.error('Failed to record tool view:', error);
      // 即使服务器请求失败，也要更新本地统计
      this.updateLocalStats(toolId, 'view');
    }
  }

  // 更新本地统计
  private updateLocalStats(toolId: string, type: 'click' | 'view'): void {
    const stats = this.usageStats.get(toolId) || {
      toolId,
      clicks: 0,
      views: 0,
      lastUsed: new Date(),
      dailyStats: [],
    };

    // 更新统计
    if (type === 'click') {
      stats.clicks++;
    } else {
      stats.views++;
    }
    stats.lastUsed = new Date();

    // 更新每日统计
    const today = new Date().toISOString().split('T')[0];
    let todayStats = stats.dailyStats.find(s => s.date === today);
    
    if (!todayStats) {
      todayStats = { date: today, clicks: 0, views: 0 };
      stats.dailyStats.push(todayStats);
    }

    if (type === 'click') {
      todayStats.clicks++;
    } else {
      todayStats.views++;
    }

    // 保持最近30天的数据
    stats.dailyStats = stats.dailyStats
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30);

    this.usageStats.set(toolId, stats);
    this.saveStatsToStorage();
  }

  // 获取热门工具
  async getPopularTools(limit = 10): Promise<PopularTool[]> {
    try {
      const response = await fetch(`/api/analytics/popular?limit=${limit}`);
      if (response.ok) {
        const { data } = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Failed to fetch popular tools:', error);
    }

    // 返回模拟数据作为后备
    return this.getMockPopularTools(limit);
  }

  // 获取趋势工具
  async getTrendingTools(limit = 10): Promise<TrendingTool[]> {
    try {
      const response = await fetch(`/api/analytics/trending?limit=${limit}`);
      if (response.ok) {
        const { data } = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Failed to fetch trending tools:', error);
    }

    // 返回模拟数据作为后备
    return this.getMockTrendingTools(limit);
  }

  // 获取工具统计
  getToolStats(toolId: string): ToolUsageStats | null {
    return this.usageStats.get(toolId) || null;
  }

  // 获取所有本地统计
  getAllLocalStats(): ToolUsageStats[] {
    return Array.from(this.usageStats.values());
  }

  // 从存储加载统计数据
  private loadStoredStats(): void {
    if (!this.sessionStorage) return;

    try {
      const stored = this.sessionStorage.getItem('tool-usage-stats');
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([toolId, stats]) => {
          this.usageStats.set(toolId, {
            ...(stats as ToolUsageStats),
            lastUsed: new Date((stats as ToolUsageStats).lastUsed),
          });
        });
      }
    } catch (error) {
      console.error('Failed to load stored stats:', error);
    }
  }

  // 保存统计数据到存储
  private saveStatsToStorage(): void {
    if (!this.sessionStorage) return;

    try {
      const data = Object.fromEntries(this.usageStats.entries());
      this.sessionStorage.setItem('tool-usage-stats', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save stats to storage:', error);
    }
  }

  // 模拟热门工具数据
  private getMockPopularTools(limit: number): PopularTool[] {
    const mockTools = [
      {
        toolId: '1',
        name: 'JSON 格式化工具',
        category: '开发工具',
        usageCount: 15420,
        rating: 4.8,
        popularityScore: 95.2,
      },
      {
        toolId: '3',
        name: '图片压缩工具',
        category: '图片处理',
        usageCount: 18900,
        rating: 4.9,
        popularityScore: 94.8,
      },
      {
        toolId: '2',
        name: 'Base64 编解码',
        category: '开发工具',
        usageCount: 12300,
        rating: 4.6,
        popularityScore: 89.5,
      },
      {
        toolId: '4',
        name: '密码生成器',
        category: '开发工具',
        usageCount: 9800,
        rating: 4.7,
        popularityScore: 87.3,
      },
    ];

    return mockTools.slice(0, limit);
  }

  // 模拟趋势工具数据
  private getMockTrendingTools(limit: number): TrendingTool[] {
    const mockTrending = [
      {
        toolId: '3',
        name: '图片压缩工具',
        category: '图片处理',
        trendScore: 98.5,
        growthRate: 45.2,
        totalUsage: 18900,
      },
      {
        toolId: '1',
        name: 'JSON 格式化工具',
        category: '开发工具',
        trendScore: 92.1,
        growthRate: 32.8,
        totalUsage: 15420,
      },
      {
        toolId: '4',
        name: '密码生成器',
        category: '开发工具',
        trendScore: 88.7,
        growthRate: 28.5,
        totalUsage: 9800,
      },
      {
        toolId: '2',
        name: 'Base64 编解码',
        category: '开发工具',
        trendScore: 85.3,
        growthRate: 22.1,
        totalUsage: 12300,
      },
    ];

    return mockTrending.slice(0, limit);
  }

  // 计算工具推荐分数
  calculateRecommendationScore(
    usageCount: number,
    rating: number,
    recentViews: number,
    categoryMatch: boolean
  ): number {
    let score = 0;

    // 使用量权重 (40%)
    score += (usageCount / 20000) * 40;

    // 评分权重 (30%)
    score += (rating / 5) * 30;

    // 最近浏览权重 (20%)
    score += Math.min(recentViews / 100, 1) * 20;

    // 分类匹配权重 (10%)
    if (categoryMatch) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  // 清理过期数据
  cleanupExpiredData(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    this.usageStats.forEach((stats, toolId) => {
      // 清理过期的每日统计
      stats.dailyStats = stats.dailyStats.filter(
        daily => new Date(daily.date) > thirtyDaysAgo
      );

      // 如果没有最近的使用记录，移除整个统计
      if (stats.lastUsed < thirtyDaysAgo && stats.dailyStats.length === 0) {
        this.usageStats.delete(toolId);
      }
    });

    this.saveStatsToStorage();
  }
}

// 创建全局分析管理器实例
export const analyticsManager = new AnalyticsManager();

// 工具函数：格式化使用统计
export function formatUsageStats(stats: ToolUsageStats): string {
  const totalInteractions = stats.clicks + stats.views;
  const clickRate = stats.views > 0 ? (stats.clicks / stats.views * 100).toFixed(1) : '0';
  
  return `总互动: ${totalInteractions.toLocaleString()}, 点击率: ${clickRate}%`;
}

// 工具函数：计算增长率
export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// 工具函数：获取时间段标签
export function getPeriodLabel(days: number): string {
  switch (days) {
    case 1: return '今日';
    case 7: return '7天';
    case 30: return '30天';
    case 90: return '90天';
    default: return `${days}天`;
  }
}