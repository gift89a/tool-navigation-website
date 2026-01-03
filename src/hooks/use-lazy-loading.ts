import { useEffect, useRef, useState } from 'react';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * 懒加载 Hook
 * 使用 Intersection Observer API 实现元素的懒加载
 */
export function useLazyLoading<T extends HTMLElement = HTMLDivElement>(
  options: UseLazyLoadingOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 如果已经触发过且只触发一次，则不再观察
    if (hasTriggered && triggerOnce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && triggerOnce) {
          setHasTriggered(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return {
    elementRef,
    isIntersecting: triggerOnce ? (hasTriggered || isIntersecting) : isIntersecting,
    hasTriggered,
  };
}

/**
 * 图片懒加载 Hook
 * 专门用于图片的懒加载，包含预加载功能
 */
export function useImageLazyLoading(
  src: string,
  options: UseLazyLoadingOptions & {
    preloadOffset?: string;
    onLoad?: () => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const {
    preloadOffset = '100px',
    onLoad,
    onError,
    ...lazyOptions
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { elementRef, isIntersecting } = useLazyLoading<HTMLImageElement>({
    ...lazyOptions,
    rootMargin: preloadOffset,
  });

  useEffect(() => {
    if (!isIntersecting || isLoaded || hasError || isLoading) return;

    setIsLoading(true);
    
    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
      onLoad?.();
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      const error = new Error(`Failed to load image: ${src}`);
      onError?.(error);
    };
    
    img.src = src;
  }, [isIntersecting, src, isLoaded, hasError, isLoading, onLoad, onError]);

  return {
    elementRef,
    isIntersecting,
    isLoaded,
    hasError,
    isLoading,
    shouldLoad: isIntersecting,
  };
}

/**
 * 列表懒加载 Hook
 * 用于实现无限滚动或分页加载
 */
export function useListLazyLoading<T>(
  items: T[],
  options: {
    pageSize?: number;
    threshold?: number;
    rootMargin?: string;
    hasMore?: boolean;
    onLoadMore?: () => void;
  } = {}
) {
  const {
    pageSize = 20,
    threshold = 0.1,
    rootMargin = '100px',
    hasMore = true,
    onLoadMore,
  } = options;

  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const visibleItems = items.slice(0, visibleCount);
  const hasMoreItems = visibleCount < items.length || hasMore;

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !hasMoreItems) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          
          // 如果还有本地数据，直接显示更多
          if (visibleCount < items.length) {
            setTimeout(() => {
              setVisibleCount(prev => Math.min(prev + pageSize, items.length));
              setIsLoadingMore(false);
            }, 100);
          } else if (onLoadMore) {
            // 否则触发加载更多数据
            onLoadMore();
            setIsLoadingMore(false);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreItems, isLoadingMore, visibleCount, items.length, pageSize, threshold, rootMargin, onLoadMore]);

  return {
    visibleItems,
    hasMoreItems,
    isLoadingMore,
    loadMoreRef,
    loadMore: () => {
      if (!isLoadingMore && hasMoreItems) {
        setVisibleCount(prev => Math.min(prev + pageSize, items.length));
      }
    },
  };
}

/**
 * 内容懒加载 Hook
 * 用于延迟渲染复杂组件
 */
export function useContentLazyLoading(
  options: UseLazyLoadingOptions & {
    delay?: number;
  } = {}
) {
  const { delay = 0, ...lazyOptions } = options;
  const [shouldRender, setShouldRender] = useState(false);
  const { elementRef, isIntersecting } = useLazyLoading(lazyOptions);

  useEffect(() => {
    if (isIntersecting && !shouldRender) {
      if (delay > 0) {
        const timer = setTimeout(() => {
          setShouldRender(true);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setShouldRender(true);
      }
    }
  }, [isIntersecting, shouldRender, delay]);

  return {
    elementRef,
    isIntersecting,
    shouldRender,
  };
}