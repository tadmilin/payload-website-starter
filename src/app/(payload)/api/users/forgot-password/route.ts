import { NextResponse } from 'next/server'
import payload from 'payload'
import { initPayload } from '@/lib/payload'
import { corsHeaders } from '@/lib/cors'
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
  // --- Log การเรียก getPayloadClient ---
  console.log(`[FORGOT PASSWORD - getPayloadClient] Function called at ${new Date().toISOString()}`)
  // -----------------------------------

  if (cached.client) {
    // --- Log การคืนค่า client ที่ cached ไว้ ---
    console.log('[FORGOT PASSWORD - getPayloadClient] Returning cached client')
    // ---------------------------------------
    return cached.client
  }

  if (!cached.promise) {
    // --- Log การสร้าง promise ใหม่ ---
    console.log('[FORGOT PASSWORD - getPayloadClient] Creating new payload promise')
    // -------------------------------
    cached.promise = (async () => {
      try {
        if (!payload.db) {
          console.log(
            '[FORGOT PASSWORD - getPayloadClient] Payload DB not found, calling initPayload...',
          )
          try {
            await initPayload()
            console.log('[FORGOT PASSWORD - getPayloadClient] initPayload completed successfully')
          } catch (initError) {
            console.error(
              '[FORGOT PASSWORD - getPayloadClient] Error during initPayload:',
              initError,
            )
            throw initError
          }
        }
        console.log('[FORGOT PASSWORD - getPayloadClient] Returning payload from promise')
        return payload
      } catch (e) {
        console.error('[FORGOT PASSWORD - getPayloadClient] Error creating payload promise:', e)
        cached.promise = null
        throw e
      }
    })()
  }

  try {
    console.log('[FORGOT PASSWORD - getPayloadClient] Awaiting payload promise...')
    cached.client = await cached.promise
    console.log('[FORGOT PASSWORD - getPayloadClient] Payload promise resolved, client is ready.')
  } catch (e) {
    console.error('[FORGOT PASSWORD - getPayloadClient] Error resolving payload promise:', e)
    cached.promise = null
    throw e
  }

  return cached.client
}

// เพิ่ม GET handler เพื่อแก้ไขปัญหา 404
export async function GET(_req: Request) {
  console.log(`[FORGOT PASSWORD] Received GET request at ${new Date().toISOString()}`)

  // ตอบกลับด้วย 200 OK พร้อม CORS headers
  return new NextResponse(
    JSON.stringify({
      message: 'Forgot password API endpoint is active',
      note: 'Please use POST method to request password reset',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}

// เพิ่มฟังก์ชัน OPTIONS เพื่อรองรับ CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function POST(req: Request) {
  // --- Log จุดเริ่มต้น ---
  console.log(`[FORGOT PASSWORD] Received POST request at ${new Date().toISOString()}`)
  console.log(`[FORGOT PASSWORD] Request URL: ${req.url}`)
  console.log(`[FORGOT PASSWORD] Request Headers Origin: ${req.headers.get('Origin')}`)
  // --- สิ้นสุด Log จุดเริ่มต้น ---

  try {
    // รับค่าอีเมลจากคำขอ
    const { email } = await req.json()

    // ตรวจสอบว่ามีอีเมลในคำขอหรือไม่
    if (!email) {
      return NextResponse.json(
        { message: 'กรุณาระบุอีเมลที่ต้องการรีเซ็ตรหัสผ่าน' },
        { status: 400, headers: corsHeaders },
      )
    }

    // เชื่อมต่อกับ Payload CMS
    console.log('[FORGOT PASSWORD] กำลังเชื่อมต่อกับ Payload CMS...')
    const payloadClient = await getPayloadClient()
    console.log('[FORGOT PASSWORD] เชื่อมต่อกับ Payload CMS สำเร็จ')

    // ตรวจสอบว่ามีผู้ใช้ที่มีอีเมลนี้หรือไม่
    const users = await payloadClient.find({
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
        { status: 200, headers: corsHeaders },
      )
    }

    // เรียกใช้ forgotPassword API ของ Payload
    console.log('[FORGOT PASSWORD] เรียกใช้ payload.forgotPassword...')
    const result = await payloadClient.forgotPassword({
      collection: 'users',
      data: {
        email,
      },
    })
    console.log('[FORGOT PASSWORD] ส่งอีเมลรีเซ็ตรหัสผ่านสำเร็จ')

    // ตอบกลับว่าสำเร็จ
    return NextResponse.json(
      {
        message: 'หากมีบัญชีอยู่ในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณ',
        success: true,
      },
      { status: 200, headers: corsHeaders },
    )
  } catch (error: unknown) {
    console.error('[FORGOT PASSWORD] เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน:', error)

    // ไม่ควรเปิดเผยข้อผิดพลาดที่เกิดขึ้นจริง เพื่อความปลอดภัย
    return NextResponse.json(
      {
        message: 'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน กรุณาลองใหม่ในภายหลัง',
        error:
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : 'ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้ในขณะนี้',
      },
      { status: 500, headers: corsHeaders },
    )
  }
}
