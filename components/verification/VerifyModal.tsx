'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Input } from '@/components/ui/input';

interface VerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VerifyModal({ isOpen, onClose }: VerifyModalProps) {
  const [tab, setTab] = useState<'url' | 'text' | 'topic'>('url');
  const [trackContext, setTrackContext] = useState<'consumer' | 'track1_gtm' | 'track3_security'>('consumer');
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); onClose(); }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-modal shadow-xl border border-[var(--color-border)] p-6 w-[420px] max-w-[90vw]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-[var(--color-text)]">Verify a claim</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1 mb-6">
          Enter a claim to verify using our AI agents
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="flex w-full border-b border-[var(--color-border)]">
              {(['url', 'text', 'topic'] as const).map((t) => (
                <TabsTrigger 
                  key={t}
                  value={t} 
                  className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors cursor-pointer ${
                    tab === t 
                      ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' 
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text-secondary)]'
                  }`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="url" className="pt-4">
              <Input
                placeholder="Paste article URL..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full rounded-input bg-gray-50 border-[var(--color-border)] px-4 py-3 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </TabsContent>
            
            <TabsContent value="text" className="pt-4">
              <textarea
                placeholder="Paste the claim or headline..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={4}
                className="w-full rounded-input bg-gray-50 border border-[var(--color-border)] px-4 py-3 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] resize-none text-sm"
              />
            </TabsContent>
            
            <TabsContent value="topic" className="pt-4">
              <Input
                placeholder="e.g. AI regulation, climate data..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full rounded-input bg-gray-50 border-[var(--color-border)] px-4 py-3 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </TabsContent>
          </Tabs>
          
          <div>
            <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">Track context</p>
            <div className="flex gap-2">
              {[
                { value: 'consumer' as const, label: 'Consumer' },
                { value: 'track1_gtm' as const, label: 'GTM Intel' },
                { value: 'track3_security' as const, label: 'Threat Monitor' },
              ].map((ctx) => (
                <button
                  key={ctx.value}
                  type="button"
                  className={`px-3 py-1.5 text-xs font-medium rounded-input transition-colors cursor-pointer ${
                    trackContext === ctx.value 
                      ? 'bg-[var(--color-primary)] text-white' 
                      : 'bg-gray-50 text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
                  }`}
                  onClick={() => setTrackContext(ctx.value)}
                >
                  {ctx.label}
                </button>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!inputValue.trim() || isSubmitting}
            className={`w-full py-3 px-6 text-sm font-medium rounded-input flex items-center justify-center space-x-2 transition-colors cursor-pointer ${
              !inputValue.trim() || isSubmitting
                ? 'bg-gray-100 text-[var(--color-muted)] cursor-not-allowed'
                : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <span>Verifying...</span>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" stroke="currentColor">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              </>
            ) : (
              <span>Verify Now</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
