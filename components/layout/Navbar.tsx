'use client';

import Link from 'next/link';
import { useState } from 'react';
import VerifyModal from '@/components/verification/VerifyModal';

export default function Navbar({ onOpenVerifyModal }: { onOpenVerifyModal?: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleVerifyClick = () => {
    if (onOpenVerifyModal) {
      onOpenVerifyModal();
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <nav className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-50">
        <div className="px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard/feed" className="flex items-center space-x-2.5">
            <svg viewBox="0 0 100 100" width="22" height="22">
              <path
                d="M 50 5 L 90 20 L 90 55 Q 90 85 50 95 Q 10 85 10 55 L 10 20 Z"
                fill="#2DD4BF"
              />
            </svg>
            <span className="text-lg font-semibold text-[var(--color-text)]">Verified News</span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/feed" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
              Feed
            </Link>
            <Link href="/dashboard/threat" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
              Dashboard
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleVerifyClick}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium py-2 px-5 rounded-input text-sm transition-colors cursor-pointer"
            >
              Verify Narrative
            </button>
            
            {/* Mobile toggle */}
            <button 
              className="md:hidden p-1.5 rounded-input hover:bg-gray-100 transition-colors cursor-pointer" 
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 space-y-3">
            <Link href="/dashboard/feed" className="block text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]" onClick={() => setMobileOpen(false)}>
              Feed
            </Link>
            <Link href="/dashboard" className="block text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]" onClick={() => setMobileOpen(false)}>
              Dashboard
            </Link>
          </div>
        )}
      </nav>

      <VerifyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
