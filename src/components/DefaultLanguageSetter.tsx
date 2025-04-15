'use client'

import { useEffect, useState } from 'react'

export default function DefaultLanguageSetter() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      // ถ้ายังไม่มีการตั้งค่าภาษาใน localStorage ให้ตั้งค่าเริ่มต้นเป็นภาษาไทย
      const savedLang = localStorage.getItem('language')
      if (!savedLang) {
        // ตั้งค่าใน localStorage
        localStorage.setItem('language', 'th')
        
        // ตั้งค่า data-lang attribute แทน lang attribute
        document.documentElement.setAttribute('data-lang', 'th')
        
        // ตั้งค่า cookies สำหรับระบบต่างๆ
        document.cookie = 'locale=th;path=/;max-age=31536000'
        document.cookie = 'NEXT_LOCALE=th;path=/;max-age=31536000'
        
        console.log('Default language set to Thai')
      } else {
        // ตรวจสอบและอัพเดต data-lang attribute
        if (document.documentElement.getAttribute('data-lang') !== savedLang) {
          document.documentElement.setAttribute('data-lang', savedLang)
        }
        
        // ตรวจสอบและอัพเดต cookies ถ้าจำเป็น
        const localeCookie = document.cookie.match(/locale=([^;]+)/)?.[1]
        if (localeCookie !== savedLang) {
          document.cookie = `locale=${savedLang};path=/;max-age=31536000`
          document.cookie = `NEXT_LOCALE=${savedLang};path=/;max-age=31536000`
        }
      }
      
      setMounted(true);
    } catch (error) {
      console.error('Error setting default language:', error)
    }
  }, [])

  return null
} 