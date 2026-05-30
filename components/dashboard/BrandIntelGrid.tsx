'use client';

import { BADGE_CONFIG, BadgeColor } from '@/lib/types';

interface BrandMention {
  id: string;
  claim: string;
  badge: BadgeColor;
  confidence: number;
  category: string;
  timeAgo: string;
}

interface BrandIntelGridProps {
  mentions: BrandMention[];
}

export default function BrandIntelGrid({ mentions }: BrandIntelGridProps) {
  if (mentions.length === 0) {
    return <div className="text-center py-12 text-[var(--color-muted)]">No brand mentions found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {mentions.map((m) => (
        <div key={m.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--color-bg)]/50 transition-colors cursor-pointer">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${BADGE_CONFIG[m.badge].hex}15` }}
          >
            <span className="text-xs font-mono font-bold" style={{ color: BADGE_CONFIG[m.badge].hex }}>
              {BADGE_CONFIG[m.badge].shortLabel}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--color-text)] line-clamp-2">{m.claim}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-bg)] text-[var(--color-text-secondary)]">
                {m.category}
              </span>
              <span className="text-[10px] font-mono text-[var(--color-muted)]">{m.timeAgo}</span>
            </div>
          </div>
          
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-mono font-semibold text-[var(--color-text)]">
              {(m.confidence * 100).toFixed(0)}%
            </p>
            {(m.badge === 'red' || m.badge === 'orange') && (
              <button className="mt-1 text-[10px] font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors cursor-pointer">
                Export Battlecard
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
