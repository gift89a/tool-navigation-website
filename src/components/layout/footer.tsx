import React from 'react';
import Link from 'next/link';
import { FooterAd } from '@/components/ads/ad-slot';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn(
      'border-t bg-background',
      className
    )}>
      <div className="container mx-auto px-4 py-8">
        {/* Footer Ad */}
        <FooterAd className="mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🛠️</div>
              <span className="text-xl font-bold">工具导航</span>
            </div>
            <p className="text-sm text-muted-foreground">
              一个现代化的在线工具导航平台，提供各类实用工具的分类导航和在线使用功能。
            </p>
          </div>

          {/* 工具分类 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">工具分类</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/text-processing" className="text-muted-foreground hover:text-foreground transition-colors">
                  文本处理
                </Link>
              </li>
              <li>
                <Link href="/category/image-processing" className="text-muted-foreground hover:text-foreground transition-colors">
                  图片处理
                </Link>
              </li>
              <li>
                <Link href="/category/development-tools" className="text-muted-foreground hover:text-foreground transition-colors">
                  开发工具
                </Link>
              </li>
              <li>
                <Link href="/category/conversion-tools" className="text-muted-foreground hover:text-foreground transition-colors">
                  转换工具
                </Link>
              </li>
            </ul>
          </div>

          {/* 快速链接 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
                  我的收藏
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  联系我们
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  隐私政策
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系信息 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">联系我们</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>邮箱: contact@toolnav.com</li>
              <li>QQ群: 123456789</li>
              <li>微信: toolnav</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} 工具导航. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground transition-colors">
                服务条款
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                隐私政策
              </Link>
              <Link href="/sitemap" className="hover:text-foreground transition-colors">
                网站地图
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}