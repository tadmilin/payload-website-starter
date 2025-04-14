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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
          <span className="lang-th">อีเมล</span>
          <span className="lang-en">Email</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white bg-white dark:bg-gray-900"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
          <span className="lang-th">รหัสผ่าน</span>
          <span className="lang-en">Password</span>
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white bg-white dark:bg-gray-900"
        />
      </div>
      
      <div className="text-right text-sm">
        <Link 
          href="/forgot-password" 
          className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
        >
          <span className="lang-th">ลืมรหัสผ่าน?</span>
          <span className="lang-en">Forgot password?</span>
        </Link>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-70"
      >
        {loading ? (
          <>
            <span className="lang-th">กำลังเข้าสู่ระบบ...</span>
            <span className="lang-en">Logging in...</span>
          </>
        ) : (
          <>
            <span className="lang-th">เข้าสู่ระบบ</span>
            <span className="lang-en">Login</span>
          </>
        )}
      </button>
      
      <div className="text-center text-sm text-gray-800 dark:text-gray-200">
        <span className="lang-th">ยังไม่มีบัญชี?</span>
        <span className="lang-en">Don&apos;t have an account?</span>{' '}
        <Link 
          href="/register" 
          className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
        >
          <span className="lang-th">สมัครสมาชิก</span>
          <span className="lang-en">Register</span>
        </Link>
      </div>
    </form>
  )
} 