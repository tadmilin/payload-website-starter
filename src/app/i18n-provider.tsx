'use client'

import * as React from 'react'
import { createContext, useContext, useState, useCallback } from 'react'
import { locales, defaultLocale } from '@/i18n'

// สร้าง type สำหรับ context
type TranslationType = {
  t: (key: string, options?: Record<string, unknown>) => string
  locale: string
  changeLocale: (locale: string) => void
}

// ค่าเริ่มต้น
const initialTranslation: TranslationType = {
  t: (key) => key,
  locale: defaultLocale,
  changeLocale: () => {},
}

// สร้าง Context
const TranslationContext = createContext<TranslationType>(initialTranslation)

// แปล dictionary
const translations: Record<string, Record<string, string>> = {
  th: {
    home: 'หน้าหลัก',
    simulator: 'จำลองการติดตั้ง',
    shop: 'ร้านค้า',
    monitor: 'ติดตามระบบ',
    login: 'เข้าสู่ระบบ',
    solar_title: 'โซล่าเซลล์เพื่อบ้านของคุณ',
    solar_desc: 'ผลิตไฟฟ้าจากแสงอาทิตย์ ประหยัดพลังงาน ลดค่าไฟฟ้า',
    start_simulation: 'เริ่มจำลองการติดตั้ง',
    view_products: 'ดูสินค้าทั้งหมด',
    energy_saving_stats: 'สถิติการประหยัดพลังงาน',
    total_electricity: 'พลังงานไฟฟ้าทั้งหมด',
    total_consumption: 'การใช้พลังงานทั้งหมด',
    total_projects: 'โครงการทั้งหมด',
    total_capacity: 'กำลังการผลิตทั้งหมด',
  },
  en: {
    home: 'Home',
    simulator: 'Simulator',
    shop: 'Shop',
    monitor: 'Monitor',
    login: 'Login',
    solar_title: 'Solar Cell for Your Home',
    solar_desc: 'Generate electricity from sunlight, save energy, reduce electricity bills',
    start_simulation: 'Start Simulation',
    view_products: 'View All Products',
    energy_saving_stats: 'Energy Saving Statistics',
    total_electricity: 'Total Electricity',
    total_consumption: 'Total Consumption',
    total_projects: 'Total Projects',
    total_capacity: 'Total Capacity',
  },
}

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState(defaultLocale)

  // ฟังก์ชันแปลข้อความ
  const t = useCallback(
    (key: string, options?: Record<string, unknown>) => {
      return translations[locale]?.[key] || key
    },
    [locale],
  )

  // เปลี่ยนภาษา
  const changeLocale = useCallback((newLocale: string) => {
    if (locales.includes(newLocale)) {
      setLocale(newLocale)
    }
  }, [])

  const value = {
    t,
    locale,
    changeLocale,
  }

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>
}

// Hook สำหรับใช้งาน context
export const useTranslation = () => useContext(TranslationContext)
