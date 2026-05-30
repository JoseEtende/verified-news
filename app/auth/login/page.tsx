'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      localStorage.setItem('vn_onboarded', 'true');
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Back */}
        <Link href="/auth" className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-text-secondary)] mb-8 transition-colors">
          &larr; Back
        </Link>

        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">Welcome back</h1>
        <p className="text-sm text-[var(--color-muted)] mb-8">Login to your account</p>

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
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-input bg-white border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
            />
          </div>

          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={!email || !password || loading}
            className={`w-full py-3 font-medium rounded-input text-sm transition-colors cursor-pointer ${
              !email || !password || loading
                ? 'bg-gray-100 text-[var(--color-muted)] cursor-not-allowed'
                : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--color-muted)] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
