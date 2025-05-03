'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // ดึง token จาก URL
    const tokenFromUrl = searchParams.get('token')
    if (tokenFromUrl) {
      const decodedToken = decodeURIComponent(tokenFromUrl)
      setToken(decodedToken)
      console.log('RESET PASSWORD: token from URL =', tokenFromUrl)
      console.log('RESET PASSWORD: decoded token =', decodedToken)
    } else {
      setError('ไม่พบรหัสสำหรับรีเซ็ตรหัสผ่าน โปรดตรวจสอบลิงก์ในอีเมลของคุณอีกครั้ง')
    }
  }, [searchParams])

  const validatePassword = (password: string): string | true => {
    if (password.length < 8) {
      return 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร'
    }
    if (!/[A-Z]/.test(password)) {
      return 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว'
    }
    if (!/[a-z]/.test(password)) {
      return 'รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว'
    }
    if (!/[0-9]/.test(password)) {
      return 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว'
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // ตรวจสอบว่ามี token หรือไม่
    if (!token) {
      setError('ไม่พบรหัสสำหรับรีเซ็ตรหัสผ่าน')
      setLoading(false)
      return
    }

    // ตรวจสอบความซับซ้อนของรหัสผ่าน
    const passwordValidation = validatePassword(newPassword)
    if (passwordValidation !== true) {
      setError(passwordValidation)
      setLoading(false)
      return
    }

    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      setLoading(false)
      return
    }

    try {
      // ส่งคำขอเพื่อรีเซ็ตรหัสผ่าน
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน')
      }

      // แสดงข้อความสำเร็จ
      setSuccess(true)

      // นำผู้ใช้ไปยังหน้าล็อกอินหลังจาก 3 วินาที
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#01121f] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#0a1925] p-8 rounded-lg border border-gray-800">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-xl mr-1">☀️</span>
            <span className="text-sm tracking-wider font-bold">SOLARLAA</span>
          </Link>
        </div>

        <h1 className="text-2xl font-semibold mb-6 text-white text-center">รีเซ็ตรหัสผ่าน</h1>

        {success ? (
          <div className="bg-green-900/20 text-green-400 p-4 rounded-md text-sm border border-green-900/50 mb-6">
            <p>รีเซ็ตรหัสผ่านสำเร็จ!</p>
            <p className="mt-2">คุณสามารถใช้รหัสผ่านใหม่ในการเข้าสู่ระบบได้ทันที</p>
            <p className="mt-2 text-sm">กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-900/20 text-red-400 p-4 rounded-md text-sm border border-red-900/50 mb-4">
                {error}
                {error.includes('หมดอายุ') || error.includes('ไม่ถูกต้อง') ? (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => router.push('/forgot-password')}
                      className="text-blue-400 underline hover:text-blue-300 text-sm"
                    >
                      ขอรหัสรีเซ็ตใหม่
                    </button>
                    <div className="text-xs text-gray-400 mt-2">
                      รหัสสำหรับรีเซ็ตรหัสผ่านจะหมดอายุภายใน 2 ชั่วโมง หรือเมื่อถูกใช้ไปแล้ว
                      <br />
                      กรุณาขอรหัสใหม่หากลิงก์หมดอายุหรือถูกใช้ไปแล้ว
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-white/90">
                รหัสผ่านใหม่
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#162431] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก
                และตัวเลข
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90">
                ยืนยันรหัสผ่านใหม่
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#162431] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0078ff] hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {loading ? 'กำลังรีเซ็ตรหัสผ่าน...' : 'รีเซ็ตรหัสผ่าน'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            กลับไปยังหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  )
}
