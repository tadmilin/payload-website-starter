import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
// import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'

// Load .env file
// dotenv.config({ path: path.resolve(process.cwd(), 'src/.env') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') }) // Load .env from root

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Consultations } from './collections/Consultations'
// import { Footer } from './Footer/config'
// import { Header } from './Header/config'
// import { plugins } from './plugins' // Keep import for reference, but ensure it's empty or commented out below
import { defaultLexical } from '@/fields/defaultLexical'
// import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Check required environment variables
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set.')
  // Optionally, throw an error or exit if critical variables are missing for production
  // process.exit(1);
}
if (!process.env.PAYLOAD_SECRET) {
  console.warn('WARN: PAYLOAD_SECRET environment variable is not set. Using a default value.')
  // Consider throwing an error in production if the secret is missing
}

// Configure the Vercel PostgreSQL adapter
const dbAdapter = vercelPostgresAdapter({
  // pool options are usually handled by Vercel automatically
  // pool: {
  //   connectionString: process.env.DATABASE_URL,
  // },
})

console.log('[payload.config] Using Vercel Postgres Adapter')

// สร้าง email transport
// ใช้การตั้งค่าเฉพาะสำหรับทดสอบ หรือแก้ไขเป็นการตั้งค่าจริงสำหรับ production
const emailTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  auth: {
    user: process.env.SMTP_USER || 'your.email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
  secure: process.env.SMTP_SECURE === 'true',
})

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    // กำหนด path ไปยัง admin overrides เพื่อแก้ไขปัญหา hydration
    path: path.resolve(dirname, './app/(payload)/admin/overrides.tsx'),
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // ตั้งค่าการส่งอีเมล (ใช้ nodemailerAdapter)
  email: nodemailerAdapter({
    transportOptions: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      auth: {
        user: process.env.SMTP_USER || 'your.email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password',
      },
      secure: process.env.SMTP_SECURE === 'true',
    },
    fromName: 'SOLARLAA',
    fromAddress: process.env.EMAIL_FROM || 'noreply@solarlaa.com',
  }),
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: dbAdapter,
  collections: [Users, Media, Pages, Posts, Categories, Consultations],
  cors: ['*'], // อนุญาตให้เข้าถึงจากทุก domain
  globals: [
    // ...globals, // Ensure this is still commented out or './globals' exports empty array
  ],
  plugins: [
    // ...plugins, // Ensure this is still commented out or './plugins' exports empty array
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      clientUploads: true,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || 'default-fallback-secret-CHANGE-ME',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
  graphQL: {
    disable: false,
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  routes: {
    admin: '/admin', // แยก admin route ออกมา
  },
})
