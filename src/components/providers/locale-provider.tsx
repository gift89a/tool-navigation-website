'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';

/**
 * 语言初始化提供者
 * 在应用启动时自动检测和设置用户语言偏好
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const initializeLocale = useAppStore((state) => state.initializeLocale);

  useEffect(() => {
    // 在客户端初始化语言设置
    initializeLocale();
  }, [initializeLocale]);

  return <>{children}</>;
}