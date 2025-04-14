'use client'

import React, { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'

export const LanguageSwitcherClient = () => {
  const [lang, setLang] = useState<string>('th')

  // โหลดข้อมูลจาก localStorage เมื่อคอมโพเนนต์ถูกโหลด
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('language') || 'th'
      setLang(savedLang)
      
      // เพิ่ม event listener สำหรับเปลี่ยนภาษาจากภายนอก
      const handleToggleEvent = () => {
        handleLanguageToggle();
      };
      
      document.addEventListener('toggle-language', handleToggleEvent);
      
      // ลบ event listener เมื่อ component unmount
      return () => {
        document.removeEventListener('toggle-language', handleToggleEvent);
      };
    } catch (error) {
      console.error('Error in LanguageSwitcherClient:', error)
    }
  }, [])

  // ฟังก์ชันสลับภาษาและบันทึกค่า
  const handleLanguageToggle = () => {
    try {
      const newLang = lang === 'th' ? 'en' : 'th'
      
      // บันทึกลงใน localStorage
      localStorage.setItem('language', newLang)
      
      // อัพเดต state
      setLang(newLang)
      
      // อัพเดต DOM attributes
      document.documentElement.lang = newLang
      document.documentElement.setAttribute('data-lang', newLang)
      
      // บันทึกลงใน cookie สำหรับระบบอื่น
      document.cookie = `locale=${newLang};path=/;max-age=31536000`
      
      // รีโหลดหน้าเพื่อให้การเปลี่ยนแปลงมีผลทันที
      window.location.reload()
      
      console.log('Language switched to:', newLang)
    } catch (error) {
      console.error('Error toggling language:', error)
    }
  }

  return (
    <button 
      onClick={handleLanguageToggle}
      className="flex items-center gap-1 py-1.5 px-3 rounded-full bg-gray-900 dark:bg-gray-800 text-white hover:bg-black dark:hover:bg-gray-700 transition-colors border-2 border-gray-700 dark:border-gray-600"
      suppressHydrationWarning={true}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">{lang === 'th' ? 'TH/EN' : 'EN/TH'}</span>
    </button>
  )
} 