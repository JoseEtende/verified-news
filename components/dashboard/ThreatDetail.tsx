'use client';

import { X, Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { BadgeColor } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ThreatDetailProps {
  threat: {
    id: string;
    claim: string;
    badge: BadgeColor;
    confidence: number;
    sourcesCount: number;
    timeAgo: string;
  } | null;
  onClose: () => void;
}

const MOCK_EVOLUTION = [
  { date: 'Week 1', status: 'gray' as BadgeColor, confidence: 0.3 },
  { date: 'Week 2', status: 'yellow' as BadgeColor, confidence: 0.5 },
  { date: 'Week 3', status: 'orange' as BadgeColor, confidence: 0.7 },
  { date: 'Week 4', status: 'red' as BadgeColor, confidence: 0.9 },
  { date: 'Week 5', status: 'red' as BadgeColor, confidence: 0.94 },
];

const STATUS_COLORS: Record<BadgeColor, string> = {
  blue: '#3B82F6', green: '#22C55E', yellow: '#EAB308', orange: '#F97316', red: '#EF4444', gray: '#94A3B8',
};

const STATUS_LABELS: Record<BadgeColor, string> = {
  blue: 'Verified', green: 'Confirmed', yellow: 'Partially True', orange: 'Misleading', red: 'False', gray: 'Unverifiable',
};

const MOCK_SOURCES = [
  { title: 'Reddit post in r/technology', credibility: 'low', snippet: 'Users discussing potential recall...' },
  { title: 'Reuters fact-check article', credibility: 'high', snippet: 'No official statement from Acme Corp...' },
  { title: 'SEC EDGAR filing search', credibility: 'high', snippet: 'No 8-K filing found for recall...' },
];

export default function ThreatDetail({ threat, onClose }: ThreatDetailProps) {
  const [showEmail, setShowEmail] = useState(false);
  const [emailTo, setEmailTo] = useState('security@company.com');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  if (!threat) return null;

  const handleEscalate = () => {
    setEmailSubject(`[URGENT] Threat Escalation: ${threat.claim.slice(0, 50)}...`);
    setEmailBody(`Threat Details:\n\nClaim: ${threat.claim}\nStatus: ${STATUS_LABELS[threat.badge]}\nConfidence: ${(threat.confidence * 100).toFixed(0)}%\nSources: ${threat.sourcesCount}\nDetected: ${threat.timeAgo}\n\nPlease review and take appropriate action.`);
    setShowEmail(true);
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => {
      setShowEmail(false);
      setEmailSent(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl border border-[var(--color-border)] w-[850px] max-w-[95vw] max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[threat.badge] }}></div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">Threat Detail</p>
              <p className="text-xs text-[var(--color-muted)]">{STATUS_LABELS[threat.badge]} - {threat.timeAgo}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--color-bg)] transition-colors cursor-pointer">
            <X className="h-5 w-5 text-[var(--color-muted)]" />
          </button>
        </div>

        <div className="flex">
          {/* Left: Details */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(85vh-60px)]">
            <p className="text-base font-medium text-[var(--color-text)] mb-4">{threat.claim}</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[var(--color-bg)] rounded-lg p-3 text-center">
                <p className="text-xl font-bold" style={{ color: STATUS_COLORS[threat.badge] }}>{(threat.confidence * 100).toFixed(0)}%</p>
                <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Confidence</p>
              </div>
              <div className="bg-[var(--color-bg)] rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-[var(--color-text)]">{threat.sourcesCount}</p>
                <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Sources</p>
              </div>
              <div className="bg-[var(--color-bg)] rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-[var(--color-text)]">3</p>
                <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Contradictions</p>
              </div>
            </div>

            <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">Key Sources</h4>
            <div className="space-y-2 mb-6">
              {MOCK_SOURCES.map((src, i) => (
                <div key={i} className="bg-[var(--color-bg)] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
                      src.credibility === 'high' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>{src.credibility}</span>
                    <p className="text-xs font-medium text-[var(--color-text)]">{src.title}</p>
                  </div>
                  <p className="text-[11px] text-[var(--color-muted)] italic">{src.snippet}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={handleEscalate} className="btn-primary text-xs flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Escalate Alert
              </button>
              <button className="btn-outline text-xs">Dismiss Threat</button>
            </div>
          </div>

          {/* Right: Evolution Chart */}
          <div className="w-[320px] flex-shrink-0 border-l border-[var(--color-border)] p-6">
            <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">Threat Evolution</h4>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[threat.badge] }}></div>
                <span className="text-xs font-medium text-[var(--color-text)]">Current: {STATUS_LABELS[threat.badge]}</span>
              </div>
              <p className="text-[10px] text-[var(--color-muted)]">Status changed from Unverifiable to {STATUS_LABELS[threat.badge]} over 5 weeks</p>
            </div>

            <div className="bg-[var(--color-bg)] rounded-lg p-3 mb-4">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={MOCK_EVOLUTION}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 9 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 1]} tick={{ fill: '#94A3B8', fontSize: 9 }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                    formatter={(value: number) => [`${(value * 100).toFixed(0)}%`, 'Confidence']}
                  />
                  <Line type="monotone" dataKey="confidence" stroke="#EF4444" strokeWidth={2} dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    const statusKey = payload.status as BadgeColor;
                    return <circle key={payload.date} cx={cx} cy={cy} r={5} fill={STATUS_COLORS[statusKey] || '#94A3B8'} stroke="#fff" strokeWidth={2} />;
                  }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {MOCK_EVOLUTION.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[step.status] }}></div>
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-[var(--color-text)]">{step.date}</p>
                    <p className="text-[9px] text-[var(--color-muted)]">{STATUS_LABELS[step.status]} - {(step.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Email Escalation Modal */}
      {showEmail && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowEmail(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl border border-[var(--color-border)] p-6 w-[520px] max-w-[95vw]">
            <button onClick={() => setShowEmail(false)} className="absolute top-4 right-4 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer">
              <X className="h-5 w-5" />
            </button>

            {emailSent ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">Email Sent</h3>
                <p className="text-sm text-[var(--color-muted)]">Threat escalation has been sent to {emailTo}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--color-text)]">Escalate Threat</h3>
                    <p className="text-xs text-[var(--color-muted)]">Send via email to security team</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">To</label>
                    <input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="w-full rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Subject</label>
                    <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="w-full rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Message</label>
                    <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={6} className="w-full rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-none" />
                  </div>
                </div>

                <div className="flex gap-2 mt-5">
                  <button onClick={handleSendEmail} disabled={!emailTo.trim()} className="flex-1 btn-primary flex items-center justify-center gap-1.5">
                    <Send className="h-3.5 w-3.5" />
                    Send Email
                  </button>
                  <button onClick={() => setShowEmail(false)} className="btn-outline">Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
