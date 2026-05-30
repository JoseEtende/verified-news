'use client';

import { useState } from 'react';

interface FeedFiltersProps {
  onFilterChange?: (filters: { badge: string; category: string }) => void;
}

export default function FeedFilters({ onFilterChange }: FeedFiltersProps) {
  const [activeBadge, setActiveBadge] = useState('all');

  const badges = [
    { value: 'all', label: 'All' },
    { value: 'blue', label: 'Verified' },
    { value: 'green', label: 'Confirmed' },
    { value: 'yellow', label: 'Partially True' },
    { value: 'orange', label: 'Misleading' },
    { value: 'red', label: 'False' },
    { value: 'gray', label: 'Unverifiable' },
  ];

  const handleBadgeClick = (badge: string) => {
    setActiveBadge(badge);
    onFilterChange?.({ badge, category: 'all' });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((b) => (
        <button
          key={b.value}
          onClick={() => handleBadgeClick(b.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            activeBadge === b.value 
              ? 'bg-[var(--color-primary)] text-white' 
              : 'bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
          }`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}
