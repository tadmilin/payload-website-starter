import { NextRequest, NextResponse } from 'next/server'
// import { limiter } from '@/middleware/rateLimit'

// Middleware สำหรับ Next.js
export function middleware(request: NextRequest) {
  // ปิดการใช้งาน rate limit ชั่วคราวเพื่อแก้ปัญหาการ deploy บน Vercel
  // เนื่องจาก express-rate-limit ไม่รองรับใน Edge Runtime

  // ถ้าเป็น path หลัก ให้ redirect ไปที่ /home
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // ดักจับเฉพาะ request ที่มีปลายทางเป็น API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // ดึง origin ของ request
    const origin = request.headers.get('origin') || '*'

    console.log(`[Middleware] Processing request to ${request.url} from origin: ${origin}`)

    // สร้าง response object ใหม่
    const response = NextResponse.next()

    // เพิ่ม CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, Accept',
    )
    response.headers.set('Access-Control-Max-Age', '86400')

    // ตอบสนองกับ OPTIONS request โดยตรง
    if (request.method === 'OPTIONS') {
      console.log(`[Middleware] Responding to OPTIONS request from ${origin}`)
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

    return response
  }

  // มิฉะนั้น ปล่อยให้เป็นไปตามปกติ
  return NextResponse.next()
}

// กำหนดว่าจะใช้ middleware กับ route ไหนบ้าง
export const config = {
  matcher: ['/', '/api/:path*'],
}
