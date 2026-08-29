import PublicMenuView from '@/components/public-menu/PublicMenuView';

// Live data only: render dynamically with no caching so every visit reflects
// the latest backend data (Req 1.3, 11.1, 11.2).
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface PublicMenuPageProps {
  params: Promise<{ publicId: string }>;
}

export default async function PublicMenuPage({ params }: PublicMenuPageProps) {
  const { publicId } = await params;
  return <PublicMenuView publicId={publicId ?? ''} />;
}
