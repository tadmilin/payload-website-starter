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
  // เพิ่ม CORS headers เมื่อเป็น API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // สำหรับ OPTIONS requests (preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers':
            'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Api-Key',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    // สำหรับ request อื่นๆ ให้ดำเนินการต่อไป
    const response = NextResponse.next()

    // เพิ่ม CORS headers
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Api-Key',
    )

    return response
  }

  return NextResponse.next()
}

// กำหนดว่าใช้ middleware กับเส้นทางไหนบ้าง
export const config = {
  matcher: ['/', '/api/:path*', '/api/reset-password'],
}
