import { NextResponse } from 'next/server'
import payload from 'payload'
import { initPayload } from '@/lib/payload'
import { corsHeaders, corsMiddleware } from '@/lib/cors'
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
  // --- Log การเรียก getPayloadClient ---
  console.log(`[RESET PASSWORD - getPayloadClient] Function called at ${new Date().toISOString()}`)
  // -----------------------------------

  if (cached.client) {
    // --- Log การคืนค่า client ที่ cached ไว้ ---
    console.log('[RESET PASSWORD - getPayloadClient] Returning cached client')
    // ---------------------------------------
    return cached.client
  }

  if (!cached.promise) {
    // --- Log การสร้าง promise ใหม่ ---
    console.log('[RESET PASSWORD - getPayloadClient] Creating new payload promise')
    // -------------------------------
    cached.promise = (async () => {
      try {
        if (!payload.db) {
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

// เพิ่ม GET handler เพื่อแก้ไขปัญหา 404
export async function GET(req: NextRequest) {
  console.log(`[RESET PASSWORD] Received GET request at ${new Date().toISOString()}`)
  console.log(`[RESET PASSWORD] Request URL: ${req.url}`)
  console.log(`[RESET PASSWORD] Request Headers Origin: ${req.headers.get('Origin')}`)

  return corsMiddleware(req, NextResponse.next(), async () => {
    // ตอบกลับด้วย 200 OK
    return new NextResponse(
      JSON.stringify({
        message: 'Reset password API endpoint is active',
        note: 'Please use POST method to reset password',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  })
}

// เพิ่มฟังก์ชัน OPTIONS เพื่อรองรับ CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  console.log(`[RESET PASSWORD] Received OPTIONS request at ${new Date().toISOString()}`)
  console.log(`[RESET PASSWORD] Request URL: ${req.url}`)
  console.log(`[RESET PASSWORD] Request Headers Origin: ${req.headers.get('Origin')}`)

  return corsMiddleware(req, NextResponse.next(), async () => {
    return new NextResponse(null, { status: 200 })
  })
}

export async function POST(req: NextRequest) {
  // --- Log จุดเริ่มต้น ---
  console.log(`[RESET PASSWORD] Received POST request at ${new Date().toISOString()}`)
  console.log(`[RESET PASSWORD] Request URL: ${req.url}`)
  console.log(`[RESET PASSWORD] Request Headers Content-Type: ${req.headers.get('Content-Type')}`)
  console.log(`[RESET PASSWORD] Request Headers Origin: ${req.headers.get('Origin')}`)
  // --- สิ้นสุด Log จุดเริ่มต้น ---

  return corsMiddleware(req, NextResponse.next(), async () => {
    console.log('[RESET PASSWORD] เริ่มต้นกระบวนการรีเซ็ตรหัสผ่าน')

    try {
      // รับค่า token และ password จากคำขอ
      const body = await req.json().catch((e) => {
        console.error('[RESET PASSWORD] ไม่สามารถอ่านข้อมูล JSON ได้:', e)
        return {}
      })

      const { token, password } = body

      // --- LOG ข้อมูลสำคัญสำหรับ debug ---
      console.log('[RESET PASSWORD] มี token หรือไม่:', !!token)
      console.log('[RESET PASSWORD] token length:', token ? token.length : 'undefined')
      if (token)
        console.log('[RESET PASSWORD] token (first 10 chars):', token.substring(0, 10) + '...')
      console.log('[RESET PASSWORD] password length:', password ? password.length : 'ไม่มีรหัสผ่าน')

      // ตรวจสอบข้อมูลที่จำเป็น
      if (!token) {
        return new NextResponse(JSON.stringify({ message: 'กรุณาระบุรหัสสำหรับรีเซ็ตรหัสผ่าน' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      if (!password) {
        return new NextResponse(JSON.stringify({ message: 'กรุณาระบุรหัสผ่านใหม่' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // ตรวจสอบความซับซ้อนของรหัสผ่าน
      if (password.length < 8) {
        return new NextResponse(
          JSON.stringify({ message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        )
      }

      if (!/[A-Z]/.test(password)) {
        return new NextResponse(
          JSON.stringify({ message: 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        )
      }

      if (!/[a-z]/.test(password)) {
        return new NextResponse(
          JSON.stringify({ message: 'รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        )
      }

      if (!/[0-9]/.test(password)) {
        return new NextResponse(
          JSON.stringify({ message: 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        )
      }

      // เชื่อมต่อกับ Payload CMS
      console.log('[RESET PASSWORD] กำลังเชื่อมต่อกับ Payload CMS...')
      const payloadClient = await getPayloadClient()
      console.log('[RESET PASSWORD] เชื่อมต่อกับ Payload CMS สำเร็จ')

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
          return new NextResponse(
            JSON.stringify({
              message: 'รหัสสำหรับรีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอรหัสใหม่อีกครั้ง',
              expired: true,
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
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
            return new NextResponse(
              JSON.stringify({
                message: 'รหัสสำหรับรีเซ็ตรหัสผ่านหมดอายุแล้ว กรุณาขอรหัสใหม่อีกครั้ง',
                expired: true,
              }),
              { status: 400, headers: { 'Content-Type': 'application/json' } },
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
        return new NextResponse(
          JSON.stringify({
            message: 'รีเซ็ตรหัสผ่านสำเร็จ',
            success: true,
            user: { email: result.user?.email },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        )
      } catch (resetError) {
        console.error('[RESET PASSWORD] เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน:', resetError)

        let errorMessage = 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน'
        let status = 500

        // จัดการกับข้อผิดพลาดเฉพาะ
        if (isErrorWithMessage(resetError)) {
          console.error('[RESET PASSWORD] Error message:', resetError.message)
          console.error('[RESET PASSWORD] Error stack:', resetError.stack || 'No stack trace')

          if (
            resetError.message.includes('Invalid token') ||
            resetError.message.includes('expired')
          ) {
            errorMessage =
              'รหัสสำหรับรีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอรหัสใหม่อีกครั้ง'
            status = 400
          }
        }

        return new NextResponse(JSON.stringify({ message: errorMessage }), {
          status,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    } catch (error) {
      console.error('[RESET PASSWORD] เกิดข้อผิดพลาดทั่วไป:', error)

      // ไม่ควรเปิดเผยข้อผิดพลาดที่เกิดขึ้นจริง เพื่อความปลอดภัย
      return new NextResponse(
        JSON.stringify({
          message: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน กรุณาลองใหม่ในภายหลัง',
          error:
            typeof error === 'object' && error !== null && 'message' in error
              ? (error as { message: string }).message
              : 'ไม่สามารถรีเซ็ตรหัสผ่านได้ในขณะนี้',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }
  })
}
