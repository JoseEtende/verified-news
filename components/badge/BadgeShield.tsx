import { BADGE_CONFIG, BadgeColor } from '@/lib/types';

interface BadgeShieldProps {
  badge: BadgeColor;
  confidence: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export function BadgeShield({ badge, confidence, size = 'md', animated = false }: BadgeShieldProps) {
  const config = BADGE_CONFIG[badge];
  const sizeMap: Record<string, number> = { sm: 32, md: 48, lg: 80, xl: 120 };
  const shieldSize = sizeMap[size] || 48;
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg viewBox="0 0 100 100" width={shieldSize} height={shieldSize}>
        <path
          d="M 50 5 L 90 20 L 90 55 Q 90 85 50 95 Q 10 85 10 55 L 10 20 Z"
          fill={config.hex}
          opacity={0.12}
        />
        <path
          d="M 50 5 L 90 20 L 90 55 Q 90 85 50 95 Q 10 85 10 55 L 10 20 Z"
          fill="none"
          stroke={config.hex}
          strokeWidth="3"
        />
        
        {size !== 'sm' && (
          <>
            <text
              x="50" y="45"
              textAnchor="middle"
              fill={config.hex}
              fontFamily="'DM Mono', monospace"
              fontWeight="bold"
              fontSize={shieldSize * 0.1}
            >
              {config.shortLabel}
            </text>
            <text
              x="50" y="60"
              textAnchor="middle"
              fill={config.hex}
              fontFamily="'DM Mono', monospace"
              fontSize={shieldSize * 0.07}
              opacity={0.7}
            >
              {confidencePercent}%
            </text>
          </>
        )}
        
        {size === 'sm' && (
          <text
            x="50" y="56"
            textAnchor="middle"
            fill={config.hex}
            fontFamily="'DM Mono', monospace"
            fontWeight="bold"
            fontSize="16"
          >
            {config.shortLabel}
          </text>
        )}
      </svg>
    </div>
  );
}
