import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portfolio | CS Engineer',
  description: 'Full-Stack Software Engineer portfolio - Computer Science specialist',
  keywords: ['software engineer', 'full stack', 'computer science', 'portfolio'],
  robots: 'index, follow',
};

import { stack } from '@/lib/stack';
import { StackProvider } from '@stackframe/stack';
import VisitorTracker from '@/components/ui/VisitorTracker';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>



      <body>
        <StackProvider app={stack}>
          <Suspense fallback={<div className="min-h-screen bg-void" />}>
            {children}
            <VisitorTracker />
          </Suspense>
        </StackProvider>
      </body>
    </html>
  );
}
