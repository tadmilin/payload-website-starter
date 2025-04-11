import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './i18n'

function getLocale(request: NextRequest) {
  // ตรวจสอบภาษาจาก cookie ก่อน
  const cookieLocale = request.cookies.get('locale')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  // ถ้าไม่มี cookie ให้ตรวจสอบจาก accept-language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim())
      .find(lang => locales.includes(lang))

    if (preferredLocale) {
      return preferredLocale
    }
  }

  // ถ้าไม่มีอะไรเลยให้ใช้ภาษาเริ่มต้น
  return defaultLocale
}

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

  // ตั้งค่า locale
  const locale = getLocale(request)
  const response = NextResponse.next()
  
  // บันทึก locale ลงใน cookie ถ้ายังไม่มี
  if (!request.cookies.has('locale')) {
    response.cookies.set('locale', locale, { 
      maxAge: 60 * 60 * 24 * 365, // 1 ปี
      path: '/' 
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 