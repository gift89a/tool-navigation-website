'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { SearchBar } from '@/components/tools/search-bar';
import { useAppStore } from '@/store/app-store';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const router = useRouter();
  const { theme, locale, setTheme, initializeLocale } = useAppStore();
  const { t } = useTranslations();

  // 初始化语言设置
  useEffect(() => {
    initializeLocale();
  }, [initializeLocale]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl">🛠️</div>
            <span className="text-xl font-bold">
              {locale === 'zh' ? '工具导航' : 'Tool Navigator'}
            </span>
          </Link>

          {/* 搜索栏 */}
          <div className="flex-1 max-w-2xl mx-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder={t('search.placeholder')}
            />
          </div>

          {/* 右侧按钮 */}
          <div className="flex items-center space-x-2">
            {/* 主题切换 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              className="h-9 w-9"
              title={t('theme.toggle')}
            >
              <span className="text-lg">
                {theme === 'light' ? '🌙' : '☀️'}
              </span>
            </Button>

            {/* 语言切换 */}
            <LanguageSwitcher />

            {/* 收藏夹 */}
            <Link href="/favorites">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                title={t('nav.favorites')}
              >
                <span className="text-lg">⭐</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}