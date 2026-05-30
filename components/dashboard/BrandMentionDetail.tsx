'use client';

import { X, MapPin, Globe, Clock } from 'lucide-react';
import { BadgeColor } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface BrandMentionDetailProps {
  mention: {
    id: string;
    claim: string;
    badge: BadgeColor;
    confidence: number;
    category: string;
    timeAgo: string;
  } | null;
  onClose: () => void;
}

const MOCK_TIMELINE = [
  { date: 'Jan', mentions: 12 },
  { date: 'Feb', mentions: 18 },
  { date: 'Mar', mentions: 15 },
  { date: 'Apr', mentions: 22 },
  { date: 'May', mentions: 28 },
  { date: 'Jun', mentions: 35 },
];

const MOCK_LOCATIONS = [
  { name: 'United States', count: 45, percentage: 38 },
  { name: 'United Kingdom', count: 22, percentage: 18 },
  { name: 'Germany', count: 15, percentage: 13 },
  { name: 'India', count: 12, percentage: 10 },
  { name: 'Brazil', count: 8, percentage: 7 },
];

const MOCK_SOURCES = [
  { type: 'Social Media', count: 34, percentage: 29 },
  { type: 'News Publications', count: 28, percentage: 24 },
  { type: 'Blogs', count: 18, percentage: 15 },
  { type: 'Forums', count: 15, percentage: 13 },
  { type: 'Official Statements', count: 12, percentage: 10 },
];

const BADGE_HEX: Record<string, string> = {
  blue: '#3B82F6', green: '#22C55E', yellow: '#EAB308', orange: '#F97316', red: '#EF4444', gray: '#94A3B8',
};

const BADGE_LABELS: Record<string, string> = {
  blue: 'Verified', green: 'Confirmed', yellow: 'Partially True', orange: 'Misleading', red: 'False', gray: 'Unverifiable',
};

export default function BrandMentionDetail({ mention, onClose }: BrandMentionDetailProps) {
  if (!mention) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl border border-[var(--color-border)] w-[900px] max-w-[95vw] max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${BADGE_HEX[mention.badge]}15` }}
            >
              <span className="text-xs font-mono font-bold" style={{ color: BADGE_HEX[mention.badge] }}>
                {mention.badge === 'blue' ? 'VRF' : mention.badge === 'green' ? 'CFM' : mention.badge === 'yellow' ? 'PTR' : mention.badge === 'orange' ? 'MIS' : mention.badge === 'red' ? 'FLS' : 'UNV'}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">{BADGE_LABELS[mention.badge]}</p>
              <p className="text-xs text-[var(--color-muted)]">{mention.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--color-bg)] transition-colors cursor-pointer">
            <X className="h-5 w-5 text-[var(--color-muted)]" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(85vh-60px)]">
          {/* Claim */}
          <p className="text-base font-medium text-[var(--color-text)] mb-4">{mention.claim}</p>
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[var(--color-bg)] rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-[var(--color-text)]">{mention.confidence > 0 ? `${(mention.confidence * 100).toFixed(0)}%` : '—'}</p>
              <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Confidence</p>
            </div>
            <div className="bg-[var(--color-bg)] rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-[var(--color-text)]">118</p>
              <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Total Mentions</p>
            </div>
            <div className="bg-[var(--color-bg)] rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-[var(--color-text)]">5</p>
              <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Sources</p>
            </div>
          </div>

          {/* Timeline Chart */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">Mentions Over Time</h4>
            <div className="bg-[var(--color-bg)] rounded-lg p-4">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={MOCK_TIMELINE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="mentions" stroke="#0D9488" strokeWidth={2} dot={{ fill: '#0D9488', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Locations */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> Top Locations
              </h4>
              <div className="space-y-2">
                {MOCK_LOCATIONS.map((loc) => (
                  <div key={loc.name} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-[var(--color-text)]">{loc.name}</span>
                        <span className="text-[10px] font-mono text-[var(--color-muted)]">{loc.count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: `${loc.percentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Globe className="h-3 w-3" /> By Source Type
              </h4>
              <div className="space-y-2">
                {MOCK_SOURCES.map((src) => (
                  <div key={src.type} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-[var(--color-text)]">{src.type}</span>
                        <span className="text-[10px] font-mono text-[var(--color-muted)]">{src.count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${src.percentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
