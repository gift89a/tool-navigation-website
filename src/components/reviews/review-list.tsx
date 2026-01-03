'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
  author?: string; // For backward compatibility with mock data
  user?: {
    id: string;
    name?: string;
    avatar?: string;
  };
  tool: {
    id: string;
    name: string;
    icon: string;
  };
}

interface ReviewListProps {
  toolId?: string;
  userId?: string;
  limit?: number;
  showToolInfo?: boolean;
  className?: string;
}

export function ReviewList({ 
  toolId, 
  userId, 
  limit = 10, 
  showToolInfo = false,
  className 
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sortBy, setSortBy] = useState<'createdAt' | 'rating' | 'helpful'>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadReviews(1);
  }, [toolId, userId, sortBy, order]);

  const loadReviews = async (pageNum: number) => {
    try {
      setIsLoading(pageNum === 1);
      setError(null);

      const params = new URLSearchParams();
      if (toolId) params.set('toolId', toolId);
      if (userId) params.set('userId', userId);
      params.set('page', pageNum.toString());
      params.set('limit', limit.toString());
      params.set('sortBy', sortBy);
      params.set('order', order);

      const response = await fetch(`/api/reviews?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        if (pageNum === 1) {
          setReviews(result.data);
        } else {
          setReviews(prev => [...prev, ...result.data]);
        }
        setHasMore(result.pagination.page < result.pagination.pages);
        setPage(pageNum);
      } else {
        setError(result.error || '加载失败');
      }
    } catch (err) {
      setError('网络错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadReviews(page + 1);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      const response = await fetch('/api/reviews/helpful', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          userId: 'anonymous', // 在实际应用中应该使用真实的用户ID
        }),
      });

      const result = await response.json();
      if (result.success) {
        setReviews(prev => 
          prev.map(review => 
            review.id === reviewId 
              ? { ...review, helpful: result.data.helpful }
              : review
          )
        );
      }
    } catch (err) {
      console.error('Failed to mark as helpful:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return '刚刚';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} 小时前`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)} 天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className={className}>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={`loading-${index}`} className="p-4">
              <div className="animate-pulse">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className={className}>
        <Card className="p-6 text-center">
          <div className="text-red-600 dark:text-red-400 mb-2">
            加载失败
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </div>
          <Button onClick={() => loadReviews(1)} variant="outline" size="sm">
            重试
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 排序选项 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          用户评价 ({reviews.length > 0 ? '有评价' : '暂无评价'})
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">排序:</span>
          <select
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [newSortBy, newOrder] = e.target.value.split('-') as [typeof sortBy, typeof order];
              setSortBy(newSortBy);
              setOrder(newOrder);
            }}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="createdAt-desc">最新</option>
            <option value="createdAt-asc">最早</option>
            <option value="rating-desc">评分高到低</option>
            <option value="rating-asc">评分低到高</option>
            <option value="helpful-desc">最有用</option>
          </select>
        </div>
      </div>

      {/* 评价列表 */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="flex items-start space-x-3">
              {/* 用户头像 */}
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                {review.user?.avatar ? (
                  <img 
                    src={review.user.avatar} 
                    alt={review.user?.name || review.author || '用户'} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    {(review.user?.name || review.author || '用户').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex-1">
                {/* 用户信息和评分 */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {review.user?.name || review.author || '匿名用户'}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < review.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  {/* 工具信息 */}
                  {showToolInfo && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{review.tool.icon}</span>
                      <span>{review.tool.name}</span>
                    </div>
                  )}
                </div>

                {/* 评论内容 */}
                {review.comment && (
                  <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                    {review.comment}
                  </p>
                )}

                {/* 操作按钮 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleHelpful(review.id)}
                      className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>👍</span>
                      <span>有用 ({review.helpful})</span>
                    </button>
                  </div>
                  
                  {review.createdAt !== review.updatedAt && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      已编辑
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 加载更多 */}
      {hasMore && (
        <div className="text-center mt-6">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? '加载中...' : '加载更多'}
          </Button>
        </div>
      )}

      {/* 空状态 */}
      {reviews.length === 0 && !isLoading && (
        <Card className="p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">💬</div>
            <div>暂无评价</div>
            <div className="text-sm mt-1">成为第一个评价的用户</div>
          </div>
        </Card>
      )}
    </div>
  );
}