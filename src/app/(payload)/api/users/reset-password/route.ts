import { NextResponse } from 'next/server'
import payload from 'payload'
import { initPayload } from '@/lib/payload'
import { corsHeaders } from '@/lib/cors'
import type { BasePayload } from 'payload'
import type { NextRequest } from 'next/server'

// ขยาย type ให้ global object เพื่อรองรับ payload
declare global {
  // eslint-disable-next-line no-var
  var payload: { client: BasePayload | null; promise: Promise<BasePayload> | null } | undefined
}

// เตรียม Payload client สำหรับใช้งาน
let cached = global.payload

if (!cached) {
  cached = global.payload = { client: null, promise: null }
}

// ฟังก์ชันเพื่อให้มั่นใจว่าเรามี payload instance ที่พร้อมใช้งาน
async function getPayloadClient() {
  console.log(`[RESET PASSWORD - getPayloadClient] Function called at ${new Date().toISOString()}`)

  if (cached?.client) {
    console.log('[RESET PASSWORD - getPayloadClient] Returning cached client')
    return cached.client
  }

  if (!cached?.promise) {
    console.log('[RESET PASSWORD - getPayloadClient] Creating new payload promise')
    cached.promise = (async () => {
      try {
        if (!payload?.db) {
          console.log(
            '[RESET PASSWORD - getPayloadClient] Payload DB not found, calling initPayload...',
          )
          try {
            await initPayload()
            console.log('[RESET PASSWORD - getPayloadClient] initPayload completed successfully')
          } catch (initError) {
            console.error(
              '[RESET PASSWORD - getPayloadClient] Error during initPayload:',
              initError,
            )
            throw initError
          }
        }
        console.log('[RESET PASSWORD - getPayloadClient] Returning payload from promise')
        return payload
      } catch (e) {
        console.error('[RESET PASSWORD - getPayloadClient] Error creating payload promise:', e)
        cached.promise = null
        throw e
      }
    })()
  }

  try {
    console.log('[RESET PASSWORD - getPayloadClient] Awaiting payload promise...')
    cached.client = await cached.promise
    console.log('[RESET PASSWORD - getPayloadClient] Payload promise resolved, client is ready.')
  } catch (e) {
    console.error('[RESET PASSWORD - getPayloadClient] Error resolving payload promise:', e)
    cached.promise = null
    throw e
  }

  return cached.client
}

// ฟังก์ชัน type guard สำหรับ error ที่มี message
function isErrorWithMessage(error: unknown): error is { message: string; stack?: string } {
  return typeof error === 'object' && error !== null && 'message' in error
}

// ฟังก์ชันช่วยสำหรับการสร้าง response ที่มี CORS headers
function createCorsResponse(body: any, status: number = 200) {
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  })
}

// เพิ่ม GET handler เพื่อแก้ไขปัญหา 404
export async function GET(req: NextRequest) {
  console.log(`[RESET PASSWORD] Received GET request at ${new Date().toISOString()}`)
  console.log(`[RESET PASSWORD] Request URL: ${req.url}`)
  console.log(`[RESET PASSWORD] Request Headers Origin: ${req.headers.get('Origin')}`)

  // ตอบกลับด้วย 200 OK พร้อม CORS headers
  return createCorsResponse({
    message: 'Reset password API endpoint is active',
    note: 'Please use POST method to reset password',
  })
}

// เพิ่มฟังก์ชัน OPTIONS เพื่อรองรับ CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  console.log(`[RESET PASSWORD] Received OPTIONS request at ${new Date().toISOString()}`)
  console.log(`[RESET PASSWORD] Request URL: ${req.url}`)
  console.log(`[RESET PASSWORD] Request Headers Origin: ${req.headers.get('Origin')}`)

  // สำหรับ OPTIONS request ให้ตอบกลับทันทีโดยไม่ต้องทำอะไรเพิ่มเติม
  return createCorsResponse(null)
}

export async function POST(req: NextRequest) {
  // --- Log จุดเริ่มต้น ---
  console.log(`[RESET PASSWORD] Received POST request at ${new Date().toISOString()}`)
  console.log(`[RESET PASSWORD] Request URL: ${req.url}`)
  console.log(`[RESET PASSWORD] Request Headers Content-Type: ${req.headers.get('Content-Type')}`)
  console.log(`[RESET PASSWORD] Request Headers Origin: ${req.headers.get('Origin')}`)
  // --- สิ้นสุด Log จุดเริ่มต้น ---

  console.log('[RESET PASSWORD] เริ่มต้นกระบวนการรีเซ็ตรหัสผ่าน')

  try {
    // รับค่า token และ password จาก request body
    let body
    try {
      body = await req.json()
      console.log('[RESET PASSWORD] อ่านข้อมูล JSON สำเร็จ')
    } catch (e) {
      console.error('[RESET PASSWORD] ไม่สามารถอ่านข้อมูล JSON ได้:', e)
      return createCorsResponse(
        { message: 'รูปแบบข้อมูลไม่ถูกต้อง กรุณาส่งข้อมูลในรูปแบบ JSON' },
        400,
      )
    }

    const { token, password } = body

    // --- LOG ข้อมูลสำคัญสำหรับ debug ---
    console.log('[RESET PASSWORD] มี token หรือไม่:', !!token)
    console.log('[RESET PASSWORD] token length:', token ? token.length : 'undefined')
    if (token)
      console.log('[RESET PASSWORD] token (first 10 chars):', token.substring(0, 10) + '...')
    console.log('[RESET PASSWORD] password length:', password ? password.length : 'ไม่มีรหัสผ่าน')

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!token) {
      return createCorsResponse({ message: 'กรุณาระบุรหัสสำหรับรีเซ็ตรหัสผ่าน' }, 400)
    }

    if (!password) {
      return createCorsResponse({ message: 'กรุณาระบุรหัสผ่านใหม่' }, 400)
    }

    // ตรวจสอบความซับซ้อนของรหัสผ่าน
    if (password.length < 8) {
      return createCorsResponse({ message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' }, 400)
    }

    if (!/[A-Z]/.test(password)) {
      return createCorsResponse({ message: 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว' }, 400)
    }

    if (!/[a-z]/.test(password)) {
      return createCorsResponse({ message: 'รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว' }, 400)
    }

    if (!/[0-9]/.test(password)) {
      return createCorsResponse({ message: 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว' }, 400)
    }

    // เชื่อมต่อกับ Payload CMS
    console.log('[RESET PASSWORD] กำลังเชื่อมต่อกับ Payload CMS...')
    let payloadClient
    try {
      payloadClient = await getPayloadClient()
      console.log('[RESET PASSWORD] เชื่อมต่อกับ Payload CMS สำเร็จ')
    } catch (error) {
      console.error('[RESET PASSWORD] ไม่สามารถเชื่อมต่อกับ Payload CMS ได้:', error)
      return createCorsResponse(
        { message: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ กรุณาลองใหม่อีกครั้ง' },
        500,
      )
    }

    try {
      // --- LOG ก่อนเรียก resetPassword ---
      console.log('[RESET PASSWORD] เรียกใช้ payload.resetPassword...')
      console.log('[RESET PASSWORD] token length:', token.length)

      // ค้นหา collection users ก่อน เพื่อตรวจสอบว่ามี user ที่มี resetPasswordToken ตรงกับ token ที่ส่งมาหรือไม่
      console.log('[RESET PASSWORD] ค้นหา user ที่มี resetPasswordToken ตรงกับ token')
      const usersWithToken = await payloadClient.find({
        collection: 'users',
        where: {
          resetPasswordToken: {
            equals: token,
          },
        },
        limit: 1,
      })

      if (usersWithToken.totalDocs === 0) {
        console.log('[RESET PASSWORD] ไม่พบ user ที่มี resetPasswordToken ตรงกับ token')
        return createCorsResponse(
          {
            message: 'รหัสสำหรับรีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอรหัสใหม่อีกครั้ง',
            expired: true,
          },
          400,
        )
      }

      const user = usersWithToken.docs[0]
      console.log('[RESET PASSWORD] พบ user ที่มี resetPasswordToken:', user.email)

      // ตรวจสอบว่า token หมดอายุหรือไม่
      if (user.resetPasswordExpiration) {
        const expirationDate = new Date(user.resetPasswordExpiration)
        const now = new Date()
        if (expirationDate < now) {
          console.log('[RESET PASSWORD] token หมดอายุแล้ว')
          return createCorsResponse(
            {
              message: 'รหัสสำหรับรีเซ็ตรหัสผ่านหมดอายุแล้ว กรุณาขอรหัสใหม่อีกครั้ง',
              expired: true,
            },
            400,
          )
        }
      }

      // เรียกใช้ resetPassword API ของ Payload
      const result = await payloadClient.resetPassword({
        collection: 'users',
        data: {
          token,
          password,
        },
        overrideAccess: true,
      })

      // --- LOG สำเร็จ ---
      console.log('[RESET PASSWORD] สำเร็จ user:', result.user?.email)

      // ตอบกลับว่าสำเร็จ
      return createCorsResponse({
        message: 'รีเซ็ตรหัสผ่านสำเร็จ',
        success: true,
        user: { email: result.user?.email },
      })
    } catch (resetError) {
      console.error('[RESET PASSWORD] เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน:', resetError)

      let errorMessage = 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน'
      let status = 500

      // ตรวจสอบข้อผิดพลาดที่เฉพาะเจาะจงมากขึ้น
      if (isErrorWithMessage(resetError)) {
        // กรณีพบข้อความว่า token ไม่ถูกต้องหรือหมดอายุ
        if (
          resetError.message.includes('token') &&
          (resetError.message.includes('invalid') ||
            resetError.message.includes('expire') ||
            resetError.message.includes('not found'))
        ) {
          errorMessage = 'รหัสสำหรับรีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอรหัสใหม่อีกครั้ง'
          status = 400
        }
      }

      return createCorsResponse({ message: errorMessage, error: true }, status)
    }
  } catch (error) {
    console.error('[RESET PASSWORD] เกิดข้อผิดพลาดที่ไม่คาดคิด:', error)

    // ข้อความแสดงข้อผิดพลาดที่เป็นมิตรต่อผู้ใช้
    return createCorsResponse(
      { message: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ' },
      500,
    )
  }
}
