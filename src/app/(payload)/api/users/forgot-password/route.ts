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
    // รับค่าอีเมลจากคำขอ
    const { email } = await req.json()

    // ตรวจสอบว่ามีอีเมลในคำขอหรือไม่
    if (!email) {
      return NextResponse.json(
        { message: 'กรุณาระบุอีเมลที่ต้องการรีเซ็ตรหัสผ่าน' },
        { status: 400 },
      )
    }

    // เชื่อมต่อกับ Payload CMS
    const payload = await getPayloadClient()

    // ตรวจสอบว่ามีผู้ใช้ที่มีอีเมลนี้หรือไม่
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    // ถ้าไม่พบผู้ใช้ ให้ตอบกลับว่าสำเร็จเพื่อความปลอดภัย (ไม่เปิดเผยว่ามีผู้ใช้หรือไม่)
    if (users.totalDocs === 0) {
      return NextResponse.json(
        {
          message: 'หากมีบัญชีอยู่ในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณ',
        },
        { status: 200 },
      )
    }

    // เรียกใช้ forgotPassword API ของ Payload
    const result = await payload.forgotPassword({
      collection: 'users',
      data: {
        email,
      },
      overrideAccess: true,
    })

    // ตอบกลับว่าสำเร็จ
    return NextResponse.json(
      {
        message: 'หากมีบัญชีอยู่ในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณ',
        success: true,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน:', error)

    // ไม่ควรเปิดเผยข้อผิดพลาดที่เกิดขึ้นจริง เพื่อความปลอดภัย
    return NextResponse.json(
      {
        message: 'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน กรุณาลองใหม่ในภายหลัง',
        error: error.message || 'ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้ในขณะนี้',
      },
      { status: 500 },
    )
  }
}
