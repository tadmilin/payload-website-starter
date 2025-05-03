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
      return NextResponse.json({ message: 'กรุณาระบุอีเมลที่ต้องการตรวจสอบ' }, { status: 400 })
    }

    // เชื่อมต่อกับ Payload CMS
    const payload = await getPayloadClient()

    // ค้นหาผู้ใช้จากอีเมล
    const result = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      depth: 0,
      limit: 1,
    })

    // ส่งผลลัพธ์กลับไป โดยบอกแค่ว่ามีอีเมลนี้ในระบบหรือไม่ โดยไม่เปิดเผยข้อมูลอื่น
    return NextResponse.json(
      {
        exists: result.totalDocs > 0,
        verified: result.totalDocs > 0 ? result.docs[0]._verified : null,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('เกิดข้อผิดพลาดในการตรวจสอบอีเมล:', error)

    return NextResponse.json(
      {
        message: 'เกิดข้อผิดพลาดในการตรวจสอบอีเมล',
        error: error.message || 'ไม่สามารถตรวจสอบอีเมลได้ในขณะนี้',
      },
      { status: 500 },
    )
  }
}
