import { NextResponse } from 'next/server'

// CORS headers เต็มรูปแบบ
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Api-Key',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true',
}

// จัดการกับ OPTIONS request (CORS preflight)
export async function OPTIONS() {
  console.log('[FRONTEND RESET-PASSWORD] Handling OPTIONS request')
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  })
}

// สำหรับ GET request (ไม่จำเป็นต้องทำอะไรเพิ่มเติม แค่เพิ่ม CORS headers)
export async function GET() {
  console.log('[FRONTEND RESET-PASSWORD] Handling GET request')
  return NextResponse.next()
}
