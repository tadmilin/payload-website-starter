import payload from 'payload'
import config from '../payload.config'

// ตัวแปรสำหรับการตรวจสอบสถานะการเริ่มต้น Payload
let isInitializing = false
let isInitialized = false

/**
 * เริ่มต้น Payload ในกรณีที่ยังไม่ได้เริ่มต้น
 * ฟังก์ชันนี้ทำการเริ่มต้น Payload เพียงครั้งเดียวในแอปพลิเคชัน
 * โปรเจคนี้ใช้ Vercel Postgres และ Vercel Blob เป็นฐานข้อมูลและพื้นที่เก็บไฟล์
 */
export const initPayload = async (): Promise<typeof payload> => {
  // ตรวจสอบว่า Payload เริ่มต้นแล้วหรือกำลังเริ่มต้นอยู่
  if (isInitialized) {
    console.log('[PAYLOAD INIT] Payload เริ่มต้นแล้ว กำลังส่งคืน instance ที่มีอยู่')
    return payload
  }

  if (isInitializing) {
    console.log('[PAYLOAD INIT] Payload กำลังเริ่มต้นอยู่ กำลังรอให้เริ่มต้นเสร็จ...')
    // รอให้การเริ่มต้นเสร็จสิ้น
    let attempts = 0
    const maxAttempts = 30 // 3 วินาที (30 x 100ms)
    while (isInitializing && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      attempts++
    }

    if (attempts >= maxAttempts) {
      console.warn('[PAYLOAD INIT] รอการเริ่มต้น Payload เกินเวลาที่กำหนด (3 วินาที)')
    }

    if (isInitialized) {
      console.log('[PAYLOAD INIT] Payload เริ่มต้นเสร็จแล้วหลังจากรอ')
      return payload
    } else {
      console.error('[PAYLOAD INIT] Payload ยังไม่เริ่มต้นหลังจากรอแล้ว จะลองเริ่มต้นใหม่')
    }
  }

  try {
    isInitializing = true
    console.log('[PAYLOAD INIT] กำลังเริ่มต้น Payload ด้วย config ที่มีอยู่...')

    // ตรวจสอบการเชื่อมต่อฐานข้อมูล
    console.log('[PAYLOAD INIT] ตรวจสอบการตั้งค่าฐานข้อมูล:', {
      host: process.env.POSTGRES_HOST ? 'กำหนดแล้ว' : 'ไม่ได้กำหนด',
      database: process.env.POSTGRES_DATABASE ? 'กำหนดแล้ว' : 'ไม่ได้กำหนด',
      user: process.env.POSTGRES_USER ? 'กำหนดแล้ว' : 'ไม่ได้กำหนด',
      password: process.env.POSTGRES_PASSWORD ? 'กำหนดแล้ว' : 'ไม่ได้กำหนด',
      url: process.env.DATABASE_URL ? 'กำหนดแล้ว' : 'ไม่ได้กำหนด',
    })

    // เริ่มต้น Payload ด้วย config ที่นำเข้ามาจากไฟล์ payload.config.ts
    console.log('[PAYLOAD INIT] เรียกใช้ payload.init...')
    const startTime = Date.now()
    await payload.init({
      config,
    })
    const endTime = Date.now()
    console.log(`[PAYLOAD INIT] Payload.init สำเร็จในเวลา ${endTime - startTime}ms`)

    isInitialized = true
    console.log('[PAYLOAD INIT] Payload เริ่มต้นเสร็จสมบูรณ์')
    return payload
  } catch (error) {
    console.error('[PAYLOAD INIT] เกิดข้อผิดพลาดในการเริ่มต้น Payload:', error)
    if (error instanceof Error) {
      console.error('[PAYLOAD INIT] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
    }
    throw error
  } finally {
    isInitializing = false
  }
}

export default payload
