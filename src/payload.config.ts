import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load .env file
// dotenv.config({ path: path.resolve(process.cwd(), 'src/.env') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') }) // Load .env from root

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
// import { Footer } from './Footer/config' // Temporarily remove globals
// import { Header } from './Header/config' // Temporarily remove globals
import { plugins } from './plugins' // Keep import for reference, but ensure it's empty or commented out below
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// --- DEBUGGING START ---
console.log('[payload.config] Checking environment variables before building config:')
console.log(`[payload.config] DATABASE_URL: ${process.env.DATABASE_URL ? 'Loaded' : 'MISSING!'}`)
console.log(
  `[payload.config] PAYLOAD_SECRET: ${process.env.PAYLOAD_SECRET ? 'Loaded' : 'MISSING!'}`,
)
// --- DEBUGGING END ---

// เลือกว่าจะใช้ vercel postgres adapter หรือ standard postgres adapter
// const isVercelEnv = Boolean(process.env.VERCEL) || false;
// const dbAdapter = isVercelEnv
//   ? vercelPostgresAdapter({})
//   : postgresAdapter({
// Force use postgresAdapter for local debugging
const dbAdapter = postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URL, // Removed fallback to POSTGRES_URL for simplicity
    // ถ้าไม่มี environment variable ให้ใช้ค่า default สำหรับ local development
    // --- Temporarily removed default connection details to ensure .env is used ---
    // ...(!(process.env.DATABASE_URL) && {
    //   user: 'postgres',
    //   password: 'Tadmayer123',
    //   host: '127.0.0.1',
    //   port: 5432,
    //   database: 'payload',
    // }),
  },
})

console.log('[payload.config] Using dbAdapter:', dbAdapter.name) // Log which adapter is used

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
  // This config helps us configure global or default features that the other editors can inherit
  // editor: defaultLexical, // Temporarily disable complex editor for debugging
  db: dbAdapter,
  collections: [Users], // Only include Users collection
  cors: ['*'], // อนุญาตให้เข้าถึงจากทุก domain
  globals: [],
  plugins: [
    // ...plugins, // Ensure this is still commented out or './plugins' exports empty array
    // vercelBlobStorage({
    //   collections: {
    //     media: true,
    //   },
    //   token: process.env.BLOB_READ_WRITE_TOKEN || '',
    // }), // Temporarily remove storage plugin
  ],
  secret: process.env.PAYLOAD_SECRET || 'your_secure_secret_key_here_1234567890',
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
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  routes: {
    admin: '/admin', // แยก admin route ออกมา
  },
})
