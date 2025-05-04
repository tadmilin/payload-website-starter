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

  // จัดการ CORS สำหรับทุก API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[Middleware] Request to ${request.url}`)

    // สำหรับ OPTIONS requests ตอบกลับทันที
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    // สำหรับ request อื่นๆ ให้เพิ่ม CORS headers
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, Accept',
    )
    response.headers.set('Access-Control-Max-Age', '86400')

    return response
  }

  return NextResponse.next()
}

// กำหนดว่าใช้ middleware กับเส้นทางไหนบ้าง
export const config = {
  matcher: ['/', '/api/:path*', '/api/payload/:path*'],
}
