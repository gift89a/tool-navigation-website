'use client';

import { useEffect, useState } from 'react';
import { offlineManager } from '@/lib/offline-manager';

interface ServiceWorkerProviderProps {
  children: React.ReactNode;
}

export function ServiceWorkerProvider({ children }: ServiceWorkerProviderProps) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      setRegistration(reg);
      setIsRegistered(true);

      console.log('Service Worker registered successfully');

      // 监听更新
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 新版本可用
              setUpdateAvailable(true);
              console.log('New version available');
            }
          });
        }
      });

      // 监听控制器变化
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed');
        window.location.reload();
      });

      // 预缓存关键资源
      await offlineManager.cacheEssentialResources();

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  // 提供全局访问
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).updateServiceWorker = updateServiceWorker;
      (window as any).serviceWorkerRegistration = registration;
    }
  }, [registration]);

  return (
    <>
      {children}
      
      {/* 更新提示 */}
      {updateAvailable && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔄</div>
              <div className="flex-1">
                <h4 className="font-semibold">新版本可用</h4>
                <p className="text-sm opacity-90">点击更新以获取最新功能</p>
              </div>
            </div>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={updateServiceWorker}
                className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                更新
              </button>
              <button
                onClick={() => setUpdateAvailable(false)}
                className="bg-blue-700 text-white px-3 py-1 rounded text-sm hover:bg-blue-800 transition-colors"
              >
                稍后
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * 离线状态指示器组件
 */
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [queueSize, setQueueSize] = useState(0);

  useEffect(() => {
    const unsubscribe = offlineManager.onNetworkChange((online) => {
      setIsOnline(online);
      const status = offlineManager.getNetworkStatus();
      setQueueSize(status.queueSize);
    });

    // 初始状态
    const status = offlineManager.getNetworkStatus();
    setIsOnline(status.isOnline);
    setQueueSize(status.queueSize);

    return unsubscribe;
  }, []);

  if (isOnline && queueSize === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-3 py-2 rounded-lg shadow-lg text-sm font-medium ${
        isOnline 
          ? 'bg-green-600 text-white' 
          : 'bg-red-600 text-white'
      }`}>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span>
            {isOnline 
              ? queueSize > 0 
                ? `同步中 (${queueSize})` 
                : '已连接'
              : '离线模式'
            }
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 缓存状态组件（开发模式下显示）
 */
export function CacheStatus() {
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const updateStats = () => {
        import('@/lib/cache-manager').then(({ cacheManager }) => {
          setCacheStats(cacheManager.getStats());
        });
      };

      updateStats();
      const interval = setInterval(updateStats, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  if (process.env.NODE_ENV !== 'development' || !cacheStats) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setShowStats(!showStats)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-mono hover:bg-gray-700 transition-colors"
      >
        Cache Stats
      </button>
      
      {showStats && (
        <div className="absolute bottom-full left-0 mb-2 bg-gray-900 text-white p-4 rounded-lg shadow-lg text-xs font-mono min-w-64">
          <h4 className="font-bold mb-2">缓存统计</h4>
          {Object.entries(cacheStats).map(([storage, stats]: [string, any]) => (
            <div key={storage} className="mb-2">
              <div className="font-semibold text-blue-300">{storage}:</div>
              <div className="ml-2 space-y-1">
                <div>命中: {stats.hits}</div>
                <div>未命中: {stats.misses}</div>
                <div>设置: {stats.sets}</div>
                <div>删除: {stats.deletes}</div>
                <div>大小: {stats.size}</div>
                <div>命中率: {stats.hits + stats.misses > 0 ? 
                  ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1) : 0}%</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}