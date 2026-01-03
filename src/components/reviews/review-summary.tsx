'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

interface ReviewSummaryProps {
  toolId: string;
  className?: string;
}

export function ReviewSummary({ toolId, className }: ReviewSummaryProps) {
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, [toolId]);

  const loadSummary = async () => {
    try {
      setIsLoading(true);
      
      // 获取该工具的所有评价
      const response = await fetch(`/api/reviews?toolId=${toolId}&limit=1000`);
      const result = await response.json();

      if (result.success) {
        const reviews = result.data;
        const totalReviews = reviews.length;
        
        if (totalReviews === 0) {
          setSummary({
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          });
          return;
        }

        // 计算平均评分
        const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
        const averageRating = totalRating / totalReviews;

        // 计算评分分布
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach((review: any) => {
          ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
        });

        setSummary({
          totalReviews,
          averageRating,
          ratingDistribution,
        });
      }
    } catch (error) {
      console.error('Failed to load review summary:', error);
      setSummary({
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-12 w-12 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="h-3 bg-gray-200 rounded w-8"></div>
                <div className="h-2 bg-gray-200 rounded flex-1"></div>
                <div className="h-3 bg-gray-200 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!summary) {
    return null;
  }

  const getPercentage = (count: number) => {
    return summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
  };

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        用户评价
      </h3>

      {summary.totalReviews === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">⭐</div>
            <div>暂无评价</div>
            <div className="text-sm mt-1">成为第一个评价的用户</div>
          </div>
        </div>
      ) : (
        <>
          {/* 总体评分 */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {summary.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(summary.averageRating)
                        ? 'text-yellow-400'
                        : i < summary.averageRating
                        ? 'text-yellow-300'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {summary.totalReviews} 个评价
              </div>
            </div>

            {/* 评分分布 */}
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = summary.ratingDistribution[rating];
                const percentage = getPercentage(count);
                
                return (
                  <div key={rating} className="flex items-center space-x-2 mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-6">
                      {rating}★
                    </span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 评价统计 */}
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {Math.round(getPercentage(summary.ratingDistribution[5] + summary.ratingDistribution[4]))}%
              </div>
              <div className="text-gray-600 dark:text-gray-400">好评率</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {summary.ratingDistribution[5]}
              </div>
              <div className="text-gray-600 dark:text-gray-400">五星评价</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {summary.totalReviews}
              </div>
              <div className="text-gray-600 dark:text-gray-400">总评价数</div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}