import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { isAdmin } from '../../access/isAdmin'
import { getClientSideURL, getServerSideURL } from '../../utilities/getURL'

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
        let baseURL = null

        if (req && req.headers) {
          if (typeof req.headers.get === 'function') {
            baseURL = req.headers.get('Origin') || req.headers.get('origin')
          } else if (req.headers.origin) {
            baseURL = req.headers.origin
          } else if (req.headers.host) {
            const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
            baseURL = `${protocol}://${req.headers.host}`
          }
        }

        if (!baseURL) {
          baseURL = getServerSideURL()
        }

        if (!baseURL) {
          baseURL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL
        }

        if (!baseURL) {
          baseURL = 'https://payload-solarlaa-website-77skhubqn-tadmilins-projects.vercel.app'
        }

        const resetPasswordURL = `${baseURL}/reset-password?token=${token}`

        console.log(
          `[FORGOT PASSWORD] Request Headers ที่ได้รับ:`,
          req && req.headers ? 'มี headers' : 'ไม่มี headers',
        )
        if (req && req.headers) {
          console.log(
            `[FORGOT PASSWORD] Request host:`,
            typeof req.headers.get === 'function' ? req.headers.get('host') : req.headers.host,
          )
          console.log(
            `[FORGOT PASSWORD] Request origin:`,
            typeof req.headers.get === 'function' ? req.headers.get('Origin') : req.headers.origin,
          )
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
