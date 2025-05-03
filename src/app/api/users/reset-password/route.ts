import { NextResponse } from 'next/server'

// สำหรับ CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(req: Request) {
  // ล็อกข้อมูลสำคัญ
  console.log(`[API PROXY] Received reset-password request at ${new Date().toISOString()}`)

  try {
    const body = await req.json()

    // รับค่า baseURL จาก environment หรือใช้ค่าเริ่มต้น
    const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

    // เส้นทาง API จริง
    const payloadAPIUrl = `${baseURL}/payload/api/users/reset-password`

    console.log(`[API PROXY] Forwarding to: ${payloadAPIUrl}`)

    // ส่งต่อคำขอไปยัง Payload API
    const response = await fetch(payloadAPIUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    // ล็อกสถานะการตอบกลับ
    console.log(`[API PROXY] Response status: ${response.status}`)

    // รับข้อมูลการตอบกลับ
    const data = await response.json()

    // ส่งข้อมูลการตอบกลับกลับไปยังไคลเอนต์
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('[API PROXY] Error:', error)

    // กรณีเกิดข้อผิดพลาด
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการส่งคำขอรีเซ็ตรหัสผ่าน', error: String(error) },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  }
}
