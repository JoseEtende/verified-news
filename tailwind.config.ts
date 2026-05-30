import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Ranade', 'system-ui', 'sans-serif'],
        numbers: ['DM Mono', 'monospace'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#0891B2',
          hover: '#0E7490',
          light: '#ECFEFF',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
