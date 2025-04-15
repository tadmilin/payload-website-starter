'use client'

import React, { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'

export const LanguageSwitcherClient = () => {
  const [lang, setLang] = useState<string>('th')
  const [mounted, setMounted] = useState(false)

  // โหลดข้อมูลจาก localStorage เมื่อคอมโพเนนต์ถูกโหลด
  useEffect(() => {
    try {
      // ฟังก์ชั่นอัพเดตภาษาจาก localStorage
      const updateLanguageFromStorage = () => {
        const savedLang = localStorage.getItem('language') || 'th';
        setLang(savedLang);
        
        // อัพเดต DOM ให้ตรงกับภาษาที่บันทึกไว้
        document.documentElement.lang = savedLang;
        document.documentElement.setAttribute('data-lang', savedLang);
      };
      
      // เรียกใช้ฟังก์ชั่นเมื่อคอมโพเนนต์ถูกโหลด
      updateLanguageFromStorage();
      setMounted(true);
      
      // ฟังก์ชั่นรับ event toggle-language
      const handleToggleEvent = (event: CustomEvent) => {
        const newLang = event.detail?.language;
        if (newLang) {
          setLang(newLang);
          console.log('LanguageSwitcherClient: ได้รับการเปลี่ยนภาษาเป็น', newLang);
        }
      };
      
      // ฟังก์ชั่นรับการเปลี่ยนแปลงใน localStorage
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'language' && event.newValue) {
          setLang(event.newValue);
          console.log('LanguageSwitcherClient: localStorage เปลี่ยนเป็น', event.newValue);
        }
      };
      
      // เพิ่ม event listeners
      document.addEventListener('toggle-language', handleToggleEvent as EventListener);
      window.addEventListener('storage', handleStorageChange);
      
      // ลบ event listeners เมื่อ component unmount
      return () => {
        document.removeEventListener('toggle-language', handleToggleEvent as EventListener);
        window.removeEventListener('storage', handleStorageChange);
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
      
      // ส่ง event เพื่อให้ส่วนอื่นๆ ทราบว่ามีการเปลี่ยนภาษา
      const event = new CustomEvent('toggle-language', {
        detail: { language: newLang }
      });
      document.dispatchEvent(event);
      
      // อัพเดต Context language ผ่าน cookie
      document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`
      
      console.log('เปลี่ยนภาษาเป็น:', newLang)
      
      // รอสักครู่เพื่อให้ event ถูกประมวลผลก่อนรีโหลดหน้า
      setTimeout(() => {
        window.location.reload();
      }, 50);
    } catch (error) {
      console.error('Error toggling language:', error)
    }
  }

  // รอให้คอมโพเนนต์ถูกโหลดบน client-side ก่อนแสดงผล
  if (!mounted) {
    return null;
  }

  return (
    <button 
      onClick={handleLanguageToggle}
      className="flex items-center gap-1 py-1.5 px-3 rounded-full bg-gray-900 dark:bg-gray-800 text-white hover:bg-black dark:hover:bg-gray-700 transition-colors border-2 border-gray-700 dark:border-gray-600"
      suppressHydrationWarning={true}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium" suppressHydrationWarning={true}>
        {lang === 'th' ? 'TH/EN' : 'EN/TH'}
      </span>
    </button>
  )
} 