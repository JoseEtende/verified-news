'use client';

import DashboardSidebar from '@/components/layout/DashboardSidebar';
import ShareOfVoicePie from '@/components/dashboard/ShareOfVoicePie';
import BrandMentionDetail from '@/components/dashboard/BrandMentionDetail';
import VerifyModal from '@/components/verification/VerifyModal';
import { useFeed } from '@/hooks/useVerification';
import { BadgeColor } from '@/lib/types';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { useState } from 'react';

const BADGE_HEX: Record<string, string> = {
  blue: '#3B82F6', green: '#22C55E', yellow: '#EAB308', orange: '#F97316', red: '#EF4444', gray: '#94A3B8',
};

const BADGE_SHORT: Record<string, string> = {
  blue: 'VRF', green: 'CFM', yellow: 'PTR', orange: 'MIS', red: 'FLS', gray: 'UNV',
};

export default function BrandIntel() {
  const { claims, loading } = useFeed('track1_gtm');
  const [verifyModal, setVerifyModal] = useState(false);
  const [selectedMention, setSelectedMention] = useState<any | null>(null);

  const mentions = claims.map(c => ({
    id: c.id,
    claim: c.extracted_claim || c.input_content,
    badge: ((c as any).verifications?.badge || 'gray') as BadgeColor,
    confidence: (c as any).verifications?.confidence_score || 0,
    category: c.category || 'General',
    timeAgo: new Date(c.created_at).toLocaleDateString(),
  }));

  const verifiedCount = mentions.filter(m => m.badge === 'blue').length;
  const misleadingCount = mentions.filter(m => m.badge === 'orange' || m.badge === 'red').length;
  const confirmedCount = mentions.filter(m => m.badge === 'green').length;

  return (
    <>
      <DashboardSidebar activeItem="brand" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">Brand Intelligence</h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">Monitor brand mentions and narrative accuracy</p>
          </div>
          <button onClick={() => setVerifyModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Verify Brand Claim
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Mentions', value: mentions.length, icon: BarChart3, color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary-light)]' },
            { label: 'Verified', value: verifiedCount, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Misleading/False', value: misleadingCount, icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Confirmed', value: confirmedCount, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[var(--color-text)]">{s.value}</p>
                    <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">{s.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Brand Mentions</h3>
            <span className="text-xs text-[var(--color-muted)]">{mentions.length} total</span>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)
            ) : mentions.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-[var(--color-muted)] text-sm">
                No brand mentions yet
              </div>
            ) : (
              mentions.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMention(m)}
                  className="flex items-start gap-3 p-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${BADGE_HEX[m.badge]}15` }}
                  >
                    <span className="text-xs font-mono font-bold" style={{ color: BADGE_HEX[m.badge] }}>
                      {BADGE_SHORT[m.badge]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)] line-clamp-2">{m.claim}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-bg)] text-[var(--color-text-secondary)]">{m.category}</span>
                      <span className="text-[10px] font-mono text-[var(--color-muted)]">{m.timeAgo}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-mono font-semibold text-[var(--color-text)]">{(m.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <VerifyModal isOpen={verifyModal} onClose={() => setVerifyModal(false)} />
      <BrandMentionDetail mention={selectedMention} onClose={() => setSelectedMention(null)} />
    </>
  );
}
