'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
  {
    title: 'Verify any claim',
    description: 'Paste a URL, headline, or topic. Our AI agents scan the live web to find the truth.',
    icon: (
      <svg viewBox="0 0 100 100" width="64" height="64">
        <path d="M 50 5 L 90 20 L 90 55 Q 90 85 50 95 Q 10 85 10 55 L 10 20 Z" fill="#0891B2" opacity="0.15" />
        <path d="M 50 5 L 90 20 L 90 55 Q 90 85 50 95 Q 10 85 10 55 L 10 20 Z" fill="none" stroke="#0891B2" strokeWidth="3" />
        <text x="50" y="52" textAnchor="middle" fill="#0891B2" fontFamily="'DM Mono', monospace" fontWeight="bold" fontSize="16">VRF</text>
      </svg>
    ),
  },
  {
    title: 'Color-coded verdicts',
    description: 'Every claim gets a trust badge — from Verified (blue) to False (red) — with full source transparency.',
    icon: (
      <div className="flex gap-3">
        {['#3B82F6', '#22C55E', '#EAB308', '#F97316', '#EF4444'].map((color) => (
          <div key={color} className="w-10 h-10 rounded-full" style={{ backgroundColor: color, opacity: 0.8 }}></div>
        ))}
      </div>
    ),
  },
  {
    title: 'Monitor threats',
    description: 'Set up monitors for brands, competitors, or topics. Get alerts when narratives change.',
    icon: (
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
    ),
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('vn_onboarded', 'true');
      router.push('/auth');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('vn_onboarded', 'true');
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Skip */}
      <div className="flex justify-end p-6">
        <button onClick={handleSkip} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer">
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="mb-10">{STEPS[step].icon}</div>
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-3">{STEPS[step].title}</h1>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-sm leading-relaxed">{STEPS[step].description}</p>
      </div>

      {/* Dots + Next */}
      <div className="p-8">
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[var(--color-primary)]' : 'w-2 bg-[var(--color-border)]'}`}></div>
          ))}
        </div>
        <button
          onClick={handleNext}
          className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-input transition-colors cursor-pointer text-sm"
        >
          {step < STEPS.length - 1 ? 'Next' : 'Get Started'}
        </button>
      </div>
    </div>
  );
}
