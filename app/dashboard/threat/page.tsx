'use client';

import DashboardSidebar from '@/components/layout/DashboardSidebar';
import ThreatTable from '@/components/dashboard/ThreatTable';
import ThreatDetail from '@/components/dashboard/ThreatDetail';
import VerifyModal from '@/components/verification/VerifyModal';
import { BadgeColor } from '@/lib/types';
import { useState } from 'react';
import { Shield, AlertTriangle, TrendingUp, Activity, Plus, X } from 'lucide-react';

const MOCK_THREATS = [
  { id: 't1', claim: 'Acme Corp has recalled its Model X battery due to fire hazards - spreading on Reddit', badge: 'red' as BadgeColor, confidence: 0.94, sourcesCount: 5, timeAgo: '2h ago' },
  { id: 't2', claim: 'CEO stated in leaked email that Q3 earnings will miss by 40%', badge: 'red' as BadgeColor, confidence: 0.91, sourcesCount: 4, timeAgo: '3h ago' },
  { id: 't3', claim: 'Competitor alleged to have violated data privacy regulations', badge: 'orange' as BadgeColor, confidence: 0.78, sourcesCount: 3, timeAgo: '5h ago' },
  { id: 't4', claim: 'Rumor about upcoming regulatory changes in industry', badge: 'yellow' as BadgeColor, confidence: 0.62, sourcesCount: 4, timeAgo: '1d ago' },
];

const MOCK_MONITORS = [
  { id: 'm1', query: 'Acme Corp', frequency: 'hourly', lastChecked: '12 min ago', status: 'active' as const, alerts: 3 },
  { id: 'm2', query: 'product recall rumor', frequency: 'daily', lastChecked: '2 hours ago', status: 'active' as const, alerts: 1 },
  { id: 'm3', query: 'CEO earnings quote', frequency: 'hourly', lastChecked: '45 min ago', status: 'active' as const, alerts: 0 },
  { id: 'm4', query: 'competitor SOC 2 claim', frequency: 'daily', lastChecked: '1 day ago', status: 'paused' as const, alerts: 0 },
];

export default function ThreatMonitor() {
  const [showAddMonitor, setShowAddMonitor] = useState(false);
  const [monitors, setMonitors] = useState(MOCK_MONITORS);
  const [newQuery, setNewQuery] = useState('');
  const [newFrequency, setNewFrequency] = useState('daily');
  const [selectedThreat, setSelectedThreat] = useState<typeof MOCK_THREATS[0] | null>(null);

  const handleAddMonitor = () => {
    if (!newQuery.trim()) return;
    setMonitors([{ id: `m${Date.now()}`, query: newQuery, frequency: newFrequency, lastChecked: 'just now', status: 'active', alerts: 0 }, ...monitors]);
    setNewQuery('');
    setShowAddMonitor(false);
  };

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

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Active Threats', value: MOCK_THREATS.length, icon: Shield, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Critical', value: MOCK_THREATS.filter(t => t.badge === 'red').length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Monitors Running', value: monitors.filter(m => m.status === 'active').length, icon: Activity, color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary-light)]' },
            { label: 'Avg Confidence', value: '78%', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
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

        {/* Threats Table */}
        <div className="card mb-6">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">All Threats</h3>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            <ThreatTable threats={MOCK_THREATS} onThreatClick={setSelectedThreat} />
          </div>
        </div>

        {/* Monitors */}
        <div className="card">
          <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Monitored Threats</h3>
            <span className="text-xs text-[var(--color-muted)]">{monitors.length} total</span>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-[var(--color-border)]">
                  {['Query', 'Frequency', 'Last Checked', 'Status', 'Alerts', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {monitors.map((m) => (
                  <tr key={m.id} className="hover:bg-[var(--color-bg)]/50 transition-colors cursor-pointer" onClick={() => setSelectedThreat({ id: m.id, claim: m.query, badge: 'yellow', confidence: 0.65, sourcesCount: 3, timeAgo: m.lastChecked })}>
                    <td className="px-5 py-3.5 text-sm font-medium text-[var(--color-text)]">{m.query}</td>
                    <td className="px-5 py-3.5 text-xs text-[var(--color-text-secondary)] capitalize">{m.frequency}</td>
                    <td className="px-5 py-3.5 text-xs text-[var(--color-muted)]">{m.lastChecked}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        m.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-mono text-[var(--color-text)]">{m.alerts}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setMonitors(monitors.filter(mon => mon.id !== m.id))} className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors cursor-pointer">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Monitor Modal */}
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
              <button onClick={handleAddMonitor} disabled={!newQuery.trim()} className={`w-full py-2.5 font-medium rounded-lg text-sm transition-colors cursor-pointer ${!newQuery.trim() ? 'bg-gray-100 text-[var(--color-muted)] cursor-not-allowed' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white'}`}>Create Monitor</button>
            </div>
          </div>
        </div>
      )}

      <ThreatDetail threat={selectedThreat} onClose={() => setSelectedThreat(null)} />
    </>
  );
}
