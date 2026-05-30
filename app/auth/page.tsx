'use client';

import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-10 text-center">
        <svg viewBox="0 0 100 100" width="48" height="48" className="mx-auto mb-4">
          <path d="M 50 5 L 90 20 L 90 55 Q 90 85 50 95 Q 10 85 10 55 L 10 20 Z" fill="#0891B2" />
        </svg>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Verified News</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">Truth, verified by AI</p>
      </div>

      {/* Auth Cards */}
      <div className="w-full max-w-sm space-y-4">
        <Link
          href="/auth/login"
          className="block w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-input text-center text-sm transition-colors"
        >
          Login
        </Link>
        <Link
          href="/auth/signup"
          className="block w-full py-3 bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text)] font-medium rounded-input text-center text-sm transition-colors"
        >
          Create Account
        </Link>
      </div>

      {/* Social Login */}
      <div className="w-full max-w-sm mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[var(--color-border)]"></div>
          <span className="text-xs text-[var(--color-muted)]">or continue with</span>
          <div className="flex-1 h-px bg-[var(--color-border)]"></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-2.5 bg-white border border-[var(--color-border)] rounded-input text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] transition-colors cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 bg-white border border-[var(--color-border)] rounded-input text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] transition-colors cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
