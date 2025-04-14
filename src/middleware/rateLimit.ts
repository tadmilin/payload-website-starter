import { rateLimit } from 'express-rate-limit'

// สร้าง rate limiter โดยใช้ express-rate-limit
const expressLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 นาที
  max: 2400, // จำกัดแต่ละ IP ให้ทำรายการได้สูงสุด 2400 ครั้งต่อ 2 นาที
  standardHeaders: true, // ส่ง `RateLimit-*` headers
  legacyHeaders: false, // ไม่ส่ง `X-RateLimit-*` headers
  message: {
    status: 429,
    message: 'มีการร้องขอมากเกินไป กรุณาลองใหม่ในภายหลัง',
  },
})

// สร้าง interface ที่สามารถใช้งานได้ทั้งใน Express และ Next.js
export const limiter = {
  // สำหรับการใช้งานใน Express middleware
  middleware: expressLimiter,
  
  // สำหรับการใช้งานใน Next.js middleware
  get: async (request: Request, options: { key?: string } = {}) => {
    // express-rate-limit จะจัดการ store และการนับด้วยตัวเอง
    // แต่เราไม่สามารถเรียกใช้โดยตรงใน Next.js ได้
    // สำหรับเวอร์ชันนี้ เราจะไม่มีการจำกัดจริง ๆ ใน Next.js middleware
    // และให้ค่ากลับเป็น true เสมอ (ไม่เกินขีดจำกัด)
    
    return true // ไม่เกินขีดจำกัด
    
    // หมายเหตุ: การทำ rate limiting ที่สมบูรณ์ใน Next.js middleware
    // ควรใช้ Upstash, Redis หรือตัวเลือกอื่น ๆ ที่เหมาะสมกับ Edge runtime
  }
}