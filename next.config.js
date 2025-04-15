import { withPayload } from '@payloadcms/next/withPayload'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'

import redirects from './redirects.js'

// แก้ไขปัญหา __dirname ใน ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
    domains: ['images.unsplash.com'],
  },
  reactStrictMode: true,
  redirects,
  transpilePackages: ['react-i18next', 'i18next'],
  webpack: (config) => {
    return config
  },
  experimental: {
    esmExternals: true,
    cpus: 1,
    memoryBasedWorkersCount: true,
  }
}

export default withPayload(nextConfig, { 
  devBundleServerPackages: false,
  // รองรับ Edge runtime บน Vercel
  forceDisableLocalizationMiddleware: true
})
