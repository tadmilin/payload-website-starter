import type { NextRequest, NextResponse } from 'next/server'

// CORS headers ที่ครบถ้วนสำหรับการใช้งานทั่วไป
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Api-Key, X-CSRF-Token, X-Auth-Token, Cache-Control, Pragma',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true',
  // เพิ่ม headers เพื่อป้องกันการถูก cache โดย browsers
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
  'Surrogate-Control': 'no-store',
}

// ฟังก์ชันสำหรับเพิ่ม CORS headers ใน response
export function addCorsHeaders(response: Response): Response {
  // คัดลอก response เพื่อไม่เปลี่ยนแปลง response ต้นฉบับ
  const newResponse = new Response(response.body, response)

  // เพิ่ม CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newResponse.headers.set(key, value)
  })

  return newResponse
}

// ฟังก์ชันสร้าง response สำหรับ OPTIONS request (CORS preflight)
export function handleOptionsRequest(): Response {
  return new Response(null, {
    status: 204, // No Content คือสถานะที่เหมาะสมสำหรับ OPTIONS response
    headers: corsHeaders,
  })
}

// ฟังก์ชันสร้าง response สำหรับ error ที่มี CORS headers
export function createErrorResponse(message: string, status: number = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  })
}

// ฟังก์ชันสร้าง JSON response ที่มี CORS headers
export function createJsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  })
}

// middleware สำหรับ API routes
export const corsMiddleware = async (
  req: NextRequest,
  res: NextResponse,
  callback: () => Promise<NextResponse>,
) => {
  // สำหรับ OPTIONS request
  if (req.method?.toLowerCase() === 'options') {
    return handleOptionsRequest()
  }

  // ดำเนินการตาม callback
  const response = await callback()

  // เพิ่ม CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}
