'use client';

import { useEffect, useState, useRef } from 'react';
import { adManager } from '@/lib/ad-manager';
import { cn } from '@/lib/utils';

export interface AdSlotData {
  id: string;
  name: string;
  position: string;
  content?: string;
  isActive: boolean;
  format: 'image' | 'html' | 'javascript';
  width?: number;
  height?: number;
  url?: string;
  alt?: string;
  target?: '_blank' | '_self';
}

interface AdSlotProps {
  position: string;
  className?: string;
  fallback?: React.ReactNode;
  onAdLoad?: (adId: string) => void;
  onAdError?: (error: Error) => void;
  onAdClick?: (adId: string) => void;
}

export function AdSlot({ 
  position, 
  className, 
  fallback,
  onAdLoad,
  onAdError,
  onAdClick
}: AdSlotProps) {
  const [adData, setAdData] = useState<AdSlotData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const adRef = useRef<HTMLDivElement>(null);

  // 加载广告数据
  useEffect(() => {
    const loadAd = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 使用 adManager 加载广告配置
        const adConfig = await adManager.loadAdConfig(position);
        
        if (adConfig && adManager.shouldShowAd(adConfig)) {
          // 转换 AdConfig 到 AdSlotData 格式
          const adSlotData: AdSlotData = {
            id: adConfig.id,
            name: `广告位-${adConfig.position}`,
            position: adConfig.position,
            content: adConfig.content,
            isActive: adConfig.isActive,
            format: adConfig.format,
            width: adConfig.width,
            height: adConfig.height,
            url: adConfig.url,
          };
          
          setAdData(adSlotData);
          onAdLoad?.(adConfig.id);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load ad');
        setError(error.message);
        onAdError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAd();
  }, [position, onAdLoad, onAdError]);

  // 处理广告点击
  const handleAdClick = () => {
    if (adData) {
      onAdClick?.(adData.id);
      
      // 使用 adManager 记录点击统计
      adManager.recordClick(adData.id, adData.position);
    }
  };

  // 设置可见性观察器以记录展示
  useEffect(() => {
    if (adData && adRef.current) {
      adManager.setupVisibilityObserver(adRef.current, adData.id, adData.position);
      
      return () => {
        adManager.cleanup(adData.id);
      };
    }
  }, [adData]);

  // 渲染不同格式的广告
  const renderAdContent = () => {
    if (!adData) return null;

    switch (adData.format) {
      case 'image':
        return (
          <img
            src={adData.content}
            alt={adData.alt || adData.name}
            width={adData.width}
            height={adData.height}
            className="w-full h-auto object-cover rounded"
            onClick={handleAdClick}
            style={{ cursor: adData.url ? 'pointer' : 'default' }}
          />
        );

      case 'html':
        return (
          <div
            dangerouslySetInnerHTML={{ __html: adData.content || '' }}
            onClick={handleAdClick}
            style={{ 
              cursor: 'pointer',
              width: adData.width ? `${adData.width}px` : '100%',
              height: adData.height ? `${adData.height}px` : 'auto',
            }}
          />
        );

      case 'javascript':
        return <JavaScriptAd adData={adData} onClick={handleAdClick} />;

      default:
        return null;
    }
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className={cn('ad-slot ad-loading', className)}>
        <div className="flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded animate-pulse">
          <div className="text-gray-500 dark:text-gray-400">加载广告中...</div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return fallback ? (
      <div className={cn('ad-slot ad-error', className)}>
        {fallback}
      </div>
    ) : null;
  }

  // 无广告数据
  if (!adData) {
    return fallback ? (
      <div className={cn('ad-slot ad-empty', className)}>
        {fallback}
      </div>
    ) : null;
  }

  return (
    <div 
      ref={adRef}
      className={cn('ad-slot', `ad-position-${position}`, className)}
      data-ad-id={adData.id}
      data-ad-position={position}
    >
      {renderAdContent()}
      
      {/* 广告标识 */}
      <div className="ad-label text-xs text-gray-400 mt-1 text-center">
        广告
      </div>
    </div>
  );
}

// JavaScript广告组件
function JavaScriptAd({ 
  adData, 
  onClick 
}: { 
  adData: AdSlotData; 
  onClick: () => void; 
}) {
  const scriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adData.content || !scriptRef.current) return;

    try {
      // 创建script标签并执行
      const script = document.createElement('script');
      script.textContent = adData.content;
      scriptRef.current.appendChild(script);

      // 添加点击事件监听
      const handleClick = (e: Event) => {
        e.preventDefault();
        onClick();
      };

      scriptRef.current.addEventListener('click', handleClick);

      return () => {
        if (scriptRef.current) {
          scriptRef.current.removeEventListener('click', handleClick);
        }
      };
    } catch (error) {
      console.error('Error executing ad script:', error);
    }
  }, [adData.content, onClick]);

  return (
    <div 
      ref={scriptRef}
      style={{ 
        width: adData.width ? `${adData.width}px` : '100%',
        height: adData.height ? `${adData.height}px` : 'auto',
      }}
    />
  );
}

// 预定义的广告位组件
export function HeaderAd({ className }: { className?: string }) {
  return (
    <AdSlot
      position="header"
      className={cn('mb-4', className)}
      fallback={
        <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center text-gray-500 dark:text-gray-400">
          <div className="text-sm">广告位 - Header</div>
        </div>
      }
    />
  );
}

export function SidebarAd({ className }: { className?: string }) {
  return (
    <AdSlot
      position="sidebar"
      className={cn('mb-4', className)}
      fallback={
        <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
          <div className="text-sm mb-2">广告位</div>
          <div className="text-xs">Sidebar</div>
        </div>
      }
    />
  );
}

export function FooterAd({ className }: { className?: string }) {
  return (
    <AdSlot
      position="footer"
      className={cn('mt-4', className)}
      fallback={
        <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center text-gray-500 dark:text-gray-400">
          <div className="text-sm">广告位 - Footer</div>
        </div>
      }
    />
  );
}

export function InlineAd({ className }: { className?: string }) {
  return (
    <AdSlot
      position="inline"
      className={cn('my-6', className)}
      fallback={
        <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center text-gray-500 dark:text-gray-400">
          <div className="text-sm">广告位 - Inline</div>
        </div>
      }
    />
  );
}