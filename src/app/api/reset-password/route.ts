/**
 * API route สำหรับการ reset password
 */
import { type NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { withCors } from '@/lib/cors'
import { ApiError } from '@/lib/api-helpers'

/**
 * สำหรับตรวจสอบว่ารหัสผ่านใหม่ถูกต้องตามหลักเกณฑ์หรือไม่
 */
function validatePassword(password: string): boolean {
  // ตรวจสอบความยาวของรหัสผ่าน (อย่างน้อย 8 ตัวอักษร)
  if (password.length < 8) {
    return false
  }
  
  // ตรวจสอบว่ามีทั้งตัวพิมพ์ใหญ่และตัวพิมพ์เล็ก
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  
  // ตรวจสอบว่ามีตัวเลข
  const hasNumber = /[0-9]/.test(password)
  
  // ตรวจสอบว่ามีอักขระพิเศษ
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
}

/**
 * POST handler สำหรับการรีเซ็ตรหัสผ่าน
 */
async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()
    
    // ตรวจสอบว่ามี token และ password หรือไม่
    if (!token || !password) {
      throw new ApiError('Token และรหัสผ่านใหม่จำเป็นต้องระบุ', 400)
    }
    
    // ตรวจสอบรหัสผ่านใหม่
    if (!validatePassword(password)) {
      throw new ApiError(
        'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ',
        400
      )
    }
    
    // เชื่อมต่อกับ Payload CMS
    const payload = await getPayload({ config: configPromise })
    
    // ดำเนินการรีเซ็ตรหัสผ่าน
    try {
      await payload.resetPassword({
        collection: 'users',
        data: {
          token,
          password,
        },
        overrideAccess: true,
      })
      
      return Response.json({
        success: true,
        message: 'รีเซ็ตรหัสผ่านสำเร็จ'
      }, { status: 200 })
    } catch (error) {
      console.error('Reset password error:', error)
      
      // จัดการกับข้อผิดพลาดจาก Payload
      if (error instanceof Error) {
        throw new ApiError(error.message, 400)
      }
      
      throw new ApiError('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน', 500)
    }
  } catch (error) {
    console.error('API error:', error)
    
    if (error instanceof ApiError) {
      return Response.json({
        success: false,
        message: error.message
      }, { status: error.status })
    }
    
    return Response.json({
      success: false,
      message: 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
    }, { status: 500 })
  }
}

// ส่งออก handler พร้อมกับการจัดการ CORS
export { POST }

// แปลง handler เพื่อจัดการ CORS
export const GET = withCors(async (request: NextRequest) => {
  return Response.json({
    message: 'Endpoint นี้รองรับเฉพาะ POST method'
  }, { status: 405 })
})

// Export handler สำหรับ OPTIONS request (preflight)
export const OPTIONS = withCors((request: NextRequest) => {
  return new Response(null, { status: 204 })
})
