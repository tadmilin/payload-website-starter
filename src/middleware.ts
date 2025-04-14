import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { limiter } from '@/middleware/rateLimit'

// Middleware สำหรับ Next.js
export async function middleware(request: NextRequest) {
  // ปิดการใช้งาน rate limit ชั่วคราวเพื่อแก้ปัญหาการ deploy บน Vercel
  // เนื่องจาก express-rate-limit ไม่รองรับใน Edge Runtime

  // ส่ง response ให้ดำเนินการต่อไป
  return NextResponse.next()
}

// กำหนดว่าจะใช้ middleware กับ route ไหนบ้าง
export const config = {
  matcher: [
    '/api/:path*',
    '/admin/api/:path*',
  ],
}