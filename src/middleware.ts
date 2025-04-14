import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { limiter } from '@/middleware/rateLimit'

// Middleware สำหรับ Next.js
export async function middleware(request: NextRequest) {
  // ตรวจสอบว่าเป็น route ที่เราต้องการใช้ rate limit หรือไม่
  // ตัวอย่างเช่น API route หรือ route ที่มีการส่งข้อมูล
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Next.js middleware ไม่สามารถใช้งาน express middleware ได้โดยตรง
    // ต้องประยุกต์ใช้ตามลักษณะการทำงานของ express-rate-limit

    // สร้าง key สำหรับระบุ IP
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'anonymous'
    
    try {
      // ใช้งาน rate limiter โดยสร้าง key จาก IP
      const key = `${ip}:${request.nextUrl.pathname}`
      const limited = await limiter.get(request, { key })
      
      // ถ้าเกินขีดจำกัด
      if (limited === false) {
        return new NextResponse(
          JSON.stringify({ 
            success: false, 
            message: 'มีการร้องขอมากเกินไป กรุณาลองใหม่ในภายหลัง'
          }),
          { 
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '120', // ลองใหม่ในอีก 2 นาที
            },
          }
        )
      }
    } catch (error) {
      console.error('Rate limit error:', error)
    }
  }

  // ถ้าไม่มีการจำกัด หรือไม่ได้เกินขีดจำกัด ให้ดำเนินการต่อไป
  return NextResponse.next()
}

// กำหนดว่าจะใช้ middleware กับ route ไหนบ้าง
export const config = {
  matcher: [
    '/api/:path*',
    '/admin/api/:path*',
  ],
}