'use client';

import Link from 'next/link';
import { LayoutDashboard, FileText, Shield, TrendingUp, Settings } from 'lucide-react';

interface DashboardSidebarProps {
  activeItem: 'feed' | 'overview' | 'threats' | 'brand' | 'settings';
}

export default function DashboardSidebar({ activeItem }: DashboardSidebarProps) {
  const navItems = [
    { id: 'overview' as const, label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'feed' as const, label: 'Feed', icon: FileText, href: '/dashboard/feed' },
    { id: 'threats' as const, label: 'Threat Monitor', icon: Shield, href: '/dashboard/threat', showRedDot: true },
    { id: 'brand' as const, label: 'Brand Intelligence', icon: TrendingUp, href: '/dashboard/brand' },
  ];

  const bottomItems = [
    { id: 'settings' as const, label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  return (
    <aside className="w-[280px] bg-white flex-shrink-0 h-[calc(100vh-60px)] sticky top-[60px] overflow-y-auto border-r border-[var(--color-border)]">
      <div className="p-5 flex flex-col h-full">
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[var(--color-primary)] text-white shadow-sm' 
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
                {item.showRedDot && !isActive && (
                  <div className="w-2 h-2 bg-red-500 rounded-full ml-auto"></div>
                )}
              </Link>
            );
          })}
          
          <div className="my-4 border-t border-[var(--color-border)]"></div>
          
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[var(--color-primary)] text-white shadow-sm' 
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Promo Card */}
        <div className="mt-4 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-xl p-4 text-white">
          <p className="text-xs font-semibold mb-1">Level Up Your Verification</p>
          <p className="text-[10px] text-white/70 leading-relaxed mb-3">Get full access to all premium features and agents.</p>
          <button className="w-full bg-white text-[var(--color-primary)] text-xs font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            Get Premium
          </button>
        </div>
      </div>
    </aside>
  );
}
