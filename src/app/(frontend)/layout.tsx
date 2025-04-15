import type { Metadata } from 'next'

import React from 'react'
import { Providers } from '@/providers'
import { ClientProviders } from '@/app/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import '@/patch-i18next.js'
import FrontendClientScripts from './frontend-client'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <>
      <FrontendClientScripts />
      <ClientProviders>
        <Providers>
          <div className="frontend-content">
            {children}
          </div>
        </Providers>
      </ClientProviders>
    </>
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
