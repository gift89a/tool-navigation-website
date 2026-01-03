/**
 * 离线功能管理器
 * 提供离线检测、数据同步和离线缓存功能
 */

import { cacheManager } from './cache-manager';

interface OfflineQueueItem {
  id: string;
  type: 'api' | 'analytics' | 'user-action';
  url: string;
  method: string;
  data?: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

interface OfflineConfig {
  enableOfflineMode: boolean;
  maxQueueSize: number;
  syncInterval: number;
  maxRetries: number;
  criticalPaths: string[];
}

class OfflineManager {
  private isOnline = true;
  private queue: OfflineQueueItem[] = [];
  private syncTimer: NodeJS.Timeout | null = null;
  private listeners: Set<(isOnline: boolean) => void> = new Set();
  
  private config: OfflineConfig = {
    enableOfflineMode: true,
    maxQueueSize: 100,
    syncInterval: 30000, // 30秒
    maxRetries: 3,
    criticalPaths: ['/api/tools', '/api/categories', '/api/search'],
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeOfflineDetection();
      this.loadQueueFromStorage();
      this.startSyncTimer();
    }
  }

  private initializeOfflineDetection() {
    // 初始状态
    this.isOnline = navigator.onLine;

    // 监听网络状态变化
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // 定期检查网络连接
    this.startNetworkCheck();
  }

  private handleOnline() {
    console.log('网络连接已恢复');
    this.isOnline = true;
    this.notifyListeners(true);
    this.syncQueuedRequests();
  }

  private handleOffline() {
    console.log('网络连接已断开');
    this.isOnline = false;
    this.notifyListeners(false);
  }

  private startNetworkCheck() {
    // 每30秒检查一次网络连接
    setInterval(async () => {
      try {
        // 尝试获取一个小的资源来检查网络
        const response = await fetch('/favicon.ico', {
          method: 'HEAD',
          cache: 'no-cache',
        });
        
        const wasOnline = this.isOnline;
        this.isOnline = response.ok;
        
        if (wasOnline !== this.isOnline) {
          this.notifyListeners(this.isOnline);
          if (this.isOnline) {
            this.syncQueuedRequests();
          }
        }
      } catch (error) {
        const wasOnline = this.isOnline;
        this.isOnline = false;
        
        if (wasOnline) {
          this.notifyListeners(false);
        }
      }
    }, 30000);
  }

  private notifyListeners(isOnline: boolean) {
    this.listeners.forEach(listener => listener(isOnline));
  }

  private startSyncTimer() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(() => {
      if (this.isOnline && this.queue.length > 0) {
        this.syncQueuedRequests();
      }
    }, this.config.syncInterval);
  }

  private async loadQueueFromStorage() {
    try {
      const stored = await cacheManager.get<OfflineQueueItem[]>('offline_queue', {
        storage: 'localStorage',
        ttl: 24 * 60 * 60 * 1000, // 24小时
      });
      
      if (stored) {
        this.queue = stored.filter(item => 
          Date.now() - item.timestamp < 24 * 60 * 60 * 1000 // 只保留24小时内的请求
        );
      }
    } catch (error) {
      console.warn('Failed to load offline queue:', error);
    }
  }

  private async saveQueueToStorage() {
    try {
      await cacheManager.set('offline_queue', this.queue, {
        storage: 'localStorage',
        ttl: 24 * 60 * 60 * 1000,
      });
    } catch (error) {
      console.warn('Failed to save offline queue:', error);
    }
  }

  /**
   * 添加请求到离线队列
   */
  async queueRequest(
    url: string,
    options: RequestInit = {},
    type: OfflineQueueItem['type'] = 'api'
  ): Promise<void> {
    if (this.queue.length >= this.config.maxQueueSize) {
      // 移除最旧的非关键请求
      const nonCriticalIndex = this.queue.findIndex(item => 
        !this.config.criticalPaths.some(path => item.url.includes(path))
      );
      
      if (nonCriticalIndex !== -1) {
        this.queue.splice(nonCriticalIndex, 1);
      } else {
        this.queue.shift(); // 移除最旧的请求
      }
    }

    const queueItem: OfflineQueueItem = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      url,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body as string) : undefined,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: this.config.maxRetries,
    };

    this.queue.push(queueItem);
    await this.saveQueueToStorage();
  }

  /**
   * 同步队列中的请求
   */
  private async syncQueuedRequests() {
    if (!this.isOnline || this.queue.length === 0) return;

    console.log(`开始同步 ${this.queue.length} 个离线请求`);
    
    const itemsToProcess = [...this.queue];
    const successfulItems: string[] = [];
    const failedItems: string[] = [];

    for (const item of itemsToProcess) {
      try {
        const options: RequestInit = {
          method: item.method,
          headers: {
            'Content-Type': 'application/json',
          },
        };

        if (item.data) {
          options.body = JSON.stringify(item.data);
        }

        const response = await fetch(item.url, options);
        
        if (response.ok) {
          successfulItems.push(item.id);
          console.log(`成功同步请求: ${item.url}`);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.warn(`同步请求失败: ${item.url}`, error);
        
        item.retryCount++;
        if (item.retryCount >= item.maxRetries) {
          failedItems.push(item.id);
          console.error(`请求达到最大重试次数，放弃同步: ${item.url}`);
        }
      }
    }

    // 移除成功和失败的请求
    this.queue = this.queue.filter(item => 
      !successfulItems.includes(item.id) && !failedItems.includes(item.id)
    );

    await this.saveQueueToStorage();
    
    if (successfulItems.length > 0 || failedItems.length > 0) {
      console.log(`同步完成: ${successfulItems.length} 成功, ${failedItems.length} 失败`);
    }
  }

  /**
   * 缓存关键资源以供离线使用
   */
  async cacheEssentialResources(): Promise<void> {
    const essentialUrls = [
      '/api/categories',
      '/api/tools?limit=50', // 缓存前50个工具
      '/api/search/suggestions',
    ];

    console.log('开始缓存关键资源...');

    for (const url of essentialUrls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          await cacheManager.set(`offline_${url}`, data, {
            storage: 'indexedDB',
            ttl: 24 * 60 * 60 * 1000, // 24小时
            tags: ['offline', 'essential'],
          });
          console.log(`已缓存: ${url}`);
        }
      } catch (error) {
        console.warn(`缓存失败: ${url}`, error);
      }
    }

    console.log('关键资源缓存完成');
  }

  /**
   * 获取离线缓存的数据
   */
  async getOfflineData<T>(url: string): Promise<T | null> {
    return cacheManager.get<T>(`offline_${url}`, {
      storage: 'indexedDB',
    });
  }

  /**
   * 智能请求 - 在线时发送请求，离线时返回缓存或排队
   */
  async smartFetch<T>(url: string, options: RequestInit = {}): Promise<T | null> {
    if (this.isOnline) {
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          
          // 缓存成功的响应
          await cacheManager.set(`offline_${url}`, data, {
            storage: 'indexedDB',
            ttl: 60 * 60 * 1000, // 1小时
            tags: ['offline'],
          });
          
          return data;
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.warn(`在线请求失败，尝试离线缓存: ${url}`, error);
        
        // 如果是写操作，加入队列
        if (options.method && options.method !== 'GET') {
          await this.queueRequest(url, options);
        }
        
        // 返回缓存数据
        return this.getOfflineData<T>(url);
      }
    } else {
      // 离线模式
      if (options.method && options.method !== 'GET') {
        await this.queueRequest(url, options);
        return null;
      }
      
      return this.getOfflineData<T>(url);
    }
  }

  /**
   * 监听网络状态变化
   */
  onNetworkChange(callback: (isOnline: boolean) => void): () => void {
    this.listeners.add(callback);
    
    // 返回取消监听的函数
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * 获取当前网络状态
   */
  getNetworkStatus(): {
    isOnline: boolean;
    queueSize: number;
    lastSync: number | null;
  } {
    return {
      isOnline: this.isOnline,
      queueSize: this.queue.length,
      lastSync: this.queue.length > 0 ? Math.max(...this.queue.map(item => item.timestamp)) : null,
    };
  }

  /**
   * 手动触发同步
   */
  async forcSync(): Promise<void> {
    if (this.isOnline) {
      await this.syncQueuedRequests();
    }
  }

  /**
   * 清空离线队列
   */
  async clearQueue(): Promise<void> {
    this.queue = [];
    await this.saveQueueToStorage();
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<OfflineConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.syncInterval) {
      this.startSyncTimer();
    }
  }

  /**
   * 销毁管理器
   */
  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline.bind(this));
      window.removeEventListener('offline', this.handleOffline.bind(this));
    }
    
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    
    this.listeners.clear();
  }
}

// 全局离线管理器实例
export const offlineManager = new OfflineManager();

// React Hook for offline status
export function useOfflineStatus() {
  if (typeof window === 'undefined') {
    return { isOnline: true, queueSize: 0 };
  }

  const [status, setStatus] = React.useState(() => offlineManager.getNetworkStatus());

  React.useEffect(() => {
    const unsubscribe = offlineManager.onNetworkChange((isOnline) => {
      setStatus(offlineManager.getNetworkStatus());
    });

    return unsubscribe;
  }, []);

  return status;
}

// 导出工具函数
export function isOfflineCapable(url: string): boolean {
  const offlineCapablePaths = [
    '/api/categories',
    '/api/tools',
    '/api/search',
  ];
  
  return offlineCapablePaths.some(path => url.includes(path));
}

export async function preloadOfflineData(): Promise<void> {
  await offlineManager.cacheEssentialResources();
}

// 为了避免 React 导入错误，我们需要动态导入
let React: any;
if (typeof window !== 'undefined') {
  React = require('react');
}