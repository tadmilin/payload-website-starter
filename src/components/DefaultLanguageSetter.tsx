'use client'

import { useEffect } from 'react'

export default function DefaultLanguageSetter() {
  useEffect(() => {
    try {
      // ถ้ายังไม่มีการตั้งค่าภาษาใน localStorage ให้ตั้งค่าเริ่มต้นเป็นภาษาไทย
      const savedLang = localStorage.getItem('language')
      if (!savedLang) {
        localStorage.setItem('language', 'th')
        document.documentElement.lang = 'th'
        document.documentElement.setAttribute('data-lang', 'th')
        console.log('Default language set to Thai')
      }
    } catch (error) {
      console.error('Error setting default language:', error)
    }
  }, [])

  return null
} 