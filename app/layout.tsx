import './globals.css';
import { DM_Mono } from 'next/font/google';
import type { Metadata } from 'next';

const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-numbers' });

export const metadata: Metadata = {
  title: 'Verified News',
  description: 'AI agents verify news claims against live web data.',
  openGraph: {
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmMono.variable}>
      <body>{children}</body>
    </html>
  );
}
