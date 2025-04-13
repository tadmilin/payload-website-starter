import express from 'express'
import payload from 'payload'
import { rateLimiter } from './middleware/rateLimit'

const app = express()

// ใช้ rate limiter ก่อน routes อื่นๆ
app.use(rateLimiter)

// ตั้งค่าพื้นฐาน
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// เริ่มต้น payload
const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'YOUR-SECRET-KEY',
    express: app,
  })

  // เริ่มต้น server
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
  })
}

start()

export default app 