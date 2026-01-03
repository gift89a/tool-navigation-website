/**
 * 广告管理工具库
 * 提供广告加载、显示、统计等功能
 */

export interface AdConfig {
  id: string;
  position: string;
  format: 'image' | 'html' | 'javascript';
  content: string;
  width?: number;
  height?: number;
  url?: string;
  isActive: boolean;
  priority?: number;
  targeting?: {
    countries?: string[];
    languages?: string[];
    devices?: ('desktop' | 'mobile' | 'tablet')[];
    timeRange?: {
      start: string;
      end: string;
    };
  };
}

export interface AdStats {
  impressions: number;
  clicks: number;
  ctr: number;
  revenue?: number;
}

class AdManager {
  private ads: Map<string, AdConfig> = new Map();
  private stats: Map<string, AdStats> = new Map();
  private observers: Map<string, IntersectionObserver> = new Map();

  // 加载广告配置
  async loadAdConfig(position: string): Promise<AdConfig | null> {
    try {
      const response = await fetch(`/api/ads/${position}`);
      if (!response.ok) {
        // 如果API不可用，返回模拟数据
        return this.getFallbackAdConfig(position);
      }
      
      const { data } = await response.json();
      const adConfig: AdConfig = {
        id: data.id,
        position: data.position,
        format: this.detectAdFormat(data.content),
        content: data.content,
        isActive: data.isActive,
      };

      this.ads.set(position, adConfig);
      return adConfig;
    } catch (error) {
      console.error(`Error loading ad config for position ${position}:`, error);
      // 返回模拟数据作为后备
      return this.getFallbackAdConfig(position);
    }
  }

  // 获取后备广告配置
  private getFallbackAdConfig(position: string): AdConfig {
    const fallbackContent = {
      header: '<div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; padding: 20px; text-align: center; border-radius: 8px;">🚀 发现更多优质工具 - 点击了解</div>',
      sidebar: '<div style="background: #f8f9fa; border: 2px dashed #dee2e6; padding: 40px; text-align: center; border-radius: 8px; color: #6c757d;">📢 广告位招租</div>',
      footer: '<div style="background: #e9ecef; border: 1px solid #dee2e6; padding: 15px; text-align: center; border-radius: 8px; color: #6c757d;">🎯 广告合作联系我们</div>',
      inline: '<div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; text-align: center; border-radius: 8px; color: #856404;">💡 推荐工具 - 提升工作效率</div>',
    };

    return {
      id: `fallback-${position}-${Date.now()}`,
      position,
      format: 'html',
      content: fallbackContent[position as keyof typeof fallbackContent] || fallbackContent.sidebar,
      isActive: true,
      width: position === 'header' ? 728 : 300,
      height: position === 'header' ? 90 : 250,
    };
  }

  // 检测广告格式
  private detectAdFormat(content: string): 'image' | 'html' | 'javascript' {
    if (!content) return 'html';
    
    // 检查是否为图片URL
    if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(content)) {
      return 'image';
    }
    
    // 检查是否包含JavaScript
    if (content.includes('<script') || content.includes('javascript:')) {
      return 'javascript';
    }
    
