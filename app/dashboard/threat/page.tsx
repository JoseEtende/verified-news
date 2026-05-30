'use client';

import DashboardSidebar from '@/components/layout/DashboardSidebar';
import ThreatTable from '@/components/dashboard/ThreatTable';
import ThreatDetail from '@/components/dashboard/ThreatDetail';
import VerifyModal from '@/components/verification/VerifyModal';
import { useFeed } from '@/hooks/useVerification';
import { useState } from 'react';
import { Shield, AlertTriangle, TrendingUp, Activity, Plus, X } from 'lucide-react';

export default function ThreatMonitor() {
  const { claims, loading } = useFeed('track3_security');
  const [showAddMonitor, setShowAddMonitor] = useState(false);
  const [newQuery, setNewQuery] = useState('');
  const [newFrequency, setNewFrequency] = useState('daily');
  const [selectedThreat, setSelectedThreat] = useState<any | null>(null);

  const threats = claims.map(c => ({
    id: c.id,
    claim: c.extracted_claim || c.input_content,
    badge: (c as any).verifications?.badge || 'gray',
    confidence: (c as any).verifications?.confidence_score || 0,
    sourcesCount: (c as any).verifications?.primary_sources_count || 0,
    timeAgo: new Date(c.created_at).toLocaleDateString(),
  }));

  const redCount = threats.filter(t => t.badge === 'red').length;
  const orangeCount = threats.filter(t => t.badge === 'orange').length;
  const avgConf = threats.length > 0 ? Math.round(threats.reduce((sum, t) => sum + t.confidence, 0) / threats.length * 100) : 0;

  return (
    <>
      <DashboardSidebar activeItem="threats" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
              Threat Monitor
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            </h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">Active threats, monitors, and risk assessment</p>
          </div>
          <button onClick={() => setShowAddMonitor(true)} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Monitor New Threat
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Active Threats', value: threats.length, icon: Shield, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Critical', value: redCount, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Elevated', value: orangeCount, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Avg Confidence', value: `${avgConf}%`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
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

        <div className="card mb-6">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">All Threats</h3>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="p-5 space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-12 rounded" />)}
              </div>
            ) : threats.length === 0 ? (
              <div className="p-8 text-center text-[var(--color-muted)] text-sm">
                No threats detected — all narratives verified
              </div>
            ) : (
              <ThreatTable threats={threats} onThreatClick={setSelectedThreat} />
            )}
          </div>
        </div>
      </div>

      {showAddMonitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowAddMonitor(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl border border-[var(--color-border)] p-6 w-[420px] max-w-[90vw]">
            <button onClick={() => setShowAddMonitor(false)} className="absolute top-4 right-4 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-1">Monitor New Threat</h2>
            <p className="text-sm text-[var(--color-muted)] mb-5">Track a claim or topic for changes</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">What to monitor</label>
                <input type="text" value={newQuery} onChange={(e) => setNewQuery(e.target.value)} placeholder="e.g. Acme Corp, product recall, CEO quote..." className="w-full rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Check frequency</label>
                <div className="flex gap-2">
                  {['hourly', 'daily', 'weekly'].map((f) => (
                    <button key={f} type="button" onClick={() => setNewFrequency(f)} className={`flex-1 py-2 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${newFrequency === f ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'}`}>{f}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowAddMonitor(false)} disabled={!newQuery.trim()} className={`w-full py-2.5 font-medium rounded-lg text-sm transition-colors cursor-pointer ${!newQuery.trim() ? 'bg-gray-100 text-[var(--color-muted)] cursor-not-allowed' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white'}`}>Create Monitor</button>
            </div>
          </div>
        </div>
      )}

      <ThreatDetail threat={selectedThreat} onClose={() => setSelectedThreat(null)} />
    </>
  );
}
