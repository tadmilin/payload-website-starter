import { NextResponse } from 'next/server'
import payload from 'payload'
import { initPayload } from '@/lib/payload'

// เตรียม Payload client สำหรับใช้งาน
let cached = (global as any).payload

if (!cached) {
  cached = (global as any).payload = { client: null, promise: null }
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

export async function POST(req: Request) {
  try {
    // รับค่า token และ password จากคำขอ
    const { token, password } = await req.json()

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!token) {
      return NextResponse.json({ message: 'กรุณาระบุรหัสสำหรับรีเซ็ตรหัสผ่าน' }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ message: 'กรุณาระบุรหัสผ่านใหม่' }, { status: 400 })
    }

    // ตรวจสอบความซับซ้อนของรหัสผ่าน
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' },
        { status: 400 },
      )
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { message: 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว' },
        { status: 400 },
      )
    }

    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { message: 'รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว' },
        { status: 400 },
      )
    }

    if (!/[0-9]/.test(password)) {
      return NextResponse.json({ message: 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว' }, { status: 400 })
    }

    // เชื่อมต่อกับ Payload CMS
    const payload = await getPayloadClient()

    try {
      // เรียกใช้ resetPassword API ของ Payload
      const result = await payload.resetPassword({
        collection: 'users',
        data: {
          token,
          password,
        },
        overrideAccess: true,
      })

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
        { status: 200 },
      )
    } catch (resetError: any) {
      console.error('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน (Payload API):', resetError)

      // ตรวจสอบข้อผิดพลาดเฉพาะ
      if (
        resetError.message?.includes('expired') ||
        resetError.message?.includes('invalid token') ||
        resetError.message?.includes('not found')
      ) {
        return NextResponse.json(
          {
            message: 'รหัสสำหรับรีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอรหัสใหม่อีกครั้ง',
            expired: true,
          },
          { status: 400 },
        )
      }

      return NextResponse.json(
        {
          message: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน',
          error: resetError.message || 'ไม่สามารถรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง',
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error('เกิดข้อผิดพลาดในการประมวลผลคำขอรีเซ็ตรหัสผ่าน:', error)

    return NextResponse.json(
      {
        message: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน',
        error: error.message || 'ไม่สามารถรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง',
      },
      { status: 500 },
    )
  }
}
