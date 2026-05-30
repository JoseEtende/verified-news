import { BADGE_CONFIG, BadgeColor } from '@/lib/types';

interface ConfidenceMeterProps {
  confidence: number;
  badge?: BadgeColor;
}

export default function ConfidenceMeter({ confidence, badge = 'blue' }: ConfidenceMeterProps) {
  const config = BADGE_CONFIG[badge];
  const percentage = Math.round(confidence * 100);

  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: config.hex }}
        ></div>
      </div>
      <span className="text-[10px] font-mono text-[var(--color-muted)]">{percentage}%</span>
    </div>
  );
}
