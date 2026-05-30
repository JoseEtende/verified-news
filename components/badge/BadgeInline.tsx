import { BADGE_CONFIG } from '@/lib/types';

interface BadgeInlineProps {
  badge: 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'gray';
  confidence?: number;
  showConfidence?: boolean;
}

export function BadgeInline({ badge, confidence, showConfidence = false }: BadgeInlineProps) {
  const config = BADGE_CONFIG[badge];
  const confidenceText = showConfidence && confidence !== undefined 
    ? ` ${confidence.toFixed(2)}` 
    : '';

  return (
    <div className="flex items-center space-x-2">
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: config.hex }}
      ></div>
      <span className="text-xs font-mono">{config.shortLabel}{confidenceText}</span>
    </div>
  );
}