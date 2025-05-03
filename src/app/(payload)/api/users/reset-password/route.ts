import { NextResponse } from 'next/server'
import payload from 'payload'
import { initPayload } from '@/lib/payload'
import type { BasePayload } from 'payload'

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
  // ถ้ามี client ที่พร้อมใช้งานแล้ว ให้ใช้ตัวที่มีอยู่
  if (cached.client) {
    return cached.client
  }

  // ถ้ายังไม่มี promise ในการเริ่มต้น Payload
  if (!cached.promise) {
    cached.promise = (async () => {
      try {
        // ตรวจสอบว่า payload เริ่มต้นแล้วหรือยัง
        if (!payload.db) {
          console.log('Payload ยังไม่ได้เริ่มต้น กำลังเริ่มต้น Payload...')
          // เริ่มต้น Payload ผ่านฟังก์ชัน initPayload
          try {
            await initPayload()
          } catch (initError) {
            console.error('เกิดข้อผิดพลาดในการเริ่มต้น Payload:', initError)
            throw initError
          }
        }

        return payload
      } catch (e) {
        console.error('เกิดข้อผิดพลาดในการเตรียม Payload:', e)
        cached.promise = null
        throw e
      }
    })()
  }

  try {
    cached.client = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.client
}

// ฟังก์ชัน type guard สำหรับ error ที่มี message
function isErrorWithMessage(error: unknown): error is { message: string; stack?: string } {
  return typeof error === 'object' && error !== null && 'message' in error
}

// เพิ่มฟังก์ชัน OPTIONS เพื่อรองรับ CORS preflight requests
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
  console.log('[RESET PASSWORD] เริ่มต้นกระบวนการรีเซ็ตรหัสผ่าน')

  // เตรียม response headers สำหรับ CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  try {
    // รับค่า token และ password จากคำขอ
    const body = await req.json().catch((e) => {
      console.error('[RESET PASSWORD] ไม่สามารถอ่านข้อมูล JSON ได้:', e)
      return {}
    })

    const { token, password } = body

    // --- LOG ข้อมูลสำคัญสำหรับ debug ---
    console.log('[RESET PASSWORD] มี token หรือไม่:', !!token)
    console.log('[RESET PASSWORD] password length:', password ? password.length : 'ไม่มีรหัสผ่าน')

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!token) {
      return NextResponse.json(
        { message: 'กรุณาระบุรหัสสำหรับรีเซ็ตรหัสผ่าน' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (!password) {
      return NextResponse.json(
        { message: 'กรุณาระบุรหัสผ่านใหม่' },
        { status: 400, headers: corsHeaders },
      )
    }

    // decode token อีกครั้งเพื่อความปลอดภัย (รองรับกรณี encode ซ้ำ)
    let decodedToken = token
    try {
      // ถ้า token เป็น encoded URI component, ทำการ decode
      if (token.includes('%')) {
        decodedToken = decodeURIComponent(token)
        console.log('[RESET PASSWORD] token ถูก decode')
      }
    } catch (decodeError) {
      console.error('[RESET PASSWORD] ไม่สามารถ decode token ได้:', decodeError)
      // ใช้ token ดั้งเดิมหากไม่สามารถ decode ได้
    }

    // ตรวจสอบความซับซ้อนของรหัสผ่าน
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { message: 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { message: 'รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { message: 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว' },
        { status: 400, headers: corsHeaders },
      )
    }

    // เชื่อมต่อกับ Payload CMS
    console.log('[RESET PASSWORD] กำลังเชื่อมต่อกับ Payload CMS...')
    const payloadClient = await getPayloadClient()
    console.log('[RESET PASSWORD] เชื่อมต่อกับ Payload CMS สำเร็จ')

    try {
      // --- LOG ก่อนเรียก resetPassword ---
      console.log('[RESET PASSWORD] เรียกใช้ payload.resetPassword...')
      console.log('[RESET PASSWORD] token length:', decodedToken.length)

      // เรียกใช้ resetPassword API ของ Payload
      const result = await payloadClient.resetPassword({
        collection: 'users',
        data: {
          token: decodedToken,
          password,
        },
        overrideAccess: true,
      })

      // --- LOG สำเร็จ ---
      console.log('[RESET PASSWORD] สำเร็จ user:', result.user?.email)

      // ตอบกลับว่าสำเร็จ
      return NextResponse.json(
        {
          message: 'รีเซ็ตรหัสผ่านสำเร็จ',
          success: true,
          user: {
            id: result.user.id,
            email: result.user.email,
          },
        },
        { status: 200, headers: corsHeaders },
      )
    } catch (resetError: unknown) {
      // --- LOG ERROR ---
      console.error('[RESET PASSWORD] ERROR (Payload API):', resetError)
      if (isErrorWithMessage(resetError)) {
        const msg = resetError.message?.toLowerCase() || ''
        if (
          msg.includes('expired') ||
          msg.includes('invalid token') ||
          msg.includes('not found') ||
          msg.includes('jwt') ||
          msg.includes('signature') ||
          msg.includes('malformed')
        ) {
          return NextResponse.json(
            {
              message: 'รหัสสำหรับรีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอรหัสใหม่อีกครั้ง',
              expired: true,
              debug: resetError.message, // เพิ่ม debug message สำหรับ dev
            },
            { status: 400, headers: corsHeaders },
          )
        }
        // กรณี error อื่น ๆ
        return NextResponse.json(
          {
            message: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน',
            error: resetError.message || 'ไม่สามารถรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง',
            debug: resetError.stack || '', // เพิ่ม stack trace สำหรับ dev
          },
          { status: 500, headers: corsHeaders },
        )
      } else {
        // error ไม่ใช่ object หรือไม่มี message
        return NextResponse.json(
          {
            message: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ',
            error: String(resetError),
          },
          { status: 500, headers: corsHeaders },
        )
      }
    }
  } catch (error: unknown) {
    console.error('เกิดข้อผิดพลาดในการประมวลผลคำขอรีเซ็ตรหัสผ่าน:', error)
    if (isErrorWithMessage(error)) {
      return NextResponse.json(
        {
          message: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน',
          error: error.message || 'ไม่สามารถรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง',
          debug: error.stack || '',
        },
        { status: 500, headers: corsHeaders },
      )
    } else {
      return NextResponse.json(
        {
          message: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ',
          error: String(error),
        },
        { status: 500, headers: corsHeaders },
      )
    }
  }
}
