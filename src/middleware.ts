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
  
  // มิฉะนั้น ปล่อยให้เป็นไปตามปกติ
  return NextResponse.next()
}

// กำหนดว่าจะใช้ middleware กับ route ไหนบ้าง
export const config = {
  matcher: ['/'],
}