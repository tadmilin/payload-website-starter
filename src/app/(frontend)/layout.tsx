import type { Metadata } from 'next'

import React from 'react'
import { ClientProviders } from '@/app/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { Jost } from 'next/font/google'
// import { Navbar } from '@/components/layout/Navbar'
import { getServerSideURL } from '@/utilities/getURL'
import '@/patch-i18next.js'
import FrontendClientScripts from './frontend-client'
import './globals.css'

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  weight: ['400', '700'],
})

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html lang="en" className={jost.variable} suppressHydrationWarning>
      <body>
        <FrontendClientScripts />
        <ClientProviders>
          {/* <Navbar /> */}
          <main>{children}</main>
        </ClientProviders>
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
