'use client';

import DashboardSidebar from '@/components/layout/DashboardSidebar';
import ShareOfVoicePie from '@/components/dashboard/ShareOfVoicePie';
import VerifyModal from '@/components/verification/VerifyModal';
import ThreatDetail from '@/components/dashboard/ThreatDetail';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BadgeColor } from '@/lib/types';

const MOCK_PIE_DATA: Record<BadgeColor, number> = {
  blue: 11, green: 8, yellow: 4, orange: 3, red: 2, gray: 1,
};

const MOCK_RECENT = [
  { id: 'r1', claim: 'Acme Corp has recalled its Model X battery', badge: 'red' as BadgeColor, confidence: 0.94, timeAgo: '2h ago', sourcesCount: 5 },
  { id: 'r2', claim: 'Company launches new sustainable product line', badge: 'blue' as BadgeColor, confidence: 0.91, timeAgo: '3h ago', sourcesCount: 4 },
  { id: 'r3', claim: 'Competitor X is the only SOC 2 certified vendor', badge: 'red' as BadgeColor, confidence: 0.89, timeAgo: '6h ago', sourcesCount: 3 },
  { id: 'r4', claim: 'Quarterly earnings exceed analyst expectations', badge: 'yellow' as BadgeColor, confidence: 0.72, timeAgo: '1d ago', sourcesCount: 4 },
  { id: 'r5', claim: 'Partnership announcement with major retailer', badge: 'green' as BadgeColor, confidence: 0.85, timeAgo: '2d ago', sourcesCount: 2 },
];

const MOCK_TOP_VERIFIED = [
  { name: 'Reuters', count: 12, accuracy: '98%' },
  { name: 'AP News', count: 8, accuracy: '96%' },
  { name: 'BBC', count: 6, accuracy: '94%' },
];

const BADGE_HEX: Record<string, string> = {
  blue: '#3B82F6', green: '#22C55E', yellow: '#EAB308', orange: '#F97316', red: '#EF4444', gray: '#94A3B8',
};

export default function OverviewPage() {
  const [verifyModal, setVerifyModal] = useState(false);
  const [selectedRecent, setSelectedRecent] = useState<typeof MOCK_RECENT[0] | null>(null);
  const router = useRouter();

  return (
    <>
      <DashboardSidebar activeItem="overview" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">Dashboard</h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">Overview of your verification activity</p>
          </div>
          <button onClick={() => setVerifyModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Verify a Claim
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Claims', value: '42', change: '+12%', icon: Shield, color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary-light)]' },
            { label: 'Verified', value: '11', change: '+8%', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Misleading/False', value: '4', change: '+2%', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Avg Confidence', value: '78%', change: '+5%', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{s.change}</span>
                </div>
                <p className="text-2xl font-bold text-[var(--color-text)]">{s.value}</p>
                <p className="text-xs text-[var(--color-muted)] mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Pie Chart + Recent */}
        <div className="grid grid-cols-[1fr_380px] gap-4 mb-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Share of Voice</h3>
              <span className="text-xs text-[var(--color-muted)]">All time</span>
            </div>
            <ShareOfVoicePie data={MOCK_PIE_DATA} />
          </div>

          <div className="card">
            <div className="px-5 py-4 border-b border-[var(--color-border)]">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Recent Activity</h3>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {MOCK_RECENT.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedRecent(item)}
                  className="px-5 py-3 flex items-center gap-3 hover:bg-[var(--color-bg)]/50 transition-colors cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: BADGE_HEX[item.badge] }}></span>
                  <p className="text-sm text-[var(--color-text)] flex-1 line-clamp-1">{item.claim}</p>
                  <span className="text-[10px] font-mono text-[var(--color-muted)] flex-shrink-0">{item.timeAgo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-[1fr_380px] gap-4">
          <div className="card">
            <div className="px-5 py-4 border-b border-[var(--color-border)]">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Top Verified Sources</h3>
            </div>
            <div className="p-5">
              <div className="space-y-3">
                {MOCK_TOP_VERIFIED.map((source, i) => (
                  <div key={source.name} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[var(--color-muted)] w-4">{i + 1}</span>
                    <div className="w-8 h-8 bg-[var(--color-bg)] rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-[var(--color-text)]">{source.name[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--color-text)]">{source.name}</p>
                      <p className="text-[10px] text-[var(--color-muted)]">{source.count} claims verified</p>
                    </div>
                    <span className="text-xs font-mono font-semibold text-green-600">{source.accuracy}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button onClick={() => setVerifyModal(true)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-bg)] transition-colors text-left cursor-pointer">
                <div className="w-9 h-9 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Verify a Claim</p>
                  <p className="text-[10px] text-[var(--color-muted)]">Paste URL, text, or topic</p>
                </div>
              </button>
              <button onClick={() => router.push('/dashboard/threat')} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-bg)] transition-colors text-left cursor-pointer">
                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">View Threats</p>
                  <p className="text-[10px] text-[var(--color-muted)]">Check active threats</p>
                </div>
              </button>
              <button onClick={() => router.push('/dashboard/brand')} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-bg)] transition-colors text-left cursor-pointer">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Brand Intelligence</p>
                  <p className="text-[10px] text-[var(--color-muted)]">Monitor brand mentions</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <VerifyModal isOpen={verifyModal} onClose={() => setVerifyModal(false)} />
      <ThreatDetail threat={selectedRecent} onClose={() => setSelectedRecent(null)} />
    </>
  );
}
