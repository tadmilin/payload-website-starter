import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './utils/minimal-i18n'

export function middleware(request: NextRequest) {
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