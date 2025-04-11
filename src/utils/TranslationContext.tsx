'use client'

import * as React from 'react'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { locales, defaultLocale, translate } from './minimal-i18n'
import Cookies from 'js-cookie'

// สร้าง type สำหรับ context
type TranslationContextType = {
  t: (key: string) => string
  locale: string
  setLocale: (locale: string) => void
  toggleLocale: () => void
}

// สร้าง context
const TranslationContext = createContext<TranslationContextType>({
  t: (key) => key,
  locale: defaultLocale,
  setLocale: () => {},
  toggleLocale: () => {}
})

// สร้าง provider
export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ใช้ภาษาจาก cookie หรือค่าเริ่มต้น
  const initialLocale = typeof window !== 'undefined' 
    ? Cookies.get('locale') || defaultLocale 
    : defaultLocale

  const [locale, setLocaleState] = useState<string>(initialLocale)

  // ฟังก์ชันแปลข้อความ
  const t = useCallback((key: string) => {
    return translate(key, locale)
  }, [locale])

  // เปลี่ยนภาษาและบันทึกลง cookie
  const setLocale = useCallback((newLocale: string) => {
    if (locales.includes(newLocale)) {
      setLocaleState(newLocale)
      Cookies.set('locale', newLocale, { expires: 365 }) // บันทึกไว้ 1 ปี
    }
  }, [])

  // สลับภาษา
  const toggleLocale = useCallback(() => {
    const newLocale = locale === 'th' ? 'en' : 'th'
    setLocale(newLocale)
  }, [locale, setLocale])

  return (
    <TranslationContext.Provider value={{ t, locale, setLocale, toggleLocale }}>
      {children}
    </TranslationContext.Provider>
  )
}

// Hook เพื่อใช้งาน context
export const useTranslation = () => useContext(TranslationContext) 