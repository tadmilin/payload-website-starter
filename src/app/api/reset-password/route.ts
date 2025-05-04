import { NextRequest } from 'next/server'
import { handleOptionsRequest, createJsonResponse, createErrorResponse } from '@/lib/cors'

// จัดการกับ OPTIONS request (CORS preflight)
export function OPTIONS() {
  console.log('[PROXY RESET-PASSWORD] Handling OPTIONS request')
  return handleOptionsRequest()
}

// สำหรับ GET request (debug purposes)
export function GET() {
  console.log('[PROXY RESET-PASSWORD] Handling GET request')
  return createJsonResponse({ message: 'Reset password endpoint is active' })
}

// ฟังก์ชันหลักสำหรับการรีเซ็ตรหัสผ่าน
export async function POST(req: NextRequest) {
  console.log('[PROXY RESET-PASSWORD] Received POST request at', new Date().toISOString())

  try {
    // ตรวจสอบว่ามี Content-Type เป็น application/json
    const contentType = req.headers.get('Content-Type')
    if (!contentType || !contentType.includes('application/json')) {
      console.error('[PROXY RESET-PASSWORD] Invalid Content-Type:', contentType)
      return createErrorResponse('Content-Type must be application/json', 400)
    }

    // อ่านข้อมูลจาก request
    const body = await req.json()
    const { token, password } = body

    console.log('[PROXY RESET-PASSWORD] Token provided:', !!token)
    console.log('[PROXY RESET-PASSWORD] Password provided:', !!password)

    if (!token || !password) {
      console.error('[PROXY RESET-PASSWORD] Missing token or password')
      return createErrorResponse('Token และ password จำเป็นต้องระบุ', 400)
    }

    // สร้าง request ไปยัง Payload API โดยตรง
    console.log('[PROXY RESET-PASSWORD] Preparing request to Payload API')

    const payload = JSON.stringify({ token, password })
    console.log('[PROXY RESET-PASSWORD] Request payload created')

    try {
      // ใช้เส้นทางสัมพัทธ์เพื่อความเรียบง่าย
      const response = await fetch('/api/payload/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      })

      console.log('[PROXY RESET-PASSWORD] Payload API response status:', response.status)

      // อ่านข้อมูลตอบกลับ
      const responseText = await response.text()
      console.log('[PROXY RESET-PASSWORD] Payload API response received')

      // แปลงเป็น JSON ถ้าเป็นไปได้
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch (e) {
        responseData = { message: responseText }
      }

      // ส่งการตอบกลับไปยังไคลเอนต์
      return createJsonResponse(responseData, response.status)
    } catch (apiError) {
      console.error('[PROXY RESET-PASSWORD] API request error:', apiError)
      return createErrorResponse('ไม่สามารถเชื่อมต่อกับ API ได้ กรุณาลองใหม่ภายหลัง', 502)
    }
  } catch (error) {
    // จัดการข้อผิดพลาดที่อาจเกิดขึ้น
    console.error('[PROXY RESET-PASSWORD] Error:', error)

    return createErrorResponse('เกิดข้อผิดพลาดในการประมวลผลคำขอ', 500)
  }
}
