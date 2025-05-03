'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { debounce } from 'lodash'

// สร้าง schema สำหรับตรวจสอบข้อมูล
const schema = z.object({
  firstName: z.string().min(1, { message: 'จำเป็นต้องระบุชื่อ' }),
  lastName: z.string().min(1, { message: 'จำเป็นต้องระบุนามสกุล' }),
  email: z.string().email({ message: 'รูปแบบอีเมลไม่ถูกต้อง' }),
  password: z.string().min(8, { message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' }),
  confirmPassword: z.string(),
})

// สร้าง type จาก schema
type FormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export const RegisterForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
  } = useForm<FormValues>()

  // ใช้ watch เพื่อดูค่าของ password และ email
  const password = watch('password')
  const email = watch('email')

  // ใช้ debounce เพื่อไม่ให้มีการเรียก API บ่อยเกินไป
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkEmailExists = React.useCallback(
    debounce(async (email: string) => {
      if (!email || !email.includes('@') || errors.email) return

      try {
        setIsCheckingEmail(true)

        const response = await fetch('/api/users/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })

        if (response.ok) {
          const data = await response.json()
          setEmailExists(data.exists)
          setEmailVerified(data.verified)
        }
      } catch (error) {
        console.error('ข้อผิดพลาดในการตรวจสอบอีเมล:', error)
      } finally {
        setIsCheckingEmail(false)
      }
    }, 500),
    [],
  )

  // เรียกใช้ฟังก์ชัน checkEmailExists เมื่อค่า email เปลี่ยนแปลง
  useEffect(() => {
    if (email && email.includes('@')) {
      checkEmailExists(email)
    } else {
      setEmailExists(false)
      setEmailVerified(null)
    }
  }, [email, checkEmailExists])

  const validatePassword = (value: string) => {
    // ตรวจสอบความซับซ้อนของรหัสผ่าน
    if (!/[A-Z]/.test(value)) {
      return 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว'
    }
    if (!/[a-z]/.test(value)) {
      return 'รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว'
    }
    if (!/[0-9]/.test(value)) {
      return 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว'
    }
    return true
  }

  const onSubmit = async (data: FormValues) => {
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      // ตรวจสอบความซับซ้อนของรหัสผ่าน
      const passwordError = validatePassword(data.password)
      if (passwordError !== true) {
        setError(passwordError)
        setLoading(false)
        return
      }

      // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
      if (data.password !== data.confirmPassword) {
        setError('รหัสผ่านไม่ตรงกัน')
        setLoading(false)
        return
      }

      // ตรวจสอบความถูกต้องของข้อมูลด้วย zod
      const result = schema.safeParse(data)
      if (!result.success) {
        const formattedErrors = result.error.errors.map((err) => `${err.message}`).join(', ')
        setError(formattedErrors)
        setLoading(false)
        return
      }

      console.log('[RegisterForm] กำลังส่งข้อมูลไปยัง API:', {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        // ไม่แสดงรหัสผ่าน
      })

      // ส่งข้อมูลไปยัง API Payload CMS (/api/users)
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          roles: ['user'],
        }),
      })

      console.log(
        '[RegisterForm] ได้รับการตอบกลับจากเซิร์ฟเวอร์:',
        response.status,
        response.statusText,
      )

      // ตรวจสอบการตอบกลับจากเซิร์ฟเวอร์
      const contentType = response.headers.get('content-type')
      let responseData: any = null

      // พยายามแปลงข้อมูลเป็น JSON ไม่ว่า response จะสำเร็จหรือไม่
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json()
        console.log('[RegisterForm] ข้อมูลตอบกลับ JSON:', responseData)
      } else {
        const errorText = await response.text()
        console.log('[RegisterForm] ข้อความตอบกลับที่ไม่ใช่ JSON:', errorText)
      }

      // ตรวจสอบสถานะ HTTP และข้อมูลตอบกลับ
      if (!response.ok) {
        console.log('[RegisterForm] เกิดข้อผิดพลาด:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        })

        // ดูว่ามีข้อความ error หรือไม่
        if (responseData && responseData.message) {
          // ตรวจสอบข้อความเฉพาะสำหรับอีเมลซ้ำ
          if (
            responseData.message.includes('duplicate key') ||
            responseData.message.includes('email already exists') ||
            responseData.errors?.email?.message?.includes('duplicate')
          ) {
            setError('อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบหากเป็นบัญชีของคุณ')
          } else if (
            responseData.message.includes('not verified') ||
            responseData.message.includes('verification')
          ) {
            setError(
              'บัญชีนี้ยังไม่ได้ยืนยันอีเมล กรุณาตรวจสอบกล่องจดหมายของคุณเพื่อยืนยันบัญชี หรือลองสมัครใหม่',
            )
          } else {
            setError(responseData.message)
          }
          return
        } else if (responseData && responseData.error) {
          if (
            responseData.error.includes('duplicate') ||
            responseData.error.includes('already exists')
          ) {
            setError('อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบหากเป็นบัญชีของคุณ')
          } else {
            setError(responseData.error)
          }
          return
        } else if (response.status === 400) {
          setError('ข้อมูลไม่ถูกต้อง อาจเป็นเพราะอีเมลซ้ำในระบบหรือข้อมูลไม่ครบถ้วน')
          return
        } else {
          setError(`เกิดข้อผิดพลาด: ${response.status} ${response.statusText}`)
          return
        }
      }

      // ตรวจสอบว่าได้รับข้อมูลการตอบกลับหรือไม่
      if (!responseData) {
        setError('ไม่ได้รับข้อมูลตอบกลับจากเซิร์ฟเวอร์')
        return
      }

      console.log('[RegisterForm] ลงทะเบียนสำเร็จ:', responseData)

      if (responseData.error) {
        setError(responseData.error)
        return
      }

      // แสดงข้อความสำเร็จและข้อมูลผู้ใช้
      setSuccess(
        responseData.message || 'ลงทะเบียนสำเร็จแล้ว! กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี',
      )
      reset()

      // รอสักครู่แล้วเปลี่ยนเส้นทางไปหน้าล็อกอิน
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      console.error('[RegisterForm] ข้อผิดพลาดในการลงทะเบียน:', err)

      // จัดการข้อผิดพลาดเฉพาะ
      if (
        err.message.includes('email already exists') ||
        err.message.includes('อีเมลนี้ถูกใช้งาน') ||
        err.message.includes('EMAIL_ALREADY_EXISTS') ||
        err.message.includes('duplicate key')
      ) {
        setError('อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบหากเป็นบัญชีของคุณ')
      } else if (
        err.message.includes('not verified') ||
        err.message.includes('verification') ||
        err.message.includes('EMAIL_NOT_VERIFIED')
      ) {
        setError(
          'บัญชีนี้ยังไม่ได้ยืนยันอีเมล กรุณาตรวจสอบกล่องจดหมายของคุณเพื่อยืนยันบัญชี หรือลองสมัครใหม่',
        )
      } else if (
        err.message.includes('INVALID_PASSWORD') ||
        err.message.includes('รหัสผ่านไม่ถูกต้อง')
      ) {
        setError(
          'รหัสผ่านไม่ถูกต้องตามเงื่อนไข ต้องมีความยาวอย่างน้อย 8 ตัวอักษร มีตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลข',
        )
      } else if (
        err.message.includes('network') ||
        err.message.includes('failed to fetch') ||
        err.message.includes('CONNECTION_ERROR')
      ) {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต')
      } else if (
        err.message.includes('PAYLOAD_NOT_INITIALIZED') ||
        err.message.includes('ระบบสมาชิกยังไม่พร้อมใช้งาน')
      ) {
        setError('ระบบยังไม่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลระบบหรือลองใหม่ในภายหลัง')
      } else if (err.message.includes('DATABASE_ERROR')) {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล กรุณาลองใหม่ในภายหลัง')
      } else {
        setError(err.message || 'เกิดข้อผิดพลาดในการลงทะเบียน')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="bg-red-900/20 text-red-400 p-4 rounded-md text-sm border border-red-900/50">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/20 text-green-400 p-4 rounded-md text-sm border border-green-900/50">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-white/90">
            ชื่อ
          </label>
          <input
            id="firstName"
            type="text"
            {...register('firstName', { required: 'จำเป็นต้องระบุชื่อ' })}
            className="w-full px-4 py-3 bg-[#162431] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-white"
            placeholder="ชื่อของคุณ"
            suppressHydrationWarning={true}
          />
          {errors.firstName && (
            <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-white/90">
            นามสกุล
          </label>
          <input
            id="lastName"
            type="text"
            {...register('lastName', { required: 'จำเป็นต้องระบุนามสกุล' })}
            className="w-full px-4 py-3 bg-[#162431] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-white"
            placeholder="นามสกุลของคุณ"
            suppressHydrationWarning={true}
          />
          {errors.lastName && (
            <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-white/90">
          อีเมล
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'จำเป็นต้องระบุอีเมล',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'รูปแบบอีเมลไม่ถูกต้อง',
              },
            })}
            className={`w-full px-4 py-3 bg-[#162431] border ${
              emailExists ? 'border-yellow-600' : 'border-gray-700'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-white`}
            placeholder="your.email@example.com"
            suppressHydrationWarning={true}
          />
          {isCheckingEmail && (
            <div className="absolute right-3 top-3.5">
              <svg
                className="animate-spin h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
        </div>
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        {emailExists && !isCheckingEmail && (
          <div className={`text-xs mt-1 ${emailVerified ? 'text-yellow-400' : 'text-red-400'}`}>
            {emailVerified
              ? 'อีเมลนี้มีในระบบแล้ว คุณสามารถ'
              : 'อีเมลนี้ลงทะเบียนแล้วแต่ยังไม่ได้ยืนยัน คุณสามารถ'}
            <Link href="/login" className="font-medium underline ml-1">
              เข้าสู่ระบบ
            </Link>
            {!emailVerified && (
              <>
                {' หรือ '}
                <Link
                  href={`/verify-email?email=${encodeURIComponent(getValues('email'))}`}
                  className="font-medium underline"
                >
                  ขอส่งอีเมลยืนยันใหม่
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-white/90">
          รหัสผ่าน
        </label>
        <input
          id="password"
          type="password"
          {...register('password', {
            required: 'จำเป็นต้องระบุรหัสผ่าน',
            minLength: {
              value: 8,
              message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
            },
          })}
          className="w-full px-4 py-3 bg-[#162431] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-white"
          placeholder="••••••••"
          suppressHydrationWarning={true}
        />
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        <div className="text-xs text-gray-500 mt-1 space-y-1">
          <p>รหัสผ่านต้องประกอบด้วย:</p>
          <ul className="list-disc pl-5">
            <li>ตัวอักษรภาษาอังกฤษตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว (A-Z)</li>
            <li>ตัวอักษรภาษาอังกฤษตัวพิมพ์เล็กอย่างน้อย 1 ตัว (a-z)</li>
            <li>ตัวเลขอย่างน้อย 1 ตัว (0-9)</li>
            <li>ความยาวอย่างน้อย 8 ตัวอักษร</li>
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90">
          ยืนยันรหัสผ่าน
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword', {
            required: 'จำเป็นต้องยืนยันรหัสผ่าน',
            validate: (value) => value === password || 'รหัสผ่านไม่ตรงกัน',
          })}
          className="w-full px-4 py-3 bg-[#162431] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-white"
          placeholder="••••••••"
          suppressHydrationWarning={true}
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0078ff] hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-70 mt-2"
        suppressHydrationWarning={true}
      >
        {loading ? 'กำลังดำเนินการ...' : 'สมัครสมาชิก'}
      </button>

      <div className="pt-2 text-center text-sm text-gray-400">
        มีบัญชีอยู่แล้ว?{' '}
        <Link
          href="/login"
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    </form>
  )
}
