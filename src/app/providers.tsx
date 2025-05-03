'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { AuthProvider } from '@/providers/AuthProvider'

// ใช้ dynamic import เพื่อแก้ปัญหา hydration error
const LanguageDetectorComponent = dynamic(
  () => import('../components/LanguageDetector').then((mod) => mod.default),
  { ssr: false },
)

const DefaultLanguageSetterComponent = dynamic(
  () => import('../components/DefaultLanguageSetter').then((mod) => mod.default),
  { ssr: false },
)

const initializeLanguage = () => {
  // เพิ่ม initReactI18next เพื่อเชื่อมต่อกับ React
  i18n.use(initReactI18next).init({
    lng: 'th', // ใช้ค่าเริ่มต้นเป็นภาษาไทยเสมอ สำหรับ SSR
    resources: {
      en: {
        translation: {
          // คำแปลภาษาอังกฤษ
          home: 'Home',
          about: 'About Us',
          contact: 'Contact Us',
          shop: 'Shop',
          // และอื่นๆ
        },
      },
      th: {
        translation: {
          // คำแปลภาษาไทย
          home: 'หน้าหลัก',
          about: 'เกี่ยวกับเรา',
          contact: 'ติดต่อเรา',
          shop: 'ร้านค้า',
          // และอื่นๆ
        },
      },
    },
    interpolation: {
      escapeValue: false, // ไม่ต้องทำ escape HTML
    },
    react: {
      useSuspense: false, // ปิดการใช้งาน Suspense เพื่อแก้ปัญหา hydration
    },
  })

  // ทำส่วนที่เกี่ยวกับ localStorage เฉพาะใน client side
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('language') || 'th'
    // ไม่ต้องปรับ document.documentElement ตรงนี้เพราะจะทำให้เกิด hydration mismatch

    // ปรับภาษาของ i18n
    i18n.changeLanguage(savedLanguage)

    // ฟังก์ชั่นรับเหตุการณ์ toggle-language
    const handleLanguageToggle = (event: CustomEvent) => {
      const newLang = event.detail?.language || (i18n.language === 'en' ? 'th' : 'en')
      i18n.changeLanguage(newLang)
    }

    // เพิ่ม event listener
    document.addEventListener('toggle-language', handleLanguageToggle as EventListener)

    // ทำความสะอาด event listener เมื่อ component ถูกทำลาย
    return () => {
      document.removeEventListener('toggle-language', handleLanguageToggle as EventListener)
    }
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    initializeLanguage()
  }, [])

  // ป้องกัน hydration mismatch โดยการรอให้โค้ดทำงานบน client เท่านั้น
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        {/* ทำงานเฉพาะใน client side */}
        {typeof window !== 'undefined' && (
          <>
            <DefaultLanguageSetterComponent />
            <LanguageDetectorComponent />
          </>
        )}
        {children}
      </AuthProvider>
    </I18nextProvider>
  )
}

// ClientProviders component ที่ถูกนำเข้าในไฟล์ layout.tsx
export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <AuthProvider>
      {mounted && (
        <>
          <DefaultLanguageSetterComponent />
          <LanguageDetectorComponent />
        </>
      )}
      {children}
    </AuthProvider>
  )
}
