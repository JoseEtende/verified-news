'use client';

import Navbar from '@/components/layout/Navbar';
import { BadgeShield } from '@/components/badge/BadgeShield';
import ConfidenceMeter from '@/components/badge/ConfidenceMeter';
import EvidenceTree from '@/components/verification/EvidenceTree';
import VerificationProgress from '@/components/verification/VerificationProgress';
import { useRouter, usePathname } from 'next/navigation';
import { MOCK_CLAIMS } from './mockData';
import { ArrowLeft, Download, Bell, X } from 'lucide-react';
import { useState } from 'react';

export default function ClaimDetail() {
  const router = useRouter();
  const pathname = usePathname();
  const claimId = pathname.split('/').pop() || '1';
  const claim = MOCK_CLAIMS[claimId] || MOCK_CLAIMS['1'];
  const [showMonitor, setShowMonitor] = useState(false);
  const [monitorQuery, setMonitorQuery] = useState(claim.extracted_claim || claim.input_content);
  const [monitorFrequency, setMonitorFrequency] = useState('daily');

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-[var(--color-bg)] transition-colors cursor-pointer">
            <ArrowLeft className="h-5 w-5 text-[var(--color-muted)]" />
          </button>
          <div>
            <p className="text-xs text-[var(--color-muted)]">Claim Detail</p>
            <h1 className="text-lg font-bold text-[var(--color-text)] line-clamp-1">{claim.extracted_claim}</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-primary-light)] text-[var(--color-primary)]">{claim.track_context}</span>
              <span className="text-xs text-[var(--color-muted)]">Verified with {claim.verification?.model_used}</span>
            </div>
            
            {claim.status === 'processing' ? (
              <div className="card p-5">
                <VerificationProgress agentProgress={claim.agent_progress} verificationProgress={{ discovery: 'pending', extraction: 'pending', crossReference: 'pending', verdict: 'pending' }} />
              </div>
            ) : (
              <>
                <div className="card p-5 flex items-center gap-5">
                  <BadgeShield badge={claim.verification!.badge} confidence={claim.verification!.confidence_score} size="xl" animated={true} />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-[var(--color-text)]">{claim.verification!.verdict_summary}</p>
                    <ConfidenceMeter confidence={claim.verification!.confidence_score} badge={claim.verification!.badge} />
                  </div>
                </div>
                <div className="card p-5">
                  <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">Detailed Analysis</h3>
                  <div className="text-sm text-[var(--color-text-secondary)] space-y-3">
                    {claim.verification!.detailed_analysis.split('\n\n').map((p: string, i: number) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {claim.status !== 'processing' && (
              <div className="flex gap-3">
                <button onClick={() => setShowMonitor(true)} className="btn-outline flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Set Monitor
                </button>
                <button className="btn-outline flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export PDF
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-5">
            <div className="card p-5">
              <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-4">Evidence</h3>
              <EvidenceTree sources={claim.verification?.sources || []} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: claim.verification?.primary_sources_count || 0, label: 'Primary' },
                { value: claim.verification?.secondary_sources_count || 0, label: 'Secondary' },
                { value: claim.verification?.fact_checks_found || 0, label: 'Fact Checks' },
              ].map((s) => (
                <div key={s.label} className="card p-3 text-center">
                  <div className="text-xl font-mono font-bold text-[var(--color-text)]">{s.value}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monitor Modal */}
      {showMonitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowMonitor(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl border border-[var(--color-border)] p-6 w-[420px] max-w-[90vw]">
            <button onClick={() => setShowMonitor(false)} className="absolute top-4 right-4 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-1">Monitor New Threat</h2>
            <p className="text-sm text-[var(--color-muted)] mb-5">Track this claim for changes</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">What to monitor</label>
                <input type="text" value={monitorQuery} onChange={(e) => setMonitorQuery(e.target.value)} className="w-full rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Check frequency</label>
                <div className="flex gap-2">
                  {['hourly', 'daily', 'weekly'].map((f) => (
                    <button key={f} type="button" onClick={() => setMonitorFrequency(f)} className={`flex-1 py-2 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${monitorFrequency === f ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'}`}>{f}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => { setShowMonitor(false); router.push('/dashboard/threat'); }} className="w-full py-2.5 font-medium rounded-lg text-sm bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white transition-colors cursor-pointer">Create Monitor</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
