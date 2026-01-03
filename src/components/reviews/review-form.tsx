'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReviewFormProps {
  toolId: string;
  userId?: string;
  existingReview?: {
    id: string;
    rating: number;
    comment?: string;
  };
  onSubmit?: (review: any) => void;
  onCancel?: () => void;
}

export function ReviewForm({ 
  toolId, 
  userId, 
  existingReview, 
  onSubmit, 
  onCancel 
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setError('请先登录后再评价');
      return;
    }

    if (rating === 0) {
      setError('请选择评分');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const url = existingReview 
        ? `/api/reviews/${existingReview.id}`
        : '/api/reviews';
      
      const method = existingReview ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolId,
          userId,
          rating,
          comment: comment.trim() || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSubmit?.(result.data);
      } else {
        setError(result.error || '提交失败');
      }
    } catch (err) {
      setError('网络错误，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {existingReview ? '编辑评价' : '写评价'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 评分选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            评分 *
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${
                  star <= rating
                    ? 'text-yellow-400 hover:text-yellow-500'
                    : 'text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-500'
                }`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {rating > 0 && (
                <>
                  {rating} 星
                  {rating === 1 && ' - 很差'}
                  {rating === 2 && ' - 较差'}
                  {rating === 3 && ' - 一般'}
                  {rating === 4 && ' - 不错'}
                  {rating === 5 && ' - 很棒'}
                </>
              )}
            </span>
          </div>
        </div>

        {/* 评论内容 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            评论 (可选)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="分享您的使用体验..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            maxLength={500}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {comment.length}/500 字符
          </div>
        </div>

        {/* 错误信息 */}
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex space-x-3">
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="flex-1"
          >
            {isSubmitting ? '提交中...' : existingReview ? '更新评价' : '提交评价'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              取消
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}