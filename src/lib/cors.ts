import type { NextRequest, NextResponse } from 'next/server'

// ฟังก์ชันสำหรับจัดการ CORS ใน API routes
export const corsMiddleware = async (
  req: NextRequest,
  res: NextResponse,
  callback: () => Promise<NextResponse>,
) => {
  // ทำงานหลักที่ต้องการ
  const response = await callback()

  // เพิ่ม CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
  )
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept',
  )
  response.headers.set('Access-Control-Max-Age', '86400')

  // จัดการกับ OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  return response
}

// Header สำหรับ CORS ที่ใช้แบบ manual
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
  'Access-Control-Max-Age': '86400',
}
