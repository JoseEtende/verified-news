'use client';

import { useState } from 'react';
import { Source } from '@/lib/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface EvidenceTreeProps {
  sources: Source[];
}

const CREDIBILITY_COLORS: Record<string, string> = {
  high: '#0891B2',
  medium: '#EAB308',
  low: '#F97316',
  unverified: '#94A3B8',
};

const TOOL_BADGES: Record<string, string> = {
  SERP: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  SCRAPER: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  UNLOCKER: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  BROWSER: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  ACADEMIC_SCRAPER: 'bg-blue-50 text-blue-700 border-blue-200',
  OFFICIAL_DATA_FEED: 'bg-green-50 text-green-700 border-green-200',
  NEWS_SCRAPER: 'bg-purple-50 text-purple-700 border-purple-200',
  SOCIAL_SCRAPER: 'bg-orange-50 text-orange-700 border-orange-200',
  REGULATORY_FEED: 'bg-slate-50 text-slate-700 border-slate-200',
  COMPETITIVE_MONITOR: 'bg-red-50 text-red-700 border-red-200',
};

export default function EvidenceTree({ sources }: EvidenceTreeProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (sources.length === 0) {
    return <p className="text-[var(--color-muted)] text-center py-6 text-sm">No sources available</p>;
  }

  const grouped = sources.reduce((acc, s) => {
    (acc[s.credibility_tier] ||= []).push(s);
    return acc;
  }, {} as Record<string, Source[]>);

  const tierOrder = ['high', 'medium', 'low', 'unverified'];
  const orderedTiers = tierOrder.filter(t => grouped[t]);

  return (
    <div className="space-y-4">
      {orderedTiers.map((tier) => (
        <div key={tier}>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
            {tier} credibility ({grouped[tier].length})
          </h4>
          <div className="space-y-2">
            {grouped[tier].map((source) => (
              <div key={source.id} className="bg-white border border-[var(--color-border)] rounded-lg p-3 hover:border-[var(--color-primary)]/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                        style={{ backgroundColor: `${CREDIBILITY_COLORS[tier]}15`, color: CREDIBILITY_COLORS[tier] }}
                      >
                        {tier}
                      </span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${TOOL_BADGES[source.bright_data_tool_used] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {source.bright_data_tool_used}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">{source.title}</p>
                    <p className="text-xs text-[var(--color-muted)] font-mono">{source.domain}</p>
                  </div>
                  <span className="text-xs font-mono text-[var(--color-muted)] ml-2 flex-shrink-0">
                    {source.relevance_score.toFixed(2)}
                  </span>
                </div>
                
                <button
                  className="mt-2 flex items-center gap-1 text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === source.id ? null : source.id)}
                >
                  {expandedId === source.id ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  <span>{expandedId === source.id ? 'Hide' : 'Show'} snippet</span>
                </button>
                {expandedId === source.id && (
                  <p className="mt-2 text-xs text-[var(--color-text-secondary)] italic pl-4 border-l-2 border-[var(--color-border)]">
                    {source.extracted_snippet}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
