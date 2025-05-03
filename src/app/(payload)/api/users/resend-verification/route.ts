import { NextResponse } from 'next/server'
import payload from 'payload'
import { initPayload } from '@/lib/payload'
import crypto from 'crypto'

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

// ฟังก์ชันสร้าง verification token
function generateVerificationToken() {
  return crypto.randomBytes(20).toString('hex')
}

export async function POST(req: Request) {
  try {
    // รับอีเมลจาก request body
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ message: 'กรุณาระบุอีเมล' }, { status: 400 })
    }

    console.log('กำลังขอส่งอีเมลยืนยันใหม่สำหรับ:', email)

    try {
      // ใช้ payload instance
      const payloadClient = await getPayloadClient()

      if (!payloadClient.db) {
        console.error('Payload ยังไม่ได้เริ่มต้น ไม่สามารถดำเนินการได้')
        return NextResponse.json(
          {
            message: 'ระบบยังไม่พร้อมใช้งาน โปรดลองอีกครั้งในภายหลัง',
            error: 'Payload not initialized',
          },
          { status: 500 },
        )
      }

      // ค้นหาผู้ใช้ด้วยอีเมล
      const { docs: users } = await payloadClient.find({
        collection: 'users',
        where: {
          email: {
            equals: email,
          },
        },
      })

      if (users.length === 0) {
        return NextResponse.json({ message: 'ไม่พบผู้ใช้งานที่ใช้อีเมลนี้' }, { status: 404 })
      }

      const user = users[0]

      // สร้าง verification token ใหม่
      const verificationToken = generateVerificationToken()

      // อัปเดต user ด้วย verification token ใหม่
      await payloadClient.update({
        collection: 'users',
        id: user.id,
        data: {
          _verificationToken: verificationToken,
        },
      })

      // สร้าง URL สำหรับการยืนยัน
      const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
      const verificationURL = `${baseURL}/verify-email?token=${verificationToken}`

      // สร้างเนื้อหาอีเมล HTML
      const html = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #01121f; color: white;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #0078ff;">☀️ SOLARLAA</h1>
              </div>
              <div style="background-color: #0a1925; padding: 20px; border-radius: 5px;">
                <h2 style="color: #0078ff;">ยืนยันอีเมลของคุณ</h2>
                <p>สวัสดี ${user.firstName || ''} ${user.lastName || ''},</p>
                <p>คุณได้ขอให้ส่งอีเมลยืนยันใหม่ โปรดคลิกลิงก์ด้านล่างเพื่อยืนยันอีเมลของคุณ</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationURL}" style="background-color: #0078ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">ยืนยันอีเมลของฉัน</a>
                </div>
                <p>หรือคัดลอกและวางลิงก์นี้ในเบราว์เซอร์ของคุณ:</p>
                <p style="word-break: break-all; color: #0078ff;"><a href="${verificationURL}" style="color: #0078ff;">${verificationURL}</a></p>
                <p>Token ของคุณ: <span style="font-family: monospace; font-weight: bold; background-color: #203040; padding: 2px 5px; border-radius: 3px;">${verificationToken}</span></p>
                <p>ลิงก์นี้จะหมดอายุใน 2 ชั่วโมง</p>
                <p>หากคุณไม่ได้ขอให้ส่งอีเมลนี้ คุณสามารถละเว้นอีเมลนี้ได้</p>
              </div>
              <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #ccc;">
                <p>© ${new Date().getFullYear()} SOLARLAA. สงวนลิขสิทธิ์ทั้งหมด.</p>
              </div>
            </div>
          </body>
        </html>
      `

      // ส่งอีเมลยืนยัน
      await payloadClient.sendEmail({
        from: process.env.EMAIL_FROM || 'noreply@solarlaa.com',
        to: email,
        subject: '[SOLARLAA] ยืนยันอีเมลของคุณ',
        html,
      })

      return NextResponse.json(
        {
          message: 'ส่งอีเมลยืนยันใหม่เรียบร้อยแล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ',
        },
        { status: 200 },
      )
    } catch (error: any) {
      console.error('เกิดข้อผิดพลาดในการขอส่งอีเมลยืนยันใหม่:', error)

      // ถ้ามีข้อความเฉพาะจาก Payload
      if (error.message) {
        return NextResponse.json(
          {
            message: 'ไม่สามารถส่งอีเมลยืนยันได้',
            error: error.message,
          },
          { status: 400 },
        )
      }

      return NextResponse.json(
        {
          message: 'เกิดข้อผิดพลาดในการขอส่งอีเมลยืนยันใหม่ โปรดลองอีกครั้งในภายหลัง',
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error('เกิดข้อผิดพลาดในการประมวลผลคำขอ:', error)
    return NextResponse.json(
      {
        message: 'เกิดข้อผิดพลาดในการขอส่งอีเมลยืนยันใหม่',
        error: error.message || 'ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง',
      },
      { status: 500 },
    )
  }
}
