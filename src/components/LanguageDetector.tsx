'use client'

import { useEffect } from 'react'

export default function LanguageDetector() {
  useEffect(() => {
    try {
      // ฟังก์ชันตรวจจับภาษาและตั้งค่า
      const detectAndSetLanguage = () => {
        try {
          // อ่านค่าจาก localStorage
          const lang = localStorage.getItem('language') || 'th'
          
          // เปลี่ยน lang attribute ของ HTML
          document.documentElement.lang = lang
          
          // เพิ่ม data-lang attribute เพื่อใช้ใน CSS
          document.documentElement.setAttribute('data-lang', lang)
          
          console.log('Language set to:', lang)
        } catch (err) {
          console.error('Error setting language:', err)
        }
      }

      // ตั้งค่าภาษาเมื่อคอมโพเนนต์โหลด
      detectAndSetLanguage()
      
      // เมื่อ localStorage เปลี่ยน
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'language' && e.newValue) {
          document.documentElement.lang = e.newValue
          document.documentElement.setAttribute('data-lang', e.newValue)
        }
      }
      
      // เมื่อมีการเปลี่ยน URL (การนำทาง)
      const handleRouteChange = () => {
        setTimeout(detectAndSetLanguage, 100)
      }
      
      // เพิ่ม event listeners
      window.addEventListener('storage', handleStorageChange)
      window.addEventListener('popstate', handleRouteChange)
      
      // จัดการการเปลี่ยนแปลงเมื่อมีการโหลดหน้า
      setTimeout(detectAndSetLanguage, 500)
      
      return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('popstate', handleRouteChange)
      }
    } catch (error) {
      console.error('LanguageDetector error:', error)
    }
  }, [])

  return null // ไม่มีการแสดงผล UI
} 