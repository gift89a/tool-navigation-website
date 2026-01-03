import { Metadata } from 'next';
import { generateFavoritesMetadata } from '@/lib/seo';

export const metadata: Metadata = generateFavoritesMetadata();

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}