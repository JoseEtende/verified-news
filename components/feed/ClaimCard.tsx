'use client';

import { BadgeShield } from '@/components/badge/BadgeShield';
import ConfidenceMeter from '@/components/badge/ConfidenceMeter';
import Link from 'next/link';
import { Claim } from '@/lib/types';

interface ClaimCardProps {
  claim: Claim;
}

export default function ClaimCard({ claim }: ClaimCardProps) {
  const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Link href={`/verify/${claim.id}`} className="group block">
      <div className="bg-white rounded-xl border border-[var(--color-border)] 
                     hover:border-[var(--color-primary)] hover:shadow-md transition-all cursor-pointer p-4">
        <div className="flex items-center space-x-4">
          {claim.verification && (
            <BadgeShield 
              badge={claim.verification.badge} 
              confidence={claim.verification.confidence_score} 
              size="sm" 
            />
          )}
          
          <div className="flex-1 min-w-0">
            <p className="line-clamp-2 text-sm font-medium text-[var(--color-text)]">
              {claim.extracted_claim || claim.input_content}
            </p>
            <p className="text-xs font-mono text-[var(--color-muted)] mt-1">
              {timeAgo(claim.created_at)}
            </p>
          </div>
          
          {claim.verification && (
            <div className="flex-shrink-0 text-right space-y-1">
              <p className="text-lg font-mono font-semibold text-[var(--color-text)]">
                {claim.verification.confidence_score.toFixed(2)}
              </p>
              <ConfidenceMeter 
                confidence={claim.verification.confidence_score}
                badge={claim.verification.badge}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