    return 'html';
  }

  // 记录广告展示
  async recordImpression(adId: string, position: string): Promise<void> {
    try {
      await fetch('/api/ads/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adId,
          position,
          type: 'impression',
        }),
      });

      // 更新本地统计
      const stats = this.stats.get(adId) || { impressions: 0, clicks: 0, ctr: 0 };
      stats.impressions++;
      stats.ctr = stats.impressions > 0 ? (stats.clicks / stats.impressions) * 100 : 0;
      this.stats.set(adId, stats);
    } catch (error) {
      console.error('Error recording ad impression:', error);
    }
  }

  // 记录广告点击
  async recordClick(adId: string, position: string): Promise<void> {
    try {
      await fetch('/api/ads/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adId,
          position,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        }),
      });

      // 更新本地统计
      const stats = this.stats.get(adId) || { impressions: 0, clicks: 0, ctr: 0 };
      stats.clicks++;
      stats.ctr = stats.impressions > 0 ? (stats.clicks / stats.impressions) * 100 : 0;
      this.stats.set(adId, stats);
    } catch (error) {
      console.error('Error recording ad click:', error);
    }
  }

  // 设置可见性观察器
  setupVisibilityObserver(element: HTMLElement, adId: string, position: string): void {
    if (!('IntersectionObserver' in window)) {
      // 如果不支持IntersectionObserver，直接记录展示
      this.recordImpression(adId, position);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 广告进入可视区域
            this.recordImpression(adId, position);
            // 记录后停止观察
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5, // 50%可见时触发
        rootMargin: '0px',
      }
    );

    observer.observe(element);
    this.observers.set(adId, observer);
  }

  // 清理观察器
  cleanup(adId: string): void {
    const observer = this.observers.get(adId);
    if (observer) {
      observer.disconnect();
      this.observers.delete(adId);
    }
  }

  // 获取广告统计
  getStats(adId: string): AdStats | null {
    return this.stats.get(adId) || null;
  }

  // 检查广告是否应该显示
  shouldShowAd(adConfig: AdConfig): boolean {
    if (!adConfig.isActive) return false;

    // 检查定向条件
    if (adConfig.targeting) {
      const { targeting } = adConfig;

      // 检查设备类型
      if (targeting.devices) {
        const deviceType = this.getDeviceType();
        if (!targeting.devices.includes(deviceType)) {
          return false;
        }
      }

      // 检查语言
      if (targeting.languages) {
        const userLanguage = navigator.language || 'zh-CN';
        if (!targeting.languages.some(lang => userLanguage.startsWith(lang))) {
          return false;
        }
      }

      // 检查时间范围
      if (targeting.timeRange) {
        const now = new Date();
        const start = new Date(targeting.timeRange.start);
        const end = new Date(targeting.timeRange.end);
        if (now < start || now > end) {
          return false;
        }
      }
    }

    return true;
  }

  // 获取设备类型
  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent;
    
    if (/tablet|ipad/i.test(userAgent)) {
      return 'tablet';
    }
    
    if (/mobile|android|iphone/i.test(userAgent)) {
      return 'mobile';
    }
    
    return 'desktop';
  }

  // 验证广告内容安全性
  validateAdContent(content: string, format: 'image' | 'html' | 'javascript'): boolean {
    if (!content) return false;

    switch (format) {
      case 'image':
        // 验证图片URL
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(content);

      case 'html':
        // 检查HTML内容安全性
        const dangerousPatterns = [
          /<script[^>]*>.*?<\/script>/gi,
          /javascript:/gi,
          /on\w+\s*=/gi,
          /<iframe[^>]*>/gi,
          /<object[^>]*>/gi,
          /<embed[^>]*>/gi,
        ];
        
        return !dangerousPatterns.some(pattern => pattern.test(content));

      case 'javascript':
        // JavaScript广告需要更严格的验证
        const jsPatterns = [
          /eval\s*\(/gi,
          /Function\s*\(/gi,
          /setTimeout\s*\(/gi,
          /setInterval\s*\(/gi,
          /document\.write/gi,
        ];
        
        return !jsPatterns.some(pattern => pattern.test(content));

      default:
        return false;
    }
  }

  // 获取广告性能报告
  async getPerformanceReport(position?: string, period = '7d'): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (position) params.set('position', position);
      params.set('period', period);

      const response = await fetch(`/api/ads/stats?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch performance report: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching performance report:', error);
      return null;
    }
  }
}

// 创建全局广告管理器实例
export const adManager = new AdManager();

// 广告位置常量
export const AD_POSITIONS = {
  HEADER: 'header',
  SIDEBAR: 'sidebar',
  FOOTER: 'footer',
  INLINE: 'inline',
  POPUP: 'popup',
  BANNER: 'banner',
} as const;

// 广告格式常量
export const AD_FORMATS = {
  IMAGE: 'image',
  HTML: 'html',
  JAVASCRIPT: 'javascript',
} as const;

// 工具函数：生成广告ID
export function generateAdId(position: string): string {
  return `ad-${position}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// 工具函数：格式化广告统计数据
export function formatAdStats(stats: AdStats): string {
  return `展示: ${stats.impressions.toLocaleString()}, 点击: ${stats.clicks.toLocaleString()}, CTR: ${stats.ctr.toFixed(2)}%`;
}