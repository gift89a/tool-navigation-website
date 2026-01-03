/**
 * 缓存管理系统
 * 提供多层缓存策略，包括内存缓存、localStorage、sessionStorage 和 IndexedDB
 */

interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  version?: string;
  tags?: string[];
}

interface CacheOptions {
  ttl?: number; // 默认过期时间（毫秒）
  version?: string; // 缓存版本
  tags?: string[]; // 缓存标签，用于批量清理
  storage?: 'memory' | 'localStorage' | 'sessionStorage' | 'indexedDB';
  compress?: boolean; // 是否压缩数据
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
}

/**
 * 基础缓存接口
 */
abstract class BaseCache {
  protected stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    size: 0,
  };

  abstract get<T>(key: string): Promise<T | null>;
  abstract set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  abstract delete(key: string): Promise<boolean>;
  abstract clear(): Promise<void>;
  abstract has(key: string): Promise<boolean>;

  getStats(): CacheStats {
    return { ...this.stats };
  }

  protected isExpired(item: CacheItem): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  protected createCacheItem<T>(data: T, options: CacheOptions = {}): CacheItem<T> {
    return {
      data,
      timestamp: Date.now(),
      ttl: options.ttl || 5 * 60 * 1000, // 默认5分钟
      version: options.version,
      tags: options.tags,
    };
  }
}

/**
 * 内存缓存
 */
class MemoryCache extends BaseCache {
  private cache = new Map<string, CacheItem>();
  private maxSize: number;

  constructor(maxSize = 100) {
    super();
    this.maxSize = maxSize;
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }

    if (this.isExpired(item)) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.size--;
      return null;
    }

    this.stats.hits++;
    return item.data as T;
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    // 如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
        this.stats.size--;
      }
    }

    const item = this.createCacheItem(value, options);
    const isNew = !this.cache.has(key);
    
    this.cache.set(key, item);
    this.stats.sets++;
    
    if (isNew) {
      this.stats.size++;
    }
  }

  async delete(key: string): Promise<boolean> {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
      this.stats.size--;
    }
    return deleted;
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.stats.size = 0;
  }

  async has(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (this.isExpired(item)) {
      this.cache.delete(key);
      this.stats.size--;
      return false;
    }
    
    return true;
  }

  // 根据标签清理缓存
  async clearByTags(tags: string[]): Promise<void> {
    for (const [key, item] of this.cache.entries()) {
      if (item.tags && item.tags.some(tag => tags.includes(tag))) {
        this.cache.delete(key);
        this.stats.deletes++;
        this.stats.size--;
      }
    }
  }
}

/**
 * localStorage 缓存
 */
class LocalStorageCache extends BaseCache {
  private prefix: string;

  constructor(prefix = 'cache_') {
    super();
    this.prefix = prefix;
  }

  async get<T>(key: string): Promise<T | null> {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(this.prefix + key);
      if (!stored) {
        this.stats.misses++;
        return null;
      }

      const item: CacheItem<T> = JSON.parse(stored);
      
      if (this.isExpired(item)) {
        localStorage.removeItem(this.prefix + key);
        this.stats.misses++;
        return null;
      }

      this.stats.hits++;
      return item.data;
    } catch (error) {
      console.warn('LocalStorage cache get error:', error);
      this.stats.misses++;
      return null;
    }
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const item = this.createCacheItem(value, options);
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
      this.stats.sets++;
    } catch (error) {
      console.warn('LocalStorage cache set error:', error);
      // 如果存储空间不足，尝试清理过期项
      this.cleanExpired();
    }
  }

  async delete(key: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      const existed = localStorage.getItem(this.prefix + key) !== null;
      localStorage.removeItem(this.prefix + key);
      if (existed) {
        this.stats.deletes++;
      }
      return existed;
    } catch (error) {
      console.warn('LocalStorage cache delete error:', error);
      return false;
    }
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('LocalStorage cache clear error:', error);
    }
  }

  async has(key: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      const stored = localStorage.getItem(this.prefix + key);
      if (!stored) return false;

      const item: CacheItem = JSON.parse(stored);
      if (this.isExpired(item)) {
        localStorage.removeItem(this.prefix + key);
        return false;
      }

      return true;
    } catch (error) {
      console.warn('LocalStorage cache has error:', error);
      return false;
    }
  }

  private cleanExpired(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
      keys.forEach(key => {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const item: CacheItem = JSON.parse(stored);
            if (this.isExpired(item)) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          // 如果解析失败，删除该项
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('LocalStorage cache cleanup error:', error);
    }
  }
}

/**
 * IndexedDB 缓存（用于大数据存储）
 */
class IndexedDBCache extends BaseCache {
  private dbName: string;
  private storeName: string;
  private version: number;
  private db: IDBDatabase | null = null;

  constructor(dbName = 'CacheDB', storeName = 'cache', version = 1) {
    super();
    this.dbName = dbName;
    this.storeName = storeName;
    this.version = version;
  }

  private async openDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (typeof window === 'undefined') return null;

    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve) => {
        const request = store.get(key);
        
        request.onsuccess = () => {
          const result = request.result;
          if (!result) {
            this.stats.misses++;
            resolve(null);
            return;
          }

          const item: CacheItem<T> = result.value;
          if (this.isExpired(item)) {
            this.delete(key);
            this.stats.misses++;
            resolve(null);
            return;
          }

          this.stats.hits++;
          resolve(item.data);
        };

        request.onerror = () => {
          this.stats.misses++;
          resolve(null);
        };
      });
    } catch (error) {
      console.warn('IndexedDB cache get error:', error);
      this.stats.misses++;
      return null;
    }
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const item = this.createCacheItem(value, options);
      
      return new Promise((resolve, reject) => {
        const request = store.put({ key, value: item });
        
        request.onsuccess = () => {
          this.stats.sets++;
          resolve();
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('IndexedDB cache set error:', error);
    }
  }

  async delete(key: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve) => {
        const request = store.delete(key);
        
        request.onsuccess = () => {
          this.stats.deletes++;
          resolve(true);
        };
        
        request.onerror = () => resolve(false);
      });
    } catch (error) {
      console.warn('IndexedDB cache delete error:', error);
      return false;
    }
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
      });
    } catch (error) {
      console.warn('IndexedDB cache clear error:', error);
    }
  }

  async has(key: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve) => {
        const request = store.get(key);
        
        request.onsuccess = () => {
          const result = request.result;
          if (!result) {
            resolve(false);
            return;
          }

          const item: CacheItem = result.value;
          if (this.isExpired(item)) {
            this.delete(key);
            resolve(false);
            return;
          }

          resolve(true);
        };

        request.onerror = () => resolve(false);
      });
    } catch (error) {
      console.warn('IndexedDB cache has error:', error);
      return false;
    }
  }
}

/**
 * 多层缓存管理器
 */
class CacheManager {
  private caches: Map<string, BaseCache> = new Map();
  private defaultOptions: CacheOptions = {
    ttl: 5 * 60 * 1000, // 5分钟
    storage: 'memory',
  };

  constructor() {
    // 初始化默认缓存层
    this.caches.set('memory', new MemoryCache(200));
    this.caches.set('localStorage', new LocalStorageCache());
    this.caches.set('indexedDB', new IndexedDBCache());
  }

  /**
   * 获取缓存数据（多层查找）
   */
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const storage = options.storage || this.defaultOptions.storage!;
    
    // 如果指定了存储类型，只从该层获取
    if (storage !== 'memory') {
      const cache = this.caches.get(storage);
      return cache ? cache.get<T>(key) : null;
    }

    // 多层查找：内存 -> localStorage -> IndexedDB
    const layers = ['memory', 'localStorage', 'indexedDB'];
    
    for (const layer of layers) {
      const cache = this.caches.get(layer);
      if (cache) {
        const result = await cache.get<T>(key);
        if (result !== null) {
          // 如果在较慢的层找到数据，将其提升到更快的层
          if (layer !== 'memory') {
            await this.set(key, result, { ...options, storage: 'memory' });
          }
          return result;
        }
      }
    }

    return null;
  }

  /**
   * 设置缓存数据
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const storage = mergedOptions.storage!;

    const cache = this.caches.get(storage);
    if (cache) {
      await cache.set(key, value, mergedOptions);
    }

    // 如果设置到持久化存储，也设置到内存缓存以提高访问速度
    if (storage !== 'memory') {
      const memoryCache = this.caches.get('memory');
      if (memoryCache) {
        await memoryCache.set(key, value, { ...mergedOptions, ttl: Math.min(mergedOptions.ttl!, 60000) });
      }
    }
  }

  /**
   * 删除缓存数据
   */
  async delete(key: string, storage?: string): Promise<boolean> {
    if (storage) {
      const cache = this.caches.get(storage);
      return cache ? cache.delete(key) : false;
    }

    // 从所有层删除
    let deleted = false;
    for (const cache of this.caches.values()) {
      const result = await cache.delete(key);
      deleted = deleted || result;
    }
    return deleted;
  }

  /**
   * 清空缓存
   */
  async clear(storage?: string): Promise<void> {
    if (storage) {
      const cache = this.caches.get(storage);
      if (cache) {
        await cache.clear();
      }
      return;
    }

    // 清空所有层
    for (const cache of this.caches.values()) {
      await cache.clear();
    }
  }

  /**
   * 检查缓存是否存在
   */
  async has(key: string, storage?: string): Promise<boolean> {
    if (storage) {
      const cache = this.caches.get(storage);
      return cache ? cache.has(key) : false;
    }

    // 检查所有层
    for (const cache of this.caches.values()) {
      if (await cache.has(key)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): Record<string, CacheStats> {
    const stats: Record<string, CacheStats> = {};
    for (const [name, cache] of this.caches.entries()) {
      stats[name] = cache.getStats();
    }
    return stats;
  }

  /**
   * 根据标签清理缓存
   */
  async clearByTags(tags: string[]): Promise<void> {
    const memoryCache = this.caches.get('memory') as MemoryCache;
    if (memoryCache) {
      await memoryCache.clearByTags(tags);
    }
  }

  /**
   * 预热缓存
   */
  async warmup<T>(entries: Array<{ key: string; value: T; options?: CacheOptions }>): Promise<void> {
    const promises = entries.map(({ key, value, options }) => 
      this.set(key, value, options)
    );
    await Promise.all(promises);
  }
}

// 全局缓存管理器实例
export const cacheManager = new CacheManager();

// 导出缓存装饰器
export function cached<T extends (...args: any[]) => any>(
  options: CacheOptions & { keyGenerator?: (...args: Parameters<T>) => string } = {}
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: Parameters<T>) {
      const key = options.keyGenerator 
        ? options.keyGenerator(...args)
        : `${target.constructor.name}.${propertyName}:${JSON.stringify(args)}`;
      
      // 尝试从缓存获取
      const cached = await cacheManager.get(key, options);
      if (cached !== null) {
        return cached;
      }
      
      // 执行原方法
      const result = await method.apply(this, args);
      
      // 缓存结果
      await cacheManager.set(key, result, options);
      
      return result;
    };
  };
}

// 导出工具函数
export function createCacheKey(...parts: (string | number | boolean)[]): string {
  return parts.map(part => String(part)).join(':');
}

export function getCacheSize(storage: 'localStorage' | 'sessionStorage' = 'localStorage'): number {
  if (typeof window === 'undefined') return 0;
  
  let size = 0;
  const storageObj = window[storage];
  
  for (let key in storageObj) {
    if (storageObj.hasOwnProperty(key)) {
      size += storageObj[key].length + key.length;
    }
  }
  
  return size;
}