import express from 'express'
import payload from 'payload'
import { rateLimiter } from './middleware/rateLimit'

const app = express()

// ใช้ rate limiter ก่อน routes อื่นๆ
app.use(rateLimiter)

// ... existing code ...

export default app 