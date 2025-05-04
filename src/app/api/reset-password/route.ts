import { NextRequest, NextResponse } from 'next/server'

// CORS headers ที่ต้องการ
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
  'Access-Control-Max-Age': '86400',
}

// สำหรับ OPTIONS requests (CORS preflight)
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  })
}

// สำหรับ GET requests (debug purposes)
export async function GET() {
  return NextResponse.json(
    { message: 'Reset password endpoint is active. Use POST to reset password.' },
    { headers: corsHeaders },
  )
}

// ฟังก์ชัน proxy สำหรับ POST requests
export async function POST(req: NextRequest) {
  console.log('[PROXY] Received reset password request')

  try {
    // อ่านข้อมูลจาก request
    const body = await req.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token และ password จำเป็นต้องระบุ' },
        { status: 400, headers: corsHeaders },
      )
    }

    console.log('[PROXY] Token length:', token.length)
    console.log('[PROXY] Password provided:', !!password)

    // ส่งคำขอต่อไปยัง Payload CMS
    // ใช้ URL แบบเต็มรูปแบบเนื่องจากนี่เป็น server-side code
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const payloadApiUrl = `${baseUrl}/api/payload/users/reset-password`
    console.log('[PROXY] Forwarding to:', payloadApiUrl)

    const payloadResponse = await fetch(payloadApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    })

    // อ่านข้อมูลการตอบกลับจาก Payload
    console.log('[PROXY] Payload response status:', payloadResponse.status)
    const contentType = payloadResponse.headers.get('Content-Type')
    let responseData

    // ถ้าเป็น JSON, อ่านเป็น JSON
    if (contentType && contentType.includes('application/json')) {
      responseData = await payloadResponse.json()
    } else {
      // ถ้าไม่ใช่ JSON, อ่านเป็น text
      responseData = {
        message: await payloadResponse.text(),
      }
    }

    // ส่งการตอบกลับไปยังผู้ใช้พร้อมด้วย CORS headers
    return NextResponse.json(responseData, {
      status: payloadResponse.status,
      headers: corsHeaders,
    })
  } catch (error) {
    console.error('[PROXY] Error processing request:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการประมวลผลคำขอ' },
      { status: 500, headers: corsHeaders },
    )
  }
}
