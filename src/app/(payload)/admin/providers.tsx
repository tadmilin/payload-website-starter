import React from 'react'
import { UploadHandlersProvider } from '@payloadcms/storage-vercel-blob/client'

export function Providers({ children }: { children: React.ReactNode }) {
  return <UploadHandlersProvider>{children}</UploadHandlersProvider>
}

export default Providers
