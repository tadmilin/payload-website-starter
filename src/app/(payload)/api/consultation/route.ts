import { NextRequest, NextResponse } from 'next/server'
// import payload from 'payload' // <--- ลบ import นี้
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@/payload.config'

export async function POST(req: NextRequest) {
  const payload = await getPayloadHMR({ config: configPromise })

  try {
    // ตรวจสอบว่ามีการส่งข้อมูลมาหรือไม่
    if (!req.body) {
      return NextResponse.json({ error: 'No request body provided' }, { status: 400 })
    }

    // แปลงข้อมูลจาก request
    const body = await req.json()
    console.log('Received consultation data:', body)

    // ตรวจสอบว่ามีข้อมูลครบหรือไม่
    const { name, email, phone, propertyType, message } = body

    if (!name || !email || !phone || !propertyType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // === เพิ่มการบันทึกด้วย payload.create ===
    try {
      // เพิ่มบรรทัดนี้เพื่อ Debug
      console.log('Collections known to payload instance:', Object.keys(payload.collections || {}))

      const newConsultation = await payload.create({
        collection: 'consultations', // ตรวจสอบ slug ให้ถูกต้อง
        data: {
          name,
          email,
          phone,
          propertyType,
          message: message || '',
          status: 'pending', // ตั้งค่า status เริ่มต้น
        },
      })

      console.log(`Consultation saved with ID: ${newConsultation.id}`)

      // (Optional) ย้าย console.log แจ้งเตือนมาไว้ตรงนี้ หรือเพิ่มการส่งอีเมลจริง
      console.log('ADMIN NOTIFICATION: New consultation request from', name)
      console.log('Contact details:', email, phone)

      // ส่งการตอบกลับว่าสำเร็จ
      return NextResponse.json(
        {
          success: true,
          message: 'Consultation request received and saved successfully',
          consultationId: newConsultation.id,
        },
        { status: 201 }, // ใช้ status 201 Created
      )
    } catch (dbError) {
      console.error('Error saving consultation to database:', dbError)
      // ส่งการตอบกลับเมื่อเกิดข้อผิดพลาดในการบันทึก
      return NextResponse.json(
        {
          error: 'Failed to save consultation data',
          // อาจจะเพิ่ม details: dbError.message หากต้องการ (ระวังข้อมูล sensitive)
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Error processing consultation:', error)
    return NextResponse.json(
      { error: 'Failed to process consultation', details: error.message },
      { status: 500 },
    )
  }
}

// สำหรับตรวจสอบว่า API endpoint ทำงานได้หรือไม่ (อาจจะปรับแก้หรือลบตามต้องการ)
export async function GET() {
  const payload = await getPayloadHMR({ config: configPromise })

  try {
    // อาจจะคืนค่าสถานะ หรือข้อมูล collection ง่ายๆ
    const collections = payload.collections
    const collectionsList = Object.keys(collections)

    return NextResponse.json({
      status: 'Consultation API is working',
      availableCollections: collectionsList,
      note: 'GET method now only checks API status and lists collections.',
    })
  } catch (error) {
    console.error('Error checking API:', error)
    return NextResponse.json({
      status: 'API is working but with errors',
      error: error.message,
    })
  }
}
