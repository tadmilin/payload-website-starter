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
    try {
      // ดึง token จาก URL
      const tokenFromUrl = searchParams.get('token')
      if (tokenFromUrl) {
        // ไม่ต้อง decode token อีก เพราะจะทำให้เกิดการ double-decode
        setToken(tokenFromUrl)
        console.log('RESET PASSWORD: token from URL =', tokenFromUrl)
        console.log('RESET PASSWORD: token length =', tokenFromUrl.length)
      } else {
        setError('ไม่พบรหัสสำหรับรีเซ็ตรหัสผ่าน โปรดตรวจสอบลิงก์ในอีเมลของคุณอีกครั้ง')
      }
    } catch (e) {
      setError('เกิดข้อผิดพลาดในการอ่าน token โปรดลองใหม่หรือติดต่อผู้ดูแลระบบ')
      console.error('Error processing token:', e)
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
      console.log('กำลังส่งคำขอรีเซ็ตรหัสผ่าน...')

      // ใช้ window.location.origin เพื่อให้ตรงกับโดเมนปัจจุบัน - นี่เป็นสิ่งสำคัญมาก
      const baseURL = window.location.origin

      // ใช้ API endpoint ที่ถูกต้อง
      const resetPasswordURL = `${baseURL}/api/users/reset-password`

      console.log('RESET PASSWORD ข้อมูลสำคัญ:')
      console.log('- API URL:', resetPasswordURL)
      console.log('- Window Location:', window.location.href)
      console.log('- Window Origin:', window.location.origin)
      console.log('- Token length:', token.length)
      console.log('- Token (10 chars):', token.substring(0, 10) + '...')

      // สร้าง AbortController สำหรับยกเลิก request หากใช้เวลานานเกินไป
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 วินาที timeout

      try {
        // ส่งคำขอเพื่อรีเซ็ตรหัสผ่าน
        const response = await fetch(resetPasswordURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
            Origin: window.location.origin,
          },
          body: JSON.stringify({
            token: token,
            password: newPassword,
          }),
          credentials: 'same-origin',
          cache: 'no-store',
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        // ล็อกค่า response และข้อมูลที่ได้รับกลับมา
        console.log('RESET PASSWORD Response:')
        console.log('- Status:', response.status)
        console.log('- Status Text:', response.statusText)
        console.log('- Headers:', [...response.headers.entries()])

        const contentType = response.headers.get('Content-Type')
        console.log('- Content-Type:', contentType)

        try {
          const data = await response.json()
          console.log('- Response data:', data)

          if (!response.ok) {
            console.error('เกิดข้อผิดพลาด:', data)
            throw new Error(data.message || data.error || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน')
          }

          // แสดงข้อความสำเร็จ
          setSuccess(true)

          // นำผู้ใช้ไปยังหน้าล็อกอินหลังจาก 3 วินาที
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } catch (jsonError) {
          console.error('เกิดข้อผิดพลาดในการอ่านข้อมูล response:', jsonError)

          // กรณี response.json() ล้มเหลว ให้พยายามอ่านเป็น text
          const textData = await response.text().catch(() => 'ไม่สามารถอ่านข้อมูล text ได้')
          console.log('- Response text:', textData)

          // ถ้าได้ response แต่ parse ไม่ได้ และ status เป็น 200 ให้ถือว่าสำเร็จ
          if (response.ok) {
            setSuccess(true)
            setTimeout(() => {
              router.push('/login')
            }, 3000)
            return
          }

          throw new Error(`เกิดข้อผิดพลาดในการประมวลผลคำตอบจากเซิร์ฟเวอร์: ${jsonError.message}`)
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId)

        // ตรวจสอบว่าเป็น timeout หรือไม่
        if (fetchError.name === 'AbortError') {
          throw new Error('การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง')
        }

        throw fetchError
      }
    } catch (error: any) {
      console.error('Error details:', error)

      // จัดการข้อความ error ที่เฉพาะเจาะจงมากขึ้น
      if (error.message.includes('fetch') || error.message.includes('network')) {
        setError(
          'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง',
        )
      } else {
        setError(error.message || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน')
      }
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
                      รหัสสำหรับรีเซ็ตรหัสผ่านจะหมดอายุภายใน 24 ชั่วโมง หรือเมื่อถูกใช้ไปแล้ว
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
