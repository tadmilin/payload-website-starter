declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET:"Neon4BlueB@llP@yload123456"
      DATABASE_URI: "postgres://neondb_owner:npg_EnriP8H1QWcw@ep-curly-mountain-a1ylqvos-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
      NEXT_PUBLIC_SERVER_URL: "https://payload-website-starter-o3w46cjhz-tadmilins-projects.vercel.app"
      VERCEL_PROJECT_PRODUCTION_URL: "https://payload-solarlaa-website.vercel.app"
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
