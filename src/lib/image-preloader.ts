/**
 * 图片预加载工具库
 * 提供图片预加载、缓存和优化功能
 */

interface PreloadOptions {
  priority?: 'high' | 'low';
  crossOrigin?: 'anonymous' | 'use-credentials';
  timeout?: number;
}

interface PreloadResult {
  success: boolean;
  error?: Error;
  duration: number;
}

/**
 * 预加载单个图片
 */
export function preloadImage(
  src: string, 
  options: PreloadOptions = {}
): Promise<PreloadResult> {
  const { priority = 'low', crossOrigin, timeout = 10000 } = options;
  const startTime = Date.now();

  return new Promise((resolve) => {
    const img = new Image();
    let timeoutId: NodeJS.Timeout;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      img.onload = null;
      img.onerror = null;
    };

    const handleLoad = () => {
      cleanup();
      resolve({
        success: true,
        duration: Date.now() - startTime,
      });
    };

    const handleError = (error: Event | string) => {
      cleanup();
      resolve({
        success: false,
        error: new Error(typeof error === 'string' ? error : 'Failed to load image'),
        duration: Date.now() - startTime,
      });
    };

    // 设置超时
    timeoutId = setTimeout(() => {
      handleError('Image load timeout');
    }, timeout);

    // 设置图片属性
    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }

    // 设置优先级（现代浏览器支持）
    if ('fetchPriority' in img) {
      (img as any).fetchPriority = priority;
    }

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = src;
  });
}

/**
 * 批量预加载图片
 */
export async function preloadImages(
  sources: string[],
  options: PreloadOptions & { concurrency?: number } = {}
): Promise<PreloadResult[]> {
  const { concurrency = 3, ...preloadOptions } = options;
  const results: PreloadResult[] = [];
  
  // 分批处理，避免同时发起太多请求
  for (let i = 0; i < sources.length; i += concurrency) {
    const batch = sources.slice(i, i + concurrency);
    const batchPromises = batch.map(src => preloadImage(src, preloadOptions));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
}

/**
 * 智能预加载 - 根据用户行为预测需要加载的图片
 */
export class SmartPreloader {
  private cache = new Set<string>();
  private loading = new Set<string>();
  private observer?: IntersectionObserver;

  constructor(private options: PreloadOptions = {}) {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    if (typeof window === 'undefined') return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.preloadSrc;
            if (src && !this.cache.has(src) && !this.loading.has(src)) {
              this.preloadWithCache(src);
            }
          }
        });
      },
      {
        rootMargin: '100px', // 提前100px开始预加载
        threshold: 0.1,
      }
    );
  }

  /**
   * 观察元素，当元素进入视口时预加载指定图片
   */
  observe(element: HTMLElement, src: string) {
    if (!this.observer) return;
    
    element.dataset.preloadSrc = src;
    this.observer.observe(element);
  }

  /**
   * 停止观察元素
   */
  unobserve(element: HTMLElement) {
    if (!this.observer) return;
    this.observer.unobserve(element);
  }

  /**
   * 预加载图片并缓存结果
   */
  async preloadWithCache(src: string): Promise<PreloadResult> {
    if (this.cache.has(src)) {
      return { success: true, duration: 0 };
    }

    if (this.loading.has(src)) {
      // 如果正在加载，等待加载完成
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!this.loading.has(src)) {
            resolve({ success: this.cache.has(src), duration: 0 });
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    this.loading.add(src);
    
    try {
      const result = await preloadImage(src, this.options);
      if (result.success) {
        this.cache.add(src);
      }
      return result;
    } finally {
      this.loading.delete(src);
    }
  }

  /**
   * 预加载工具相关的图片
   */
  async preloadToolImages(toolId: string, images: { icon?: string; screenshots?: string[] }) {
    const imagesToPreload: string[] = [];
    
    if (images.icon) {
      imagesToPreload.push(images.icon);
    }
    
    if (images.screenshots) {
      imagesToPreload.push(...images.screenshots);
    }

    return this.preloadImages(imagesToPreload);
  }

  /**
   * 批量预加载图片
   */
  async preloadImages(sources: string[]): Promise<PreloadResult[]> {
    const promises = sources.map(src => this.preloadWithCache(src));
    return Promise.all(promises);
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.cache.clear();
    this.loading.clear();
  }

  /**
   * 获取缓存统计
   */
  getCacheStats() {
    return {
      cached: this.cache.size,
      loading: this.loading.size,
    };
  }

  /**
   * 销毁预加载器
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
    this.clearCache();
  }
}

/**
 * 全局预加载器实例
 */
export const globalPreloader = new SmartPreloader({
  priority: 'low',
  timeout: 8000,
});

/**
 * 根据网络状况调整图片质量
 */
export function getOptimalImageQuality(): number {
  if (typeof navigator === 'undefined') return 75;

  // 检查网络连接类型
  const connection = (navigator as any).connection;
  if (connection) {
    const { effectiveType, downlink } = connection;
    
    // 根据网络类型调整质量
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 50;
      case '3g':
        return 65;
      case '4g':
        return downlink > 10 ? 85 : 75;
      default:
        return 75;
    }
  }

  return 75;
}

/**
 * 生成响应式图片尺寸字符串
 */
export function generateImageSizes(breakpoints: { [key: string]: string }): string {
  const entries = Object.entries(breakpoints);
  const sizes = entries.map(([breakpoint, size]) => {
    if (breakpoint === 'default') {
      return size;
    }
    return `(max-width: ${breakpoint}) ${size}`;
  });
  
  return sizes.join(', ');
}

/**
 * 检查图片格式支持
 */
export function checkImageFormatSupport(): Promise<{
  webp: boolean;
  avif: boolean;
}> {
  return new Promise((resolve) => {
    const results = { webp: false, avif: false };
    let completed = 0;

    const checkFormat = (format: 'webp' | 'avif', dataUrl: string) => {
      const img = new Image();
      img.onload = () => {
        results[format] = img.width === 1 && img.height === 1;
        completed++;
        if (completed === 2) resolve(results);
      };
      img.onerror = () => {
        completed++;
        if (completed === 2) resolve(results);
      };
      img.src = dataUrl;
    };

    // WebP 测试图片
    checkFormat('webp', 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA');
    
    // AVIF 测试图片
    checkFormat('avif', 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=');
  });
}