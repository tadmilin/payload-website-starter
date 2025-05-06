import type { Metadata } from 'next';

import React from 'react';
import { ClientProviders } from '@/app/providers';
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph';
import { draftMode } from 'next/headers';
import { Jost } from 'next/font/google';
// import { Navbar } from '@/components/layout/Navbar'
import { getServerSideURL } from '@/utilities/getURL';
import '@/patch-i18next.js';
import FrontendClientScripts from './frontend-client';
import './globals.css';

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  weight: ['400', '700'],
  display: 'swap',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
});

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode();

  return (
    <div className={jost.variable} suppressHydrationWarning>
      <FrontendClientScripts />
      <ClientProviders>
        {/* <Navbar /> */}
        <main suppressHydrationWarning>{children}</main>
      </ClientProviders>
    </div>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
};
