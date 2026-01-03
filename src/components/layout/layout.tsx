import React from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className={cn('flex-1', className)}>
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}