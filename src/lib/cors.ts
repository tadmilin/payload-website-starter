import NextCors from 'next-cors'
import type { NextRequest, NextResponse } from 'next/server'

// ฟังก์ชันสำหรับจัดการ CORS ใน API routes
export const corsMiddleware = async (
  req: NextRequest,
  res: NextResponse,
  callback: () => Promise<NextResponse>,
) => {
  // กำหนดค่า CORS options
  return await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    origin: '*',
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })

  // ทำงานต่อหลังจากจัดการ CORS
  return callback()
}

// Header สำหรับ CORS ที่ใช้แบบ manual
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
  'Access-Control-Max-Age': '86400',
}
