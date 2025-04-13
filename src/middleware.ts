import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './utils/minimal-i18n'

// อะเรย์สำหรับเก็บข้อมูล IP และการเข้าถึง
const ipRequests: {
  [key: string]: {
    count: number;
    lastReset: number;
  }
} = {}

// ระยะเวลาในการรีเซ็ตนับใหม่ (2 นาที)
const WINDOW_MS = 2 * 60 * 1000
// จำนวนคำขอสูงสุดต่อ IP
const MAX_REQUESTS = 2400

export function middleware(request: NextRequest) {
  // Rate limiting
  const ip = request.ip || 'unknown'
  
  // สร้างข้อมูลใหม่ถ้ายังไม่มี
  if (!ipRequests[ip]) {
    ipRequests[ip] = {
      count: 0,
      lastReset: Date.now(),
    }
  }
  
  // ตรวจสอบว่าถึงเวลารีเซ็ตหรือไม่
  const now = Date.now()
  if (now - ipRequests[ip].lastReset > WINDOW_MS) {
    ipRequests[ip].count = 0
    ipRequests[ip].lastReset = now
  }
  
  // เพิ่มจำนวนคำขอ
  ipRequests[ip].count++
  
  // ตรวจสอบว่าเกินกำหนดหรือไม่
  if (ipRequests[ip].count > MAX_REQUESTS) {
    return new NextResponse('Too many requests', {
      status: 429,
      headers: {
        'Retry-After': Math.ceil(WINDOW_MS / 1000).toString(),
      },
    })
  }

  // i18n logic
  const pathname = request.nextUrl.pathname
  
  // ไม่ใช้กับไฟล์ static หรือ API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // ตรวจสอบ cookie ภาษา
  const localeCookie = request.cookies.get('locale')
  const locale = localeCookie?.value

  // ถ้ามี cookie และเป็นภาษาที่รองรับ
  if (locale && locales.includes(locale)) {
    // ไม่ต้องทำอะไร เพราะเราใช้ cookie อยู่แล้ว
    return NextResponse.next()
  }

  // ถ้าไม่มี cookie ให้ตั้งค่าเป็นภาษาเริ่มต้น
  const response = NextResponse.next()
  response.cookies.set('locale', defaultLocale)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 