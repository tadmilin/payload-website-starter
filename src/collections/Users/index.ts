import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { isAdmin } from '../../access/isAdmin'
import { getClientSideURL, getServerSideURL } from '../../utilities/getURL'

// Type definitions
interface PlainObjectWithOrigin {
  origin: string
  [key: string]: unknown
}

interface PlainObjectWithHost {
  host: string
  [key: string]: unknown
}

// Type guard function for Headers object (modern API)
function isHeadersObject(headers: unknown): headers is Headers {
  return (
    typeof headers === 'object' &&
    headers !== null &&
    typeof (headers as Headers).get === 'function'
  )
}

function isPlainObjectWithOrigin(headers: unknown): headers is PlainObjectWithOrigin {
  return (
    typeof headers === 'object' &&
    headers !== null &&
    'origin' in headers &&
    typeof (headers as PlainObjectWithOrigin).origin === 'string'
  )
}

function isPlainObjectWithHost(headers: unknown): headers is PlainObjectWithHost {
  return (
    typeof headers === 'object' &&
    headers !== null &&
    'host' in headers &&
    typeof (headers as PlainObjectWithHost).host === 'string'
  )
}

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: isAdmin,
    create: () => true,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['firstName', 'lastName', 'email'],
    useAsTitle: 'email',
  },
  auth: {
    verify: {
      generateEmailHTML: ({ req, token, user }) => {
        const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        const verificationURL = `${baseURL}/verify-email?token=${token}`
        const directVerificationURL = `${baseURL}/api/collections/users/verify-email`

        return `...`
      },
      generateEmailSubject: ({ user }) => {
        return `[SOLARLAA] ยืนยันอีเมลของคุณ`
      },
    },
    forgotPassword: {
      generateEmailHTML: ({ req, token, user }) => {
        // ดึง baseURL จาก request header ก่อนเป็นอันดับแรก
        let baseURL = null

        // ลองดึง Origin จาก req.headers (ถ้ามี)
        if (req && req.headers) {
          try {
            // ตรวจสอบว่า headers เป็น Headers object (App Router) หรือเป็น plain object (Pages Router)
            if (isHeadersObject(req.headers)) {
              // Headers object (App Router) - ใช้เมธอด get
              baseURL = req.headers.get('Origin') || req.headers.get('origin')
            } else {
              // Plain object (Pages Router) - ใช้ type casting แบบปลอดภัย
              const headers = req.headers as Record<string, unknown>

              // ตรวจสอบ 'origin' property
              if (typeof headers.origin === 'string') {
                baseURL = headers.origin
              }
              // ตรวจสอบ 'host' property
              else if (typeof headers.host === 'string') {
                const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
                baseURL = `${protocol}://${headers.host}`
              }
            }
          } catch (err) {
            console.error(`[FORGOT PASSWORD] เกิดข้อผิดพลาดในการประมวลผล headers:`, err)
          }
        }

        // หากไม่สามารถดึงจาก request ได้ ให้ใช้ server URL
        if (!baseURL) {
          baseURL = getServerSideURL()
        }

        // ถ้ายังไม่มี URL ให้ใช้จาก environment variables
        if (!baseURL) {
          baseURL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL
        }

        // ใช้ค่าเริ่มต้นจาก deployment ล่าสุดที่ทราบ
        if (!baseURL) {
          baseURL = 'https://payload-solarlaa-website-77skhubqn-tadmilins-projects.vercel.app'
        }

        // สร้าง reset password URL
        const resetPasswordURL = `${baseURL}/reset-password?token=${token}`

        // Log ข้อมูลเพื่อการดีบัก
        console.log(
          `[FORGOT PASSWORD] Request Headers ที่ได้รับ:`,
          req && req.headers ? 'มี headers' : 'ไม่มี headers',
        )

        if (req && req.headers) {
          try {
            if (isHeadersObject(req.headers)) {
              console.log(`[FORGOT PASSWORD] Request host:`, req.headers.get('host'))
              console.log(`[FORGOT PASSWORD] Request origin:`, req.headers.get('Origin'))
            } else {
              // ใช้ type casting แบบปลอดภัย
              const headers = req.headers as Record<string, unknown>
              if (typeof headers.host === 'string') {
                console.log(`[FORGOT PASSWORD] Request host:`, headers.host)
              }
              if (typeof headers.origin === 'string') {
                console.log(`[FORGOT PASSWORD] Request origin:`, headers.origin)
              }
            }
          } catch (err) {
            console.error(`[FORGOT PASSWORD] เกิดข้อผิดพลาดในการ log ข้อมูล headers:`, err)
          }
        }

        console.log(`[FORGOT PASSWORD] baseURL ที่ใช้ในการสร้าง URL = ${baseURL}`)
        console.log(`[FORGOT PASSWORD] resetPasswordURL ที่ถูกสร้าง = ${resetPasswordURL}`)
        console.log(`[FORGOT PASSWORD] token length = ${token.length}`)

        return `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #01121f; color: white;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h1 style="color: #0078ff;">☀️ SOLARLAA</h1>
                </div>
                <div style="background-color: #0a1925; padding: 20px; border-radius: 5px;">
                  <h2 style="color: #0078ff;">รีเซ็ตรหัสผ่าน</h2>
                  <p>สวัสดี ${user.firstName} ${user.lastName},</p>
                  <p>เราได้รับคำขอรีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ หากคุณไม่ได้ร้องขอการรีเซ็ตรหัสผ่าน คุณสามารถละเว้นอีเมลนี้ได้</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetPasswordURL}" style="background-color: #0078ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">รีเซ็ตรหัสผ่าน</a>
                  </div>
                  <p>หรือคัดลอกและวางลิงก์นี้ในเบราว์เซอร์ของคุณ:</p>
                  <p style="word-break: break-all; color: #0078ff;"><a href="${resetPasswordURL}" style="color: #0078ff;">${resetPasswordURL}</a></p>
                  <p>หากลิงก์ด้านบนไม่ทำงาน คุณสามารถใช้วิธีทางเลือกโดยคัดลอกข้อมูลต่อไปนี้</p>
                  <p>Token ของคุณ: <span style="font-family: monospace; font-weight: bold; background-color: #203040; padding: 2px 5px; border-radius: 3px;">${token}</span></p>
                  <p>จากนั้นไปที่ <a href="${baseURL}/reset-password" style="color: #0078ff;">${baseURL}/reset-password</a> แล้วป้อน token ของคุณเพื่อรีเซ็ตรหัสผ่าน</p>
                  <p>ลิงก์นี้จะหมดอายุใน 24 ชั่วโมง</p>
                </div>
                <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #ccc;">
                  <p>© ${new Date().getFullYear()} SOLARLAA. สงวนลิขสิทธิ์ทั้งหมด.</p>
                </div>
              </div>
            </body>
          </html>
        `
      },
      generateEmailSubject: ({ user }) => {
        return `[SOLARLAA] คำขอรีเซ็ตรหัสผ่าน`
      },
      expiration: parseInt(process.env.RESET_PASSWORD_TOKEN_EXPIRATION || '86400', 10), // 24 ชั่วโมง (86400 วินาที)
    },
    maxLoginAttempts: 5,
    lockTime: 600000,
    tokenExpiration: parseInt(process.env.EMAIL_TOKEN_EXPIRATION || '86400', 10), // 24 ชั่วโมง (86400 วินาที)
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        {
          value: 'admin',
          label: 'Admin',
        },
        {
          value: 'user',
          label: 'User',
        },
      ],
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'เบอร์โทรศัพท์',
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'รูปโปรไฟล์',
    },
    {
      name: 'password',
      type: 'text',
      hidden: true,
    },
  ],
  timestamps: true,
}
