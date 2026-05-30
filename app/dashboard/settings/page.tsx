'use client';

import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { User, Bell, Key, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <DashboardSidebar activeItem="settings" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[var(--color-text)]">Settings</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Manage your account and preferences</p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Profile */}
          <div className="card">
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
              <User className="h-4 w-4 text-[var(--color-primary)]" />
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Profile</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Organization</label>
                <input type="text" defaultValue="Acme Corp" className="w-full rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
                <input type="email" defaultValue="jose@example.com" className="w-full rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
              <Bell className="h-4 w-4 text-[var(--color-primary)]" />
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Notifications</h3>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Email alerts for critical threats', checked: true },
                { label: 'Daily digest summary', checked: false },
                { label: 'Weekly brand intelligence report', checked: true },
              ].map((item) => (
                <label key={item.label} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                  <span className="text-sm text-[var(--color-text)]">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* API Keys */}
          <div className="card">
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
              <Key className="h-4 w-4 text-[var(--color-primary)]" />
              <h3 className="text-sm font-semibold text-[var(--color-text)]">API Keys</h3>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Bright Data API Key</p>
                  <p className="text-xs font-mono text-[var(--color-muted)]">bd-****-****-7f2a</p>
                </div>
                <button className="text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors cursor-pointer">Rotate</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Supabase URL</p>
                  <p className="text-xs font-mono text-[var(--color-muted)]">https://xyz.supabase.co</p>
                </div>
                <button className="text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors cursor-pointer">Edit</button>
              </div>
            </div>
          </div>

          <button className="btn-primary flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
