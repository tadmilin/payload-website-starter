'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      }

      // เมื่อ login สำเร็จ
      // บันทึก token ลงใน localStorage
      localStorage.setItem('payloadToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect ไปยังหน้าหลักหรือหน้า dashboard
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
    } finally {
      setLoading(false)
    }
  }

  return (
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