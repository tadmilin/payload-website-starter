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
    // รับข้อมูล token จาก request body
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { message: 'ไม่พบรหัสยืนยัน กรุณาให้รหัสยืนยันที่ถูกต้อง' },
        { status: 400 },
      )
    }

    console.log('กำลังยืนยันอีเมลด้วย token:', token)

    try {
      // ใช้ payload instance ที่มีอยู่แล้ว
      const payloadClient = await getPayloadClient()

      if (!payloadClient.db) {
        console.error('Payload ยังไม่ได้เริ่มต้น ไม่สามารถยืนยันอีเมลได้')
        return NextResponse.json(
          {
            message: 'ระบบยังไม่พร้อมใช้งาน โปรดลองอีกครั้งในภายหลัง',
            error: 'Payload not initialized',
          },
          { status: 500 },
        )
      }

      console.log('PayloadClient พร้อมใช้งาน:', Boolean(payloadClient.db))

      // ส่งคำขอไปยัง Payload API เพื่อยืนยันอีเมล
      const result = await payloadClient.verifyEmail({
        collection: 'users',
        token,
      })

      console.log('ผลการยืนยันอีเมล:', result)

      // ตรวจสอบผลลัพธ์จากการยืนยันอีเมล
      // รองรับทั้งกรณีที่ result เป็นอ็อบเจ็กต์ที่มี user และกรณีที่เป็น boolean
      if (result === true || result?.user) {
        return NextResponse.json(
          {
            message: 'ยืนยันอีเมลสำเร็จ',
            user: result?.user
              ? {
                  id: result.user.id,
                  email: result.user.email,
                }
              : undefined,
          },
          { status: 200 },
        )
      } else {
        return NextResponse.json(
          { message: 'เกิดข้อผิดพลาดในการยืนยันอีเมล กรุณาลองใหม่อีกครั้ง' },
          { status: 400 },
        )
      }
    } catch (verifyError: any) {
      console.error('เกิดข้อผิดพลาดในการยืนยันอีเมล (Payload API):', verifyError)

      // ถ้าเป็นข้อผิดพลาดที่ token หมดอายุหรือไม่ถูกต้อง
      if (
        verifyError.message?.includes('expired') ||
        verifyError.message?.includes('invalid token') ||
        verifyError.message?.includes('invalid') ||
        verifyError.message?.includes('Verification token is invalid') ||
        verifyError.status === 403
      ) {
        return NextResponse.json(
          {
            message: 'รหัสยืนยันหมดอายุหรือไม่ถูกต้อง กรุณาลงทะเบียนใหม่หรือขอรหัสยืนยันใหม่',
            expired: true,
            error: verifyError.message,
          },
          { status: 400 },
        )
      }

      // ถ้าเป็นข้อผิดพลาดไม่พบคอลเลคชัน
      if (
        verifyError.message?.includes("can't be found") ||
        verifyError.message?.includes('collection')
      ) {
        return NextResponse.json(
          {
            message: 'เกิดข้อผิดพลาดในระบบ: ไม่พบคอลเลคชันผู้ใช้ โปรดติดต่อผู้ดูแลระบบ',
            error: verifyError.message,
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          message: 'เกิดข้อผิดพลาดในการยืนยันอีเมล',
          error: verifyError.message || 'ไม่สามารถยืนยันอีเมลได้ กรุณาลองใหม่อีกครั้ง',
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error('เกิดข้อผิดพลาดในการประมวลผลคำขอ:', error)
    return NextResponse.json(
      {
        message: 'เกิดข้อผิดพลาดในการยืนยันอีเมล',
        error: error.message || 'ไม่สามารถยืนยันอีเมลได้ กรุณาลองใหม่อีกครั้ง',
      },
      { status: 500 },
    )
  }
}
