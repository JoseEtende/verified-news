'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const NOTIFICATIONS = [
    { id: 1, text: 'New threat detected: Acme Corp recall rumor', time: '2m ago', read: false },
    { id: 2, text: 'Monitor "CEO earnings quote" triggered', time: '15m ago', read: false },
    { id: 3, text: 'Brand mention verified: Sustainable product line', time: '1h ago', read: true },
    { id: 4, text: 'Weekly intelligence report ready', time: '3h ago', read: true },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Top Header Bar */}
      <header className="h-[60px] bg-white border-b border-[var(--color-border)] flex items-center justify-between px-6 sticky top-0 z-50">
        {/* Left: Logo */}
        <Link href="/dashboard/feed" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 100 100" width="18" height="18">
              <path d="M 50 5 L 90 20 L 90 55 Q 90 85 50 95 Q 10 85 10 55 L 10 20 Z" fill="white" />
            </svg>
          </div>
          <span className="text-base font-bold text-[var(--color-text)]">Verified News</span>
        </Link>

        {/* Right: Search + Notifications + Avatar */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-[var(--color-bg)] rounded-lg px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:bg-white transition-all">
            <Search className="h-4 w-4 text-[var(--color-muted)]" />
            <input 
              type="text" 
              placeholder="Search anything" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] outline-none w-full"
            />
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative p-2 rounded-lg hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
            >
              <Bell className="h-5 w-5 text-[var(--color-text-secondary)]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-[var(--color-border)] overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Notifications</p>
                  <button className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] cursor-pointer">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-[var(--color-border)]/50 hover:bg-[var(--color-bg)]/50 transition-colors cursor-pointer ${!n.read ? 'bg-[var(--color-primary-light)]/30' : ''}`}>
                      <div className="flex items-start gap-2">
                        {!n.read && <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-1.5 flex-shrink-0"></div>}
                        <div className="flex-1">
                          <p className="text-sm text-[var(--color-text)]">{n.text}</p>
                          <p className="text-[10px] text-[var(--color-muted)] mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-[var(--color-border)]">
                  <button className="w-full text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium cursor-pointer">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-[var(--color-primary)]">JD</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-[var(--color-text)] leading-tight">Jose D.</p>
                <p className="text-[10px] text-[var(--color-muted)]">Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-[var(--color-muted)] hidden md:block" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-[var(--color-border)] overflow-hidden z-50">
                <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] transition-colors" onClick={() => setProfileOpen(false)}>
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] transition-colors" onClick={() => setProfileOpen(false)}>
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <div className="border-t border-[var(--color-border)]"></div>
                <Link href="/auth/login" className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors" onClick={() => setProfileOpen(false)}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex">
        {children}
      </div>
    </div>
  );
}
