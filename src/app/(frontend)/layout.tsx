import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { ClientProviders } from '@/app/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import '@/patch-i18next.js'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="th" suppressHydrationWarning>
      <head>
        <InitTheme />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var savedLang = localStorage.getItem('language');
                if (!savedLang) {
                  localStorage.setItem('language', 'th');
                }
                document.documentElement.lang = savedLang || 'th';
                document.documentElement.setAttribute('data-lang', savedLang || 'th');
              } catch (e) {}
            `,
          }}
        />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* ซ่อนทุกอย่างที่เกี่ยวกับ Payload */
            nav.payload-nav,
            header.payload-header,
            .payload-header,
            .payload-nav,
            .admin-bar,
            div[class*="payload-"],
            footer.payload-footer,
            .payload-footer {
              display: none !important;
            }
            
            /* ซ่อน AdminBar */
            .admin-bar {
              display: none !important;
            }
            
            /* ซ่อน Header ของ Payload */
            header:has(.payload-logo), 
            header:has([alt="Payload Logo"]) {
              display: none !important;
            }
          `
        }} />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
