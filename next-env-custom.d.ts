/// <reference types="next" />

// override PageProps ที่กำหนดโดย Next.js
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly PUBLIC_URL: string
  }
}

declare module 'next' {
  interface PageProps {
    params: { [key: string]: string }
    searchParams?: { [key: string]: string | string[] | undefined }
  }
}
