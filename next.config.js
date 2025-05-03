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
    disableStaticImages: true,
  },
  reactStrictMode: true,
  redirects,
  transpilePackages: ['react-i18next', 'i18next', 'pg-cloudflare'],
  async rewrites() {
    return [
      {
        source: '/api/users/reset-password',
        destination: '/payload/api/users/reset-password',
      },
    ]
  },
  webpack: (config, { webpack }) => {
    // แก้ไขปัญหา cloudflare:sockets
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /cloudflare:sockets/,
        path.join(__dirname, 'cloudflare-sockets-shim.js'),
      ),
    )

    // แก้ไขการอ้างอิง @payload-config
    config.resolve.alias = {
      ...config.resolve.alias,
      '@payload-config': path.join(__dirname, 'src/payload.config.ts'),
    }

    // Fallback สำหรับ node builtin modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      fs: false,
      dns: false,
      child_process: false,
      http2: false,
    }

    // แก้ไขปัญหา sharp และ SVG files
    config.module = config.module || {}
    config.module.rules = config.module.rules || []
    config.module.rules.push(
      {
        test: /\.(png|jpe?g|gif|ico|webp|avif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
      },
    )

    return config
  },
  experimental: {
    esmExternals: true,
    cpus: 1,
    memoryBasedWorkersCount: true,
  },
}

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
  // รองรับ Edge runtime บน Vercel
  forceDisableLocalizationMiddleware: true,
})
