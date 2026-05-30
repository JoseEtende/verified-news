'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasOnboarded = localStorage.getItem('vn_onboarded');
      if (hasOnboarded) {
        router.replace('/');
      } else {
        router.replace('/onboarding');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center">
      <div className="text-center">
        <svg viewBox="0 0 100 100" width="80" height="80" className="mx-auto mb-6 animate-pulse">
          <path
            d="M 50 5 L 90 20 L 90 55 Q 90 85 50 95 Q 10 85 10 55 L 10 20 Z"
            fill="white"
          />
        </svg>
        <h1 className="text-2xl font-bold text-white">Verified News</h1>
        <p className="text-white/70 text-sm mt-2">Truth, verified by AI</p>
      </div>
    </div>
  );
}
