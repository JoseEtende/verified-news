'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { BADGE_CONFIG, BadgeColor } from '@/lib/types';

interface ShareOfVoiceData {
  date: string;
  blue: number;
  green: number;
  yellow: number;
  orange: number;
  red: number;
  gray: number;
}

interface ShareOfVoiceChartProps {
  data: ShareOfVoiceData[];
}

const badgeColors: Record<BadgeColor, string> = {
  blue: BADGE_CONFIG.blue.hex,
  green: BADGE_CONFIG.green.hex,
  yellow: BADGE_CONFIG.yellow.hex,
  orange: BADGE_CONFIG.orange.hex,
  red: BADGE_CONFIG.red.hex,
  gray: BADGE_CONFIG.gray.hex,
};

export default function ShareOfVoiceChart({ data }: ShareOfVoiceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis 
          dataKey="date" 
          tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: "'DM Mono', monospace" }}
          tickLine={false}
          axisLine={{ stroke: '#E2E8F0' }}
        />
        <YAxis 
          tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: "'DM Mono', monospace" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.06)' }}
          labelStyle={{ color: '#475569', fontSize: '11px', fontFamily: "'DM Mono', monospace" }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          wrapperStyle={{ fontSize: '11px', fontFamily: "'DM Mono', monospace" }}
        />
        <Bar dataKey="gray" stackId="a" fill={badgeColors.gray} />
        <Bar dataKey="red" stackId="a" fill={badgeColors.red} />
        <Bar dataKey="orange" stackId="a" fill={badgeColors.orange} />
        <Bar dataKey="yellow" stackId="a" fill={badgeColors.yellow} />
        <Bar dataKey="green" stackId="a" fill={badgeColors.green} />
        <Bar dataKey="blue" stackId="a" fill={badgeColors.blue} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
