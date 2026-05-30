'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/auth/login" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-text-secondary)] mb-8 transition-colors">
          &larr; Back to login
        </Link>

        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">Forgot password?</h1>
        <p className="text-sm text-[var(--color-muted)] mb-8">Enter your email and we&apos;ll send you a reset link</p>

        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-card p-4 text-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-green-800">Check your email</p>
            <p className="text-xs text-green-600 mt-1">We sent a reset link to {email}</p>
            <Link href="/auth/reset-password" className="inline-block mt-4 text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
              Enter reset code manually &rarr;
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-input bg-white border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={!email}
              className={`w-full py-3 font-medium rounded-input text-sm transition-colors cursor-pointer ${
                !email
                  ? 'bg-gray-100 text-[var(--color-muted)] cursor-not-allowed'
                  : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white'
              }`}
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
