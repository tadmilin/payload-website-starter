'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // ส่งคำขอเพื่อรีเซ็ตรหัสผ่าน
      const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการส่งลิงก์รีเซ็ตรหัสผ่าน')
      }

      // แสดงข้อความสำเร็จ
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการส่งลิงก์รีเซ็ตรหัสผ่าน')
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

        <h1 className="text-2xl font-semibold mb-6 text-white text-center">ลืมรหัสผ่าน</h1>

        {success ? (
          <div className="bg-green-900/20 text-green-400 p-4 rounded-md text-sm border border-green-900/50 mb-6">
            <p>เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมล {email} แล้ว</p>
            <p className="mt-2">โปรดตรวจสอบกล่องข้อความของคุณและคลิกลิงก์เพื่อดำเนินการต่อ</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-900/20 text-red-400 p-4 rounded-md text-sm border border-red-900/50">
                {error}
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
              />
              <p className="text-xs text-gray-400 mt-1">กรุณากรอกอีเมลที่คุณใช้ในการลงทะเบียน</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0078ff] hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {loading ? 'กำลังส่งลิงก์รีเซ็ตรหัสผ่าน...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
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
