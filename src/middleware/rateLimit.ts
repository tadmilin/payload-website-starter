import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 นาที
  max: 2400, // จำกัดแต่ละ IP ต่อ windowMs
})

// เปิดใช้งาน trust proxy
limiter.enable(true)

export const rateLimiter = limiter 