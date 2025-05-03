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
    console.log('Payload เริ่มต้นแล้ว กำลังส่งคืน instance ที่มีอยู่')
    return payload
  }

  if (isInitializing) {
    console.log('Payload กำลังเริ่มต้นอยู่ กำลังรอให้เริ่มต้นเสร็จ...')
    // รอให้การเริ่มต้นเสร็จสิ้น
    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    return payload
  }

  try {
    isInitializing = true
    console.log('กำลังเริ่มต้น Payload ด้วย config ที่มีอยู่...')

    // เริ่มต้น Payload ด้วย config ที่นำเข้ามาจากไฟล์ payload.config.ts
    await payload.init({
      config,
    })

    isInitialized = true
    console.log('Payload เริ่มต้นเสร็จสมบูรณ์')
    return payload
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเริ่มต้น Payload:', error)
    throw error
  } finally {
    isInitializing = false
  }
}

export default payload
