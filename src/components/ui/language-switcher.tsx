'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import { useTranslations } from '@/hooks/use-translations';
import { SUPPORTED_LOCALES, LOCALE_NAMES, type SupportedLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'button' | 'dropdown';
}

export function LanguageSwitcher({ className, variant = 'button' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useAppStore();
  const { t } = useTranslations();

  const handleLanguageChange = (newLocale: SupportedLocale) => {
    if (newLocale !== locale) {
      setLocale(newLocale, true);
    }
  };

  if (variant === 'button') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleLanguageChange(locale === 'zh' ? 'en' : 'zh')}
        className={cn('h-9 px-3', className)}
        title={t('language.toggle')}
      >
        {locale === 'zh' ? 'EN' : '中文'}
      </Button>
    );
  }

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {SUPPORTED_LOCALES.map((supportedLocale) => (
        <Button
          key={supportedLocale}
          variant={locale === supportedLocale ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleLanguageChange(supportedLocale)}
          className="h-8 px-2 text-xs"
        >
          {LOCALE_NAMES[supportedLocale]}
        </Button>
      ))}
    </div>
  );
}