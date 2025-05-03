'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { SocialLogin } from '@/components/SocialLogin'

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSendingVerification, setIsSendingVerification] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [emailVerificationPending, setEmailVerificationPending] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState('')
  const [redirectUrl, setRedirectUrl] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setEmailVerificationPending(false)
    setVerificationSent(false)
    setUnverifiedEmail('')
    setRedirectUrl('')
    setLoading(true)

    try {
      await login(email, password)
      // เมื่อล็อกอินสำเร็จ นำผู้ใช้ไปยังหน้าหลัก
      router.push('/')
      router.refresh()
    } catch (err: any) {
      console.log('Login error in form:', err, 'error name:', err.name)

      // ใช้ switch case เพื่อความชัดเจน
      switch (err.name) {
        case 'UnverifiedEmail':
          // กรณีอีเมลยังไม่ได้ยืนยัน
          console.log('Handling UnverifiedEmail error')
          setEmailVerificationPending(true)
          setError(err.message || 'กรุณายืนยันตัวตนที่ email ที่สมัครไว้')
          setUnverifiedEmail(err.email || email)
          if (err.redirectUrl) {
            setRedirectUrl(err.redirectUrl)
          } else {
            setRedirectUrl(`/verify-email?email=${encodeURIComponent(email)}&source=login`)
          }
          break

        case 'InvalidCredentials':
          // กรณีข้อมูลเข้าสู่ระบบไม่ถูกต้อง
          setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง')
          break

        case 'UserNotFound':
          // กรณีไม่พบผู้ใช้
          setError('ไม่พบบัญชีผู้ใช้นี้ในระบบ กรุณาตรวจสอบอีเมลของคุณหรือสมัครสมาชิกใหม่')
          break

        default:
          // กรณีข้อผิดพลาดอื่นๆ
          // ตรวจเพิ่มเติมจากข้อความ error
          if (err.message.includes('ยืนยันตัวตน') || err.message.includes('ยืนยันอีเมล')) {
            setEmailVerificationPending(true)
            setError('กรุณายืนยันตัวตนที่ email ที่สมัครไว้')
          } else if (
            err.message.includes('รหัสผ่านไม่ถูกต้อง') ||
            err.message.includes('อีเมลหรือรหัสผ่าน')
          ) {
            setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง')
          } else if (err.message.includes('ไม่พบบัญชี')) {
            setError('ไม่พบบัญชีผู้ใช้นี้ในระบบ กรุณาตรวจสอบอีเมลของคุณหรือสมัครสมาชิกใหม่')
          } else if (err.message.includes('locked') || err.message.includes('too many attempts')) {
            setError(
              'บัญชีของคุณถูกล็อกชั่วคราวเนื่องจากมีการพยายามเข้าสู่ระบบหลายครั้ง กรุณาลองใหม่ในอีก 10 นาที',
            )
          } else {
            setError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง')
          }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email) {
      setError('กรุณากรอกอีเมลที่ต้องการส่งยืนยันใหม่')
      return
    }

    setIsSendingVerification(true)
    try {
      const response = await fetch('/api/users/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'ไม่สามารถส่งอีเมลยืนยันได้')
      }

      setVerificationSent(true)
      setEmailVerificationPending(false)
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถส่งอีเมลยืนยันได้ กรุณาลองอีกครั้งภายหลัง')
    } finally {
      setIsSendingVerification(false)
    }
  }

  const handleSocialLoginError = (errorMsg: string) => {
    setError(errorMsg)
  }

  const handleGoToVerifyEmail = () => {
    if (redirectUrl) {
      router.push(redirectUrl)
    } else if (unverifiedEmail) {
      router.push(`/verify-email?email=${encodeURIComponent(unverifiedEmail)}&source=login`)
    } else if (email) {
      router.push(`/verify-email?email=${encodeURIComponent(email)}&source=login`)
    } else {
      router.push('/verify-email')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && !emailVerificationPending && !verificationSent && (
        <div className="bg-red-900/20 text-red-400 p-4 rounded-md text-sm border border-red-900/50">
          {error}
        </div>
      )}

      {emailVerificationPending && (
        <div className="bg-red-900/20 text-red-400 p-4 rounded-md text-sm border border-red-900/50">
          <p className="mb-2">{error}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={isSendingVerification}
              className="py-2 px-3 bg-red-700 hover:bg-red-600 text-white text-xs rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingVerification ? 'กำลังส่ง...' : 'ส่งอีเมลยืนยันอีกครั้ง'}
            </button>
            <span className="text-gray-400 text-xs">หรือ</span>
            <button
              type="button"
              onClick={handleGoToVerifyEmail}
              className="py-2 px-3 bg-blue-700 hover:bg-blue-600 text-white text-xs rounded-md transition-colors text-center"
            >
              ไปยังหน้ายืนยันอีเมล
            </button>
          </div>
        </div>
      )}

      {verificationSent && (
        <div className="bg-green-900/20 text-green-400 p-4 rounded-md text-sm border border-green-900/50">
          <p>ส่งอีเมลยืนยันไปยัง {email} เรียบร้อยแล้ว</p>
          <p className="mt-1">กรุณาตรวจสอบกล่องจดหมายของคุณและคลิกลิงก์ยืนยันอีเมล</p>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-white/90">
          อีเมล
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your.email@example.com"
          className="w-full px-4 py-3 bg-[#162431] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-white"
          suppressHydrationWarning={true}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-white/90">
            รหัสผ่าน
          </label>
          <Link
            href="/forgot-password"
            className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
          >
            ลืมรหัสผ่าน?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-[#162431] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-white"
          suppressHydrationWarning={true}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0078ff] hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-70 mt-2"
        suppressHydrationWarning={true}
      >
        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </button>

      <SocialLogin onError={handleSocialLoginError} />

      <div className="pt-2 text-center text-sm text-gray-400">
        ยังไม่มีบัญชี?{' '}
        <Link
          href="/register"
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          สมัครสมาชิก
        </Link>
      </div>
    </form>
  )
}
