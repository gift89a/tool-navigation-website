'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onClick?: (categoryId: string) => void;
  className?: string;
}

export function CategoryCard({ 
  category, 
  isSelected = false, 
  onClick, 
  className 
}: CategoryCardProps) {
  const handleClick = () => {
    onClick?.(category.id);
  };

  if (onClick) {
    return (
      <div onClick={handleClick} role="button" tabIndex={0} className="cursor-pointer">
        <Card className={cn(
          'group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
          isSelected && 'ring-2 ring-primary ring-offset-2',
          className
        )}>
          <div 
            className="absolute inset-0 opacity-10"
            style={{ backgroundColor: category.color }}
          />
          <CardHeader className="relative pb-3">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${category.color}20` }}
              >
                {category.icon}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold truncate">
                  {category.name}
                </CardTitle>
                {category.toolCount !== undefined && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {category.toolCount} 个工具
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative pt-0">
            <CardDescription className="text-sm text-muted-foreground line-clamp-2">
              {category.description}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Link href={`/category/${category.slug}`}>
      <Card className={cn(
        'group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        className
      )}>
        <div 
          className="absolute inset-0 opacity-10"
          style={{ backgroundColor: category.color }}
        />
        <CardHeader className="relative pb-3">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${category.color}20` }}
            >
              {category.icon}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {category.name}
              </CardTitle>
              {category.toolCount !== undefined && (
                <div className="text-sm text-muted-foreground mt-1">
                  {category.toolCount} 个工具
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative pt-0">
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
            {category.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}