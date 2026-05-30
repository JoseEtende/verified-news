'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('vn_onboarded');
    if (hasOnboarded) {
      router.replace('/dashboard/feed');
    } else {
      router.replace('/splash');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="animate-pulse text-[var(--color-muted)] text-sm">Loading...</div>
    </div>
  );
}
