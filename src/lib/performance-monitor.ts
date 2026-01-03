/**
 * 性能监控工具库
 * 提供页面性能监控、图片加载性能分析和用户体验指标收集
 */

interface PerformanceMetrics {
  // 页面加载性能
  pageLoad: {
    domContentLoaded: number;
    loadComplete: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
  };
  
  // 图片加载性能
  imageLoad: {
    totalImages: number;
    loadedImages: number;
    failedImages: number;
    averageLoadTime: number;
    slowestImage: { src: string; loadTime: number } | null;
  };
  
  // 网络性能
  network: {
    connectionType: string;
    downlink: number;
    rtt: number;
    effectiveType: string;
  };
  
  // 用户交互性能
  interaction: {
    scrollResponsiveness: number;
    clickResponsiveness: number;
    inputResponsiveness: number;
  };
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private imageLoadTimes: Map<string, number> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();
  private isMonitoring = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring() {
    this.isMonitoring = true;
    this.setupPerformanceObservers();
    this.monitorNetworkInformation();
    this.monitorUserInteractions();
    this.monitorPageLoad();
  }

  private setupPerformanceObservers() {
    // 监控 LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          if (lastEntry) {
            this.updateMetric('pageLoad', 'largestContentfulPaint', lastEntry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // 监控 FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.updateMetric('pageLoad', 'firstInputDelay', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.set('fid', fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // 监控 CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.updateMetric('pageLoad', 'cumulativeLayoutShift', clsValue);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }

      // 监控资源加载
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.initiatorType === 'img') {
              this.recordImageLoad(entry.name, entry.duration);
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);
      } catch (e) {
        console.warn('Resource observer not supported');
      }
    }
  }

  private monitorNetworkInformation() {
    const connection = (navigator as any).connection;
    if (connection) {
      this.metrics.network = {
        connectionType: connection.type || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        effectiveType: connection.effectiveType || 'unknown',
      };

      // 监听网络变化
      connection.addEventListener('change', () => {
        this.metrics.network = {
          connectionType: connection.type || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          effectiveType: connection.effectiveType || 'unknown',
        };
      });
    }
  }

  private monitorUserInteractions() {
    let scrollStartTime = 0;
    let clickStartTime = 0;
    let inputStartTime = 0;

    // 监控滚动响应性
    window.addEventListener('scroll', () => {
      if (scrollStartTime === 0) {
        scrollStartTime = performance.now();
        requestAnimationFrame(() => {
          const scrollTime = performance.now() - scrollStartTime;
          this.updateMetric('interaction', 'scrollResponsiveness', scrollTime);
          scrollStartTime = 0;
        });
      }
    }, { passive: true });

    // 监控点击响应性
    document.addEventListener('click', () => {
      clickStartTime = performance.now();
      requestAnimationFrame(() => {
        const clickTime = performance.now() - clickStartTime;
        this.updateMetric('interaction', 'clickResponsiveness', clickTime);
      });
    });

    // 监控输入响应性
    document.addEventListener('input', () => {
      inputStartTime = performance.now();
      requestAnimationFrame(() => {
        const inputTime = performance.now() - inputStartTime;
        this.updateMetric('interaction', 'inputResponsiveness', inputTime);
      });
    });
  }

  private monitorPageLoad() {
    // 监控基本页面加载指标
    window.addEventListener('DOMContentLoaded', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as any;
      if (navigation) {
        this.updateMetric('pageLoad', 'domContentLoaded', navigation.domContentLoadedEventEnd - navigation.navigationStart);
      }
    });

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as any;
      if (navigation) {
        this.updateMetric('pageLoad', 'loadComplete', navigation.loadEventEnd - navigation.navigationStart);
      }

      // 获取 FCP
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.updateMetric('pageLoad', 'firstContentfulPaint', fcpEntry.startTime);
      }
    });
  }

  private updateMetric(category: keyof PerformanceMetrics, metric: string, value: number) {
    if (!this.metrics[category]) {
      this.metrics[category] = {} as any;
    }
    (this.metrics[category] as any)[metric] = value;
  }

  private recordImageLoad(src: string, loadTime: number) {
    this.imageLoadTimes.set(src, loadTime);
    this.updateImageMetrics();
  }

  private updateImageMetrics() {
    const loadTimes = Array.from(this.imageLoadTimes.values());
    const totalImages = this.imageLoadTimes.size;
    const loadedImages = loadTimes.length;
    const failedImages = 0; // 这里需要额外的错误监控
    const averageLoadTime = loadTimes.length > 0 ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length : 0;
    
    let slowestImage = null;
    let maxLoadTime = 0;
    for (const [src, loadTime] of this.imageLoadTimes.entries()) {
      if (loadTime > maxLoadTime) {
        maxLoadTime = loadTime;
        slowestImage = { src, loadTime };
      }
    }

    this.metrics.imageLoad = {
      totalImages,
      loadedImages,
      failedImages,
      averageLoadTime,
      slowestImage,
    };
  }

  /**
   * 记录图片加载错误
   */
  recordImageError(src: string) {
    if (!this.metrics.imageLoad) {
      this.metrics.imageLoad = {
        totalImages: 0,
        loadedImages: 0,
        failedImages: 0,
        averageLoadTime: 0,
        slowestImage: null,
      };
    }
    this.metrics.imageLoad.failedImages++;
  }

  /**
   * 获取当前性能指标
   */
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  /**
   * 获取性能评分
   */
  getPerformanceScore(): {
    overall: number;
    pageLoad: number;
    imageLoad: number;
    interaction: number;
  } {
    const pageLoadScore = this.calculatePageLoadScore();
    const imageLoadScore = this.calculateImageLoadScore();
    const interactionScore = this.calculateInteractionScore();
    const overall = (pageLoadScore + imageLoadScore + interactionScore) / 3;

    return {
      overall: Math.round(overall),
      pageLoad: Math.round(pageLoadScore),
      imageLoad: Math.round(imageLoadScore),
      interaction: Math.round(interactionScore),
    };
  }

  private calculatePageLoadScore(): number {
    const pageLoad = this.metrics.pageLoad;
    if (!pageLoad) return 50;

    let score = 100;

    // LCP 评分 (理想 < 2.5s)
    if (pageLoad.largestContentfulPaint) {
      const lcp = pageLoad.largestContentfulPaint / 1000;
      if (lcp > 4) score -= 30;
      else if (lcp > 2.5) score -= 15;
    }

    // FID 评分 (理想 < 100ms)
    if (pageLoad.firstInputDelay) {
      if (pageLoad.firstInputDelay > 300) score -= 25;
      else if (pageLoad.firstInputDelay > 100) score -= 10;
    }

    // CLS 评分 (理想 < 0.1)
    if (pageLoad.cumulativeLayoutShift) {
      if (pageLoad.cumulativeLayoutShift > 0.25) score -= 25;
      else if (pageLoad.cumulativeLayoutShift > 0.1) score -= 10;
    }

    return Math.max(0, score);
  }

  private calculateImageLoadScore(): number {
    const imageLoad = this.metrics.imageLoad;
    if (!imageLoad) return 50;

    let score = 100;

    // 失败率评分
    const failureRate = imageLoad.failedImages / Math.max(1, imageLoad.totalImages);
    if (failureRate > 0.1) score -= 30;
    else if (failureRate > 0.05) score -= 15;

    // 平均加载时间评分 (理想 < 1s)
    if (imageLoad.averageLoadTime > 3000) score -= 25;
    else if (imageLoad.averageLoadTime > 1000) score -= 10;

    return Math.max(0, score);
  }

  private calculateInteractionScore(): number {
    const interaction = this.metrics.interaction;
    if (!interaction) return 50;

    let score = 100;

    // 滚动响应性评分 (理想 < 16ms)
    if (interaction.scrollResponsiveness > 50) score -= 20;
    else if (interaction.scrollResponsiveness > 16) score -= 10;

    // 点击响应性评分 (理想 < 16ms)
    if (interaction.clickResponsiveness > 50) score -= 20;
    else if (interaction.clickResponsiveness > 16) score -= 10;

    // 输入响应性评分 (理想 < 16ms)
    if (interaction.inputResponsiveness > 50) score -= 20;
    else if (interaction.inputResponsiveness > 16) score -= 10;

    return Math.max(0, score);
  }

  /**
   * 生成性能报告
   */
  generateReport(): string {
    const metrics = this.getMetrics();
    const scores = this.getPerformanceScore();

    let report = '=== 性能监控报告 ===\n\n';
    
    report += `总体评分: ${scores.overall}/100\n`;
    report += `页面加载: ${scores.pageLoad}/100\n`;
    report += `图片加载: ${scores.imageLoad}/100\n`;
    report += `交互响应: ${scores.interaction}/100\n\n`;

    if (metrics.pageLoad) {
      report += '页面加载指标:\n';
      report += `- DOM 加载完成: ${(metrics.pageLoad.domContentLoaded / 1000).toFixed(2)}s\n`;
      report += `- 页面完全加载: ${(metrics.pageLoad.loadComplete / 1000).toFixed(2)}s\n`;
      if (metrics.pageLoad.firstContentfulPaint) {
        report += `- 首次内容绘制: ${(metrics.pageLoad.firstContentfulPaint / 1000).toFixed(2)}s\n`;
      }
      if (metrics.pageLoad.largestContentfulPaint) {
        report += `- 最大内容绘制: ${(metrics.pageLoad.largestContentfulPaint / 1000).toFixed(2)}s\n`;
      }
      report += '\n';
    }

    if (metrics.imageLoad) {
      report += '图片加载指标:\n';
      report += `- 总图片数: ${metrics.imageLoad.totalImages}\n`;
      report += `- 已加载: ${metrics.imageLoad.loadedImages}\n`;
      report += `- 加载失败: ${metrics.imageLoad.failedImages}\n`;
      report += `- 平均加载时间: ${metrics.imageLoad.averageLoadTime.toFixed(2)}ms\n`;
      if (metrics.imageLoad.slowestImage) {
        report += `- 最慢图片: ${metrics.imageLoad.slowestImage.loadTime.toFixed(2)}ms\n`;
      }
      report += '\n';
    }

    if (metrics.network) {
      report += '网络信息:\n';
      report += `- 连接类型: ${metrics.network.connectionType}\n`;
      report += `- 有效类型: ${metrics.network.effectiveType}\n`;
      report += `- 下行速度: ${metrics.network.downlink}Mbps\n`;
      report += `- 往返时间: ${metrics.network.rtt}ms\n`;
    }

    return report;
  }

  /**
   * 停止监控
   */
  stopMonitoring() {
    this.isMonitoring = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  /**
   * 重置指标
   */
  reset() {
    this.metrics = {};
    this.imageLoadTimes.clear();
  }
}

// 全局性能监控实例
export const performanceMonitor = new PerformanceMonitor();

// 导出工具函数
export function measureFunction<T extends (...args: any[]) => any>(
  fn: T,
  name?: string
): T {
  return ((...args: any[]) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    console.log(`${name || fn.name || 'Function'} 执行时间: ${(end - start).toFixed(2)}ms`);
    
    return result;
  }) as T;
}

export function measureAsyncFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  name?: string
): T {
  return (async (...args: any[]) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    console.log(`${name || fn.name || 'Async Function'} 执行时间: ${(end - start).toFixed(2)}ms`);
    
    return result;
  }) as T;
}