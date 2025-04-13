import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 นาที
  max: 2400, // จำกัดแต่ละ IP ต่อ windowMs
  proxy: true,
}) 