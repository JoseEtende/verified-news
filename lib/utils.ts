import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

// Badge utility functions
export function getBadgeColor(badge: 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'gray'): string {
  const colors: Record<string, string> = {
    blue: '#3B82F6',
    green: '#22C55E',
    yellow: '#EAB308',
    orange: '#F97316',
    red: '#EF4444',
    gray: '#6B7280',
  };
  return colors[badge] || '#6B7280';
}

export function getBadgeLabel(badge: 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'gray'): string {
  const labels: Record<string, string> = {
    blue: 'Verified',
    green: 'Confirmed',
    yellow: 'Partially True',
    orange: 'Misleading',
    red: 'False',
    gray: 'Unverifiable',
  };
  return labels[badge] || 'Unknown';
}

export function getBadgeShortLabel(badge: 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'gray'): string {
  const shortLabels: Record<string, string> = {
    blue: 'VRF',
    green: 'CFM',
    yellow: 'PTR',
    orange: 'MIS',
    red: 'FLS',
    gray: 'UNV',
  };
  return shortLabels[badge] || '???';
}

// Date formatting utility
export function formatDateAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Truncate text utility
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}