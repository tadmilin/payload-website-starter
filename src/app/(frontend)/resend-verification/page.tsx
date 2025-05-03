'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ResendVerificationPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setStatus('error')
      setMessage('กรุณาระบุอีเมลของคุณ')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/users/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'ส่งอีเมลยืนยันใหม่เรียบร้อยแล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ')
      } else {
        setStatus('error')
        setMessage(data.message || 'ไม่สามารถส่งอีเมลยืนยันได้ โปรดลองอีกครั้งในภายหลัง')
      }
    } catch (error: any) {
      setStatus('error')
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ โปรดลองอีกครั้งในภายหลัง')
    }
  }

  return (
    <div className="min-h-screen bg-[#01121f] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#0a1925] p-8 rounded-lg border border-gray-800 text-center">
        <h1 className="text-2xl font-semibold mb-6 text-white">ขอส่งอีเมลยืนยันใหม่</h1>

        {status === 'success' ? (
          <div className="text-green-400 mb-6">
            <p>{message}</p>
            <div className="mt-2 text-gray-300 text-sm">
              <p>เราได้ส่งอีเมลที่มีลิงก์ยืนยันไปยังที่อยู่อีเมลของคุณแล้ว</p>
              <p>กรุณาตรวจสอบกล่องจดหมายของคุณและคลิกที่ลิงก์ยืนยัน</p>
              <p className="text-yellow-400">หมายเหตุ: อีเมลอาจอยู่ในโฟลเดอร์ขยะหรือสแปม</p>
            </div>
            <div className="mt-6">
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
              >
                ไปยังหน้าเข้าสู่ระบบ
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="text-gray-300 mb-4 text-sm text-left">
              <p>
                หากคุณยังไม่ได้รับอีเมลยืนยัน อีเมลยืนยันเดิมหมดอายุ หรือมีปัญหาในการเข้าสู่ระบบ
                คุณสามารถขอส่งอีเมลยืนยันใหม่ได้ที่นี่
              </p>
              <p className="mt-2">ระบบจะส่งอีเมลพร้อมลิงก์สำหรับยืนยันบัญชีผู้ใช้ของคุณอีกครั้ง</p>
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 text-left mb-1"
              >
                อีเมล
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="กรอกอีเมลที่คุณใช้ลงทะเบียน"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={status === 'loading'}
              />
            </div>

            {status === 'error' && (
              <div className="mb-4 text-red-400 text-sm">
                <p>{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || !email.trim()}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'กำลังส่ง...' : 'ส่งอีเมลยืนยันใหม่'}
            </button>
          </form>
        )}

        <div className="mt-6">
          <p className="text-gray-400 text-sm">
            กลับไปยัง{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 underline">
              หน้าเข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
