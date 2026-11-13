import type { Metadata } from 'next';
import { CommunityTopNav, CommunityBottomNav } from '@/components/community/community-nav';

// The community is no longer linked from the rest of SOHAM. Its pages still
// work for existing links, but they are kept out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <CommunityTopNav />
      <main className="pb-20 md:pb-8">
        {children}
      </main>
      <CommunityBottomNav />
    </div>
  );
}
