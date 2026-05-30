import './globals.css';
import { DM_Mono } from 'next/font/google';
import type { Metadata } from 'next';

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-numbers',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Verified News — AI-powered fact verification',
    template: '%s | Verified News',
  },
  description:
    'AI agent swarm that verifies news claims against live web data in real time. ' +
    'Color-coded trust badges with full evidentiary transparency.',
  openGraph: {
    title: 'Verified News',
    description: 'Is it true? AI agents find out.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Verified News',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verified News',
    description: 'Is it true? AI agents find out.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${dmMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-bg text-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
