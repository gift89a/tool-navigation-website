import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { generateHomeMetadata, generateWebsiteStructuredData } from '@/lib/seo';
import { LocaleProvider } from '@/components/providers/locale-provider';
import { ServiceWorkerProvider, OfflineIndicator, CacheStatus } from '@/components/providers/service-worker-provider';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = generateHomeMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteStructuredData = generateWebsiteStructuredData();

  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceWorkerProvider>
          <LocaleProvider>
            {children}
            <OfflineIndicator />
            <CacheStatus />
          </LocaleProvider>
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
