import { Metadata } from 'next';
import { generateSearchMetadata } from '@/lib/seo';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }> | undefined;
}): Promise<Metadata> {
  const params = await searchParams;
  const q = params?.q;
  return generateSearchMetadata(q);
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}