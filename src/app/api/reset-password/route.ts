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
  console.log(
    '[PROXY RESET-PASSWORD] Request Headers:',
    JSON.stringify(
      {
        'content-type': req.headers.get('Content-Type'),
        origin: req.headers.get('Origin'),
        referer: req.headers.get('Referer'),
        'user-agent': req.headers.get('User-Agent'),
        host: req.headers.get('Host'),
        'x-forwarded-for': req.headers.get('X-Forwarded-For'),
        'x-forwarded-host': req.headers.get('X-Forwarded-Host'),
        'x-forwarded-proto': req.headers.get('X-Forwarded-Proto'),
      },
      null,
      2,
    ),
  )

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
    console.log('[PROXY RESET-PASSWORD] Token length:', token ? token.length : 0)
    console.log('[PROXY RESET-PASSWORD] Password provided:', !!password)
    console.log('[PROXY RESET-PASSWORD] Password length:', password ? password.length : 0)

    if (!token || !password) {
      console.error('[PROXY RESET-PASSWORD] Missing token or password')
      return createErrorResponse('Token และ password จำเป็นต้องระบุ', 400)
    }

    // ตรวจสอบความยาวของ token เบื้องต้น
    if (token.length < 10) {
      console.error('[PROXY RESET-PASSWORD] Token too short:', token.length)
      return createErrorResponse('รหัสยืนยันไม่ถูกต้อง กรุณาตรวจสอบลิงก์ในอีเมล', 400)
    }

    // ตรวจสอบความยาวของรหัสผ่าน
    if (password.length < 8) {
      console.error('[PROXY RESET-PASSWORD] Password too short:', password.length)
      return createErrorResponse('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร', 400)
    }

    // สร้าง request ไปยัง Payload API โดยตรง
    console.log('[PROXY RESET-PASSWORD] Preparing request to Payload API')

    const payload = JSON.stringify({ token, password })
    console.log('[PROXY RESET-PASSWORD] Request payload created')

    try {
      // ใช้ absolute URL เพื่อให้แน่ใจว่าทำงานได้ทั้งใน dev และ production
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
      const payloadApiUrl = `${baseUrl}/api/payload/users/reset-password`
      console.log('[PROXY RESET-PASSWORD] Using Payload API URL:', payloadApiUrl)

      // ใช้ fetch แบบมี retry เพื่อความน่าเชื่อถือมากขึ้น
      let retries = 3
      let response

      while (retries > 0) {
        try {
          response = await fetch(payloadApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: payload,
          })
          break // ถ้าไม่มี error ให้หยุด retry
        } catch (error) {
          retries--
          if (retries === 0) throw error // ถ้าหมด retry แล้วให้ throw error
          console.log(`[PROXY RESET-PASSWORD] Retry attempt left: ${retries}`)
          await new Promise((resolve) => setTimeout(resolve, 1000)) // รอ 1 วินาทีก่อน retry
        }
      }

      if (!response) {
        throw new Error('Failed to get response after retries')
      }

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
