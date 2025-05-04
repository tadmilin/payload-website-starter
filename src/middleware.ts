import { NextRequest, NextResponse } from 'next/server'
// import { limiter } from '@/middleware/rateLimit'

/**
 * NextJS Middleware ที่ทำงานกับทุก request
 */
export function middleware(request: NextRequest) {
  // ถ้าเป็น path หลัก ให้ redirect ไปที่ /home
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // สำหรับทุก request ที่เกี่ยวข้องกับ API
  // ไม่จำเป็นต้องจัดการ CORS ที่นี่แล้วเพราะเราจัดการใน route.ts

  return NextResponse.next()
}

// กำหนดว่าใช้ middleware กับเส้นทางไหนบ้าง
export const config = {
  matcher: ['/'],
}
