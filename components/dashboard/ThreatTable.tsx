'use client';

import Link from 'next/link';
import { BADGE_CONFIG, BadgeColor } from '@/lib/types';

interface Threat {
  id: string;
  claim: string;
  badge: BadgeColor;
  confidence: number;
  sourcesCount: number;
  timeAgo: string;
}

interface ThreatTableProps {
  threats: Threat[];
  onThreatClick?: (threat: Threat) => void;
}

export default function ThreatTable({ threats, onThreatClick }: ThreatTableProps) {
  if (threats.length === 0) {
    return <div className="text-center py-12 text-[var(--color-muted)]">No threats detected</div>;
  }

  const sorted = [...threats].sort((a, b) => {
    const order: Record<string, number> = { red: 5, orange: 4, yellow: 3, green: 2, blue: 1, gray: 0 };
    return order[b.badge] - order[a.badge];
  });

  const riskLabels: Partial<Record<BadgeColor, string>> = { red: 'CRITICAL', orange: 'ELEVATED', yellow: 'MONITOR' };

  return (
    <table className="w-full text-left">
      <thead className="sticky top-0 bg-white">
        <tr className="border-b border-[var(--color-border)]">
          {['Risk', 'Claim', 'Badge', 'Confidence', 'Sources', 'Time'].map(h => (
            <th key={h} className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[var(--color-border)]">
        {sorted.map((t) => {
          const risk = riskLabels[t.badge];
          return (
            <tr key={t.id} className="hover:bg-[var(--color-bg)]/50 transition-colors cursor-pointer" onClick={() => onThreatClick?.(t)}>
              <td className="px-5 py-3.5">
                {risk && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BADGE_CONFIG[t.badge].hex }}></div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: BADGE_CONFIG[t.badge].hex }}>{risk}</span>
                  </div>
                )}
              </td>
              <td className="px-5 py-3.5 text-sm text-[var(--color-text)] max-w-xs"><p className="line-clamp-2">{t.claim}</p></td>
              <td className="px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BADGE_CONFIG[t.badge].hex }}></span>
                  <span className="text-xs font-mono font-medium" style={{ color: BADGE_CONFIG[t.badge].hex }}>{BADGE_CONFIG[t.badge].shortLabel}</span>
                </span>
              </td>
              <td className="px-5 py-3.5 text-sm font-mono font-semibold text-[var(--color-text)]">{(t.confidence * 100).toFixed(0)}%</td>
              <td className="px-5 py-3.5 text-sm font-mono text-[var(--color-text-secondary)]">{t.sourcesCount}</td>
              <td className="px-5 py-3.5 text-xs font-mono text-[var(--color-muted)]">{t.timeAgo}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
