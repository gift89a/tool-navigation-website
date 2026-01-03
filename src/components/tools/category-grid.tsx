'use client';

import React from 'react';
import { CategoryCard } from './category-card';
import type { Category } from '@/types';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory?: string | null;
  onCategorySelect?: (categoryId: string) => void;
  className?: string;
}

export function CategoryGrid({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  className 
}: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📂</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          暂无分类
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          还没有添加任何工具分类
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={onCategorySelect}
          />
        ))}
      </div>
    </div>
  );
}