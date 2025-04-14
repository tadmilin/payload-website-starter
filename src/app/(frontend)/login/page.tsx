'use client'

import React, { useState, useEffect } from 'react'
import { LoginForm } from '@/components/LoginForm'
import Link from 'next/link'
import Image from 'next/image'
import LangSwitcherWrapper from './client-components'

export default function LoginPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#01121f] text-white">
      {/* พื้นหลังด้านซ้าย (แสดงเฉพาะจอใหญ่) */}
      <div className="hidden md:block md:w-1/2 lg:w-3/5 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.5), rgba(1,18,31,0.8)), url('/images/solar-night-home.jpg')",
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
        ></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 z-10">
          <div className={`max-w-md transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-3xl font-semibold mb-4">ยินดีต้อนรับกลับมา</h1>
            <p className="text-white/70 text-sm">
              เข้าสู่ระบบเพื่อจัดการบัญชีของคุณ ติดตามการติดตั้งโซลาร์เซลล์ และเข้าถึงข้อมูลสำคัญต่างๆ
            </p>
          </div>
        </div>
      </div>

      {/* ฟอร์มเข้าสู่ระบบ - ด้านขวา */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6">
        <div className={`w-full max-w-md transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* โลโก้และลิงก์กลับหน้าหลัก */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center">
              <span className="text-lg mr-1">☀️</span>
              <span className="text-sm tracking-wider font-bold">SOLARLAA</span>
            </Link>
            <LangSwitcherWrapper />
          </div>
          
          {/* หัวข้อและข้อความต้อนรับสำหรับมือถือ */}
          <div className="md:hidden mb-8">
            <h2 className="text-2xl font-semibold mb-2">ยินดีต้อนรับกลับมา</h2>
            <p className="text-white/70 text-sm">
              เข้าสู่ระบบเพื่อจัดการบัญชีของคุณ
            </p>
          </div>
          
          {/* ฟอร์มเข้าสู่ระบบ */}
          <div className="bg-[#0a1925] p-6 md:p-8 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-6">เข้าสู่ระบบ</h2>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
} 