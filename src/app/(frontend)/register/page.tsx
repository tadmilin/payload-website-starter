import React from 'react'
import { RegisterForm } from '@/components/RegisterForm'
import Link from 'next/link'
import { Home, Globe } from 'lucide-react'
import LangSwitcherWrapper from './client-components'

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-24">
      <div className="container relative">
        <div className="max-w-md mx-auto bg-white dark:bg-black p-8 rounded-lg border border-border relative">
          <Link 
            href="/home"
            className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 dark:bg-gray-800 text-white hover:bg-black dark:hover:bg-gray-700 transition-all hover:shadow-md hover:-translate-y-0.5 border-2 border-gray-700 dark:border-gray-600"
            title="กลับหน้าหลัก"
          >
            <Home className="w-5 h-5" />
          </Link>
          
          <div className="absolute top-4 left-4 flex items-center justify-center">
            <LangSwitcherWrapper />
          </div>
          
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            <span className="lang-th">สมัครสมาชิก</span>
            <span className="lang-en">Register</span>
          </h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'สมัครสมาชิก',
  description: 'สมัครสมาชิกเพื่อใช้งานเว็บไซต์',
} 