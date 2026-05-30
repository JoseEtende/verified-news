'use client';

interface VerificationProgressProps {
  agentProgress: string;
  verificationProgress: {
    discovery: 'pending' | 'done' | 'error';
    extraction: 'pending' | 'done' | 'error';
    crossReference: 'pending' | 'done' | 'error';
    verdict: 'pending' | 'done' | 'error';
  };
}

export default function VerificationProgress({ agentProgress, verificationProgress }: VerificationProgressProps) {
  const steps = [
    { id: 'discovery', label: 'Discovery agent' },
    { id: 'extraction', label: 'Extraction agent' },
    { id: 'crossReference', label: 'Cross-reference agent' },
    { id: 'verdict', label: 'Verdict agent' },
  ];

  return (
    <div className="space-y-4 bg-white rounded-card border border-[var(--color-border)] p-5">
      <div className="space-y-3">
        {steps.map((step) => {
          const status = verificationProgress[step.id as keyof typeof verificationProgress];
          return (
            <div key={step.id} className="flex items-center space-x-3">
              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                {status === 'pending' && (
                  <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
                )}
                {status === 'done' && (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="white">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {status === 'error' && (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="white">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className={`${status === 'pending' ? 'pl-3 border-l-2 border-[var(--color-primary)]' : ''}`}>
                <p className="text-sm font-medium text-[var(--color-text)]">{step.label}</p>
                <p className="text-xs font-mono text-[var(--color-muted)]">
                  {status === 'pending' && 'Waiting...'}
                  {status === 'done' && 'Done'}
                  {status === 'error' && 'Error'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="pt-3 border-t border-[var(--color-border)]">
        <p className="text-xs font-mono text-[var(--color-muted)]">{agentProgress}</p>
      </div>
    </div>
  );
}
