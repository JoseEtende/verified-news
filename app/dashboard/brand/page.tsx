'use client';

import DashboardSidebar from '@/components/layout/DashboardSidebar';
import ShareOfVoicePie from '@/components/dashboard/ShareOfVoicePie';
import BrandMentionDetail from '@/components/dashboard/BrandMentionDetail';
import VerifyModal from '@/components/verification/VerifyModal';
import { BadgeColor } from '@/lib/types';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { useState } from 'react';

const MOCK_BRAND_MENTIONS = [
  { id: 'b1', claim: 'Company launches new sustainable product line', badge: 'blue' as BadgeColor, confidence: 0.91, category: 'Sustainability', timeAgo: '3h ago' },
  { id: 'b2', claim: 'Competitor X is the only SOC 2 certified vendor in this space', badge: 'red' as BadgeColor, confidence: 0.89, category: 'Compliance', timeAgo: '6h ago' },
  { id: 'b3', claim: 'Partnership announcement with major retailer', badge: 'green' as BadgeColor, confidence: 0.85, category: 'Partnerships', timeAgo: '12h ago' },
  { id: 'b4', claim: 'Quarterly earnings exceed analyst expectations', badge: 'yellow' as BadgeColor, confidence: 0.72, category: 'Finance', timeAgo: '1d ago' },
  { id: 'b5', claim: 'Viral post claims company AI trained on customer data without consent', badge: 'orange' as BadgeColor, confidence: 0.68, category: 'Privacy', timeAgo: '2d ago' },
  { id: 'b6', claim: 'New product launch confirmed by official press release', badge: 'green' as BadgeColor, confidence: 0.93, category: 'Product', timeAgo: '3d ago' },
];

const MONTHLY_DATA: Record<string, Record<BadgeColor, number>> = {
  'Jan 2025': { blue: 8, green: 5, yellow: 3, orange: 2, red: 1, gray: 1 },
  'Feb 2025': { blue: 10, green: 7, yellow: 2, orange: 3, red: 1, gray: 0 },
  'Mar 2025': { blue: 6, green: 9, yellow: 4, orange: 1, red: 2, gray: 1 },
  'Apr 2025': { blue: 12, green: 6, yellow: 3, orange: 2, red: 0, gray: 1 },
  'May 2025': { blue: 9, green: 8, yellow: 5, orange: 3, red: 2, gray: 0 },
  'Jun 2025': { blue: 11, green: 10, yellow: 4, orange: 2, red: 1, gray: 1 },
};

const QUARTERLY_DATA: Record<string, Record<BadgeColor, number>> = {
  'Q1 2025': { blue: 24, green: 21, yellow: 9, orange: 6, red: 4, gray: 2 },
  'Q2 2025': { blue: 32, green: 24, yellow: 12, orange: 7, red: 3, gray: 2 },
};

const YEARLY_DATA: Record<string, Record<BadgeColor, number>> = {
  '2024': { blue: 85, green: 62, yellow: 35, orange: 22, red: 15, gray: 8 },
  '2025': { blue: 56, green: 45, yellow: 21, orange: 13, red: 7, gray: 4 },
};

const BADGE_HEX: Record<string, string> = {
  blue: '#3B82F6', green: '#22C55E', yellow: '#EAB308', orange: '#F97316', red: '#EF4444', gray: '#94A3B8',
};

export default function BrandIntel() {
  const [verifyModal, setVerifyModal] = useState(false);
  const [selectedMention, setSelectedMention] = useState<typeof MOCK_BRAND_MENTIONS[0] | null>(null);
  const [timePeriod, setTimePeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  const pieData = timePeriod === 'monthly' ? MONTHLY_DATA : timePeriod === 'quarterly' ? QUARTERLY_DATA : YEARLY_DATA;
  const pieEntries = Object.entries(pieData);

  return (
    <>
      <DashboardSidebar activeItem="brand" />
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
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

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Mentions', value: MOCK_BRAND_MENTIONS.length, icon: BarChart3, color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary-light)]' },
            { label: 'Verified', value: MOCK_BRAND_MENTIONS.filter(b => b.badge === 'blue').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Misleading/False', value: MOCK_BRAND_MENTIONS.filter(b => b.badge === 'orange' || b.badge === 'red').length, icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Confirmed', value: MOCK_BRAND_MENTIONS.filter(b => b.badge === 'green').length, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
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

        {/* Pie Charts + Time Selector */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 card p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Share of Voice</h3>
            {timePeriod === 'monthly' ? (
              <div className="grid grid-cols-3 gap-4">
                {pieEntries.map(([period, data]) => (
                  <div key={period}>
                    <p className="text-xs font-medium text-[var(--color-muted)] text-center mb-2">{period}</p>
                    <ShareOfVoicePie data={data} />
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid ${timePeriod === 'quarterly' ? 'grid-cols-2' : 'grid-cols-2'} gap-4`}>
                {pieEntries.map(([period, data]) => (
                  <div key={period}>
                    <p className="text-xs font-medium text-[var(--color-muted)] text-center mb-2">{period}</p>
                    <ShareOfVoicePie data={data} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Time Period Selector */}
          <div className="w-[120px] flex-shrink-0">
            <div className="card p-3">
              <p className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3 text-center">Period</p>
              <div className="space-y-2">
                {(['monthly', 'quarterly', 'yearly'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setTimePeriod(p)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                      timePeriod === p
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Brand Mentions */}
        <div className="card">
          <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Brand Mentions</h3>
            <span className="text-xs text-[var(--color-muted)]">{MOCK_BRAND_MENTIONS.length} total</span>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
            {MOCK_BRAND_MENTIONS.map((m) => (
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
                    {m.badge === 'blue' ? 'VRF' : m.badge === 'green' ? 'CFM' : m.badge === 'yellow' ? 'PTR' : m.badge === 'orange' ? 'MIS' : m.badge === 'red' ? 'FLS' : 'UNV'}
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
            ))}
          </div>
        </div>
      </div>

      <VerifyModal isOpen={verifyModal} onClose={() => setVerifyModal(false)} />
      <BrandMentionDetail mention={selectedMention} onClose={() => setSelectedMention(null)} />
    </>
  );
}
