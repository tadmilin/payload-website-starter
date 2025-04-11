'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { defaultLocale, locales } from '@/i18n'
import { useRouter, usePathname } from 'next/navigation'
import Cookies from 'js-cookie'

// สร้าง type สำหรับ context
type LanguageContextType = {
  locale: string
  setLocale: (locale: string) => void
  toggleLocale: () => void
}

// สร้าง context สำหรับภาษา
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// สร้าง provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [locale, setLocaleState] = useState<string>(defaultLocale)

  // โหลดภาษาจาก cookie เมื่อ component ถูก mounted
  useEffect(() => {
    const savedLocale = Cookies.get('locale')
    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale)
    }
  }, [])

  // เปลี่ยนภาษาและบันทึกลง cookie
  const setLocale = (newLocale: string) => {
    if (locales.includes(newLocale)) {
      setLocaleState(newLocale)
      Cookies.set('locale', newLocale, { expires: 365 }) // บันทึกไว้ 1 ปี
      
      // ถ้ามีการเปลี่ยนเส้นทาง ให้ refresh หน้าเพื่อแสดงภาษาใหม่
      if (pathname) {
        router.refresh()
      }
    }
  }

  // สลับระหว่างภาษาไทยและอังกฤษ
  const toggleLocale = () => {
    const newLocale = locale === 'th' ? 'en' : 'th'
    setLocale(newLocale)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook สำหรับเข้าถึง context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 