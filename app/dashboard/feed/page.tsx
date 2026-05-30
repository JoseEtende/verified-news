'use client';

import DashboardSidebar from '@/components/layout/DashboardSidebar';
import ClaimCard from '@/components/feed/ClaimCard';
import VerifyModal from '@/components/verification/VerifyModal';
import { BadgeColor } from '@/lib/types';
import { useFeed } from '@/hooks/useVerification';
import { useState } from 'react';
import { Shield } from 'lucide-react';

const FILTERS: { value: 'all' | BadgeColor; label: string; color: string; activeColor: string }[] = [
  { value: 'all', label: 'All', color: 'border-[var(--color-border)] text-[var(--color-text-secondary)]', activeColor: 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' },
  { value: 'blue', label: 'Verified', color: 'border-blue-200 text-blue-600 bg-blue-50', activeColor: 'bg-blue-500 text-white border-blue-500' },
  { value: 'green', label: 'Confirmed', color: 'border-green-200 text-green-600 bg-green-50', activeColor: 'bg-green-500 text-white border-green-500' },
  { value: 'yellow', label: 'Partially True', color: 'border-yellow-200 text-yellow-600 bg-yellow-50', activeColor: 'bg-yellow-500 text-white border-yellow-500' },
  { value: 'orange', label: 'Misleading', color: 'border-orange-200 text-orange-600 bg-orange-50', activeColor: 'bg-orange-500 text-white border-orange-500' },
  { value: 'red', label: 'False', color: 'border-red-200 text-red-600 bg-red-50', activeColor: 'bg-red-500 text-white border-red-500' },
  { value: 'gray', label: 'Unverifiable', color: 'border-gray-200 text-gray-600 bg-gray-50', activeColor: 'bg-gray-500 text-white border-gray-500' },
];

export default function FeedPage() {
  const { claims, loading } = useFeed();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | BadgeColor>('all');

  const filteredClaims = activeFilter === 'all'
    ? claims
    : claims.filter(c => (c as any).verifications?.badge === activeFilter);

  return (
    <>
      <DashboardSidebar activeItem="feed" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="card p-8 mb-6 text-center bg-gradient-to-br from-[var(--color-primary-light)] to-white">
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
            Is it true?
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            AI agents verify news claims against live web data.
          </p>
          <button
            onClick={() => setModalIsOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Verify a claim
          </button>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              { label: 'Verified', color: 'bg-blue-500' },
              { label: 'Confirmed', color: 'bg-green-500' },
              { label: 'Partially True', color: 'bg-yellow-500' },
              { label: 'Misleading', color: 'bg-orange-500' },
              { label: 'False', color: 'bg-red-500' },
              { label: 'Unverifiable', color: 'bg-gray-400' },
            ].map((b) => (
              <span key={b.label} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                <span className={`w-2 h-2 rounded-full ${b.color}`}></span>
                {b.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                activeFilter === f.value ? f.activeColor : f.color
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredClaims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        )}

        {!loading && filteredClaims.length === 0 && (
          <div className="text-center py-12 text-[var(--color-muted)]">
            No claims match this filter
          </div>
        )}

        <div className="text-center mt-8">
          <button className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors cursor-pointer">
            Load more
          </button>
        </div>
      </div>

      <VerifyModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
    </>
  );
}
