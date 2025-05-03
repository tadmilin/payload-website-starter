'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthVerificationService } from '@/services/AuthVerificationService'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'waiting'>('loading')
  const [message, setMessage] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [resendLoading, setResendLoading] = useState<boolean>(false)
  const [resendSuccess, setResendSuccess] = useState<boolean>(false)
  const [errorDetails, setErrorDetails] = useState<string>('')
  const [tokenInput, setTokenInput] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [source, setSource] = useState<string>('')

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenInput.trim()) {
      setMessage('กรุณาป้อนรหัสยืนยัน (Token)')
      return
    }

    setSubmitting(true)
    setStatus('loading')

    try {
      // ใช้ token ที่ป้อนเข้ามาแทน
      await verifyTokenWithAllEndpoints(tokenInput)
    } catch (error: any) {
      console.error('เกิดข้อผิดพลาดในการยืนยันด้วย token ที่ป้อนเข้ามา:', error)
      setStatus('error')
      setMessage('เกิดข้อผิดพลาดในการยืนยันอีเมล: ' + (error.message || ''))
    } finally {
      setSubmitting(false)
    }
  }

  const verifyTokenWithAllEndpoints = async (token: string) => {
    // ใช้ endpoint หลักก่อน
    const mainEndpoint = '/api/users/verify-email'
    try {
      console.log(`กำลังใช้ endpoint หลัก: ${mainEndpoint}`)

      const response = await fetch(mainEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      console.log(`สถานะการตอบกลับจาก ${mainEndpoint}:`, response.status)

      let data
      try {
        data = await response.json()
        console.log(`ข้อมูลตอบกลับจาก ${mainEndpoint}:`, data)
      } catch (e) {
        console.error(`ไม่สามารถอ่านข้อมูลตอบกลับจาก ${mainEndpoint}:`, e)
        data = { message: 'ไม่สามารถอ่านข้อมูลตอบกลับได้' }
      }

      // ถ้าสถานะเป็น 200 หรือมีข้อความสำเร็จ
      if (response.ok || (data && data.message && data.message.includes('สำเร็จ'))) {
        // สำเร็จ!
        console.log('ยืนยันอีเมลสำเร็จ:', data)
        setStatus('success')
        setMessage(data.message || 'ยืนยันอีเมลสำเร็จ! คุณสามารถเข้าสู่ระบบได้แล้ว')

        // นำไปยังหน้าล็อกอินหลังจาก 3 วินาที
        setTimeout(() => {
          router.push('/login')
        }, 3000)
        return // จบการทำงานเมื่อสำเร็จ
      } else {
        // ถ้าเกิดข้อผิดพลาดจาก endpoint หลัก ให้เก็บข้อความที่ได้รับ
        setErrorDetails(
          `${mainEndpoint}: ${data.error || data.message || 'ไม่ทราบข้อผิดพลาด'} (สถานะ: ${response.status})`,
        )
        setStatus('error')

        // ตรวจสอบว่าเป็นข้อผิดพลาดเกี่ยวกับ token หมดอายุหรือไม่
        if (
          data.expired ||
          (data.message &&
            (data.message.includes('หมดอายุ') || data.message.includes('ไม่ถูกต้อง')))
        ) {
          setMessage('รหัสยืนยันหมดอายุหรือไม่ถูกต้อง กรุณาลงทะเบียนใหม่หรือขอรหัสยืนยันใหม่')
        } else {
          setMessage(data.message || 'ไม่สามารถยืนยันอีเมลได้ โปรดลองใหม่หรือติดต่อผู้ดูแลระบบ')
        }

        // ถ้ามี data.user?.email ให้นำมาใช้สำหรับการขอส่งรหัสยืนยันใหม่
        if (data.user?.email) {
          setEmail(data.user.email)
        }
      }
    } catch (error: any) {
      console.error(`เกิดข้อผิดพลาดเมื่อเรียกใช้ ${mainEndpoint}:`, error)
      setErrorDetails(`${mainEndpoint}: ${error.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ'}`)
      setStatus('error')
      setMessage(
        'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง',
      )
    }
  }

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token')

        if (!token) {
          // ถ้าไม่มี token ในพารามิเตอร์ URL ให้แสดงฟอร์มสำหรับป้อน token ด้วยตนเอง
          setStatus('error')
          setMessage('ไม่พบรหัสยืนยัน โปรดป้อนรหัสยืนยัน (Token) ด้านล่าง')
          return
        }

        console.log('Token ที่ได้รับ:', token)
        await verifyTokenWithAllEndpoints(token)
      } catch (error: any) {
        console.error('เกิดข้อผิดพลาดทั่วไป:', error)
        setStatus('error')
        setMessage('เกิดข้อผิดพลาดในการยืนยันอีเมล: ' + (error.message || ''))
      }
    }

    verifyEmail()
  }, [searchParams, router])

  useEffect(() => {
    const emailParam = searchParams.get('email')
    const sourceParam =
      searchParams.get('source') || sessionStorage.getItem('verificationSource') || ''

    if (emailParam) {
      setEmail(emailParam)
      setSource(sourceParam)

      // ถ้ามีอีเมลแต่ไม่มี token ในพารามิเตอร์ URL ให้แสดงหน้ารอการยืนยัน
      if (!searchParams.get('token')) {
        setStatus('waiting')

        // แสดงข้อความที่แตกต่างกันตาม source
        if (sourceParam === 'register') {
          setMessage('ลงทะเบียนสำเร็จ! กรุณายืนยันอีเมลที่เราส่งไปยัง ' + emailParam)
        } else if (sourceParam === 'login') {
          setMessage('กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ')
        } else {
          setMessage('โปรดตรวจสอบอีเมลของคุณและคลิกที่ลิงก์ยืนยัน หรือป้อนรหัสยืนยันด้านล่าง')
        }
      }
    }
  }, [searchParams])

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('ไม่สามารถส่งอีเมลยืนยันได้ โปรดลองสมัครสมาชิกใหม่')
      return
    }

    setResendLoading(true)
    try {
      const result = await AuthVerificationService.resendVerification(email)

      if (result.success) {
        setResendSuccess(true)
        setMessage(result.message)
      } else {
        setMessage(result.message)
      }
    } catch (error: any) {
      setMessage(error.message || 'ไม่สามารถส่งอีเมลยืนยันได้ โปรดลองอีกครั้งภายหลัง')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#01121f] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#0a1925] p-8 rounded-lg border border-gray-800 text-center">
        <h1 className="text-2xl font-semibold mb-6 text-white">ยืนยันอีเมล</h1>

        {status === 'loading' && (
          <div className="text-blue-400 mb-4">
            <p>กำลังตรวจสอบรหัสยืนยัน...</p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        )}

        {status === 'waiting' && (
          <div className="text-blue-400 mb-6">
            <p className="mb-2">{message}</p>
            <div className="mt-4">
              <p className="text-sm mb-2">
                ยังไม่ได้รับอีเมลยืนยัน? ตรวจสอบโฟลเดอร์สแปมหรือขยะของคุณ หรือส่งอีเมลยืนยันใหม่
              </p>
              <button
                onClick={handleResendVerification}
                disabled={resendLoading || resendSuccess}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors disabled:opacity-50"
              >
                {resendLoading ? 'กำลังส่ง...' : 'ส่งอีเมลยืนยันใหม่'}
              </button>
              {resendSuccess && (
                <p className="mt-2 text-green-400 text-sm">
                  ส่งอีเมลยืนยันใหม่เรียบร้อยแล้ว โปรดตรวจสอบกล่องจดหมายของคุณ
                </p>
              )}
            </div>
            <div className="mt-6">
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium underline"
              >
                กลับไปยังหน้าเข้าสู่ระบบ
              </Link>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-green-400 mb-4">
            <p>{message}</p>
            <p className="mt-2 text-sm">กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-red-400 mb-4">
            <p>{message}</p>

            {errorDetails && (
              <details className="mt-2 text-xs text-gray-400">
                <summary className="cursor-pointer">
                  รายละเอียดข้อผิดพลาด (สำหรับผู้ดูแลระบบ)
                </summary>
                <pre className="mt-1 p-2 bg-gray-800 rounded text-left overflow-x-auto">
                  {errorDetails}
                </pre>
              </details>
            )}
            {email && !resendSuccess && (
              <div className="mt-4">
                <p className="mb-2 text-sm">คุณต้องการให้ส่งอีเมลยืนยันใหม่หรือไม่?</p>
                <button
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors disabled:opacity-50"
                >
                  {resendLoading ? 'กำลังส่ง...' : 'ส่งอีเมลยืนยันใหม่'}
                </button>
              </div>
            )}
            {!email && (
              <div className="mt-4">
                <p className="text-sm">
                  หากคุณเพิ่งสมัครสมาชิกและไม่ได้รับอีเมลยืนยัน คุณสามารถ{' '}
                  <Link href="/register" className="text-blue-400 hover:text-blue-300 underline">
                    ลงทะเบียนใหม่
                  </Link>{' '}
                  หรือ{' '}
                  <Link
                    href="/resend-verification"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    ขอส่งอีเมลยืนยันใหม่
                  </Link>{' '}
                  หรือ{' '}
                  <Link href="/login" className="text-blue-400 hover:text-blue-300 underline">
                    เข้าสู่ระบบ
                  </Link>{' '}
                </p>
              </div>
            )}
            {resendSuccess && (
              <p className="mt-2 text-green-400 text-sm">
                ส่งอีเมลยืนยันใหม่เรียบร้อยแล้ว โปรดตรวจสอบกล่องจดหมายของคุณ
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
