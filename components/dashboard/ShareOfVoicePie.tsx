'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BADGE_CONFIG, BadgeColor } from '@/lib/types';

interface ShareOfVoicePieProps {
  data: Record<BadgeColor, number>;
}

const REPRESENTATIONS: Record<BadgeColor, string> = {
  blue: 'Verified',
  green: 'Confirmed',
  yellow: 'Partially True',
  orange: 'Misleading',
  red: 'False',
  gray: 'Unverifiable',
};

export default function ShareOfVoicePie({ data }: ShareOfVoicePieProps) {
  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: REPRESENTATIONS[key as BadgeColor],
      value,
      color: BADGE_CONFIG[key as BadgeColor].hex,
    }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.06)' }}
          formatter={(value: number, name: string) => [`${value} claims`, name]}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value: string) => <span className="text-xs text-[var(--color-text-secondary)]">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
