'use client'

import React, { useEffect, useState } from 'react'
import Script from 'next/script'

export default function FrontendClientScripts() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // อัพเดต mounted flag เมื่อโค้ดทำงานบน client
    setMounted(true);
    
    // ตั้งค่าภาษาเริ่มต้นเป็นภาษาไทยถ้ายังไม่มีการตั้งค่า
    try {
      const savedLang = localStorage.getItem('language')
      if (!savedLang) {
        localStorage.setItem('language', 'th')
        // ใช้เฉพาะ setAttribute แทนการตั้งค่า lang โดยตรง
        document.documentElement.setAttribute('data-lang', 'th')
        console.log('Default language set to Thai by FrontendClientScripts')
      } else {
        // ตั้งค่าภาษาตามที่บันทึกไว้ ใช้เฉพาะ setAttribute
        document.documentElement.setAttribute('data-lang', savedLang)
      }
      
      // เพิ่ม Event Listener สำหรับการเปลี่ยนภาษา
      const handleLanguageToggle = (event: CustomEvent) => {
        const newLang = event.detail?.language || 'th'
        console.log('Received language toggle event:', newLang)
        
        // อัพเดต localStorage และ data-lang attribute
        document.documentElement.setAttribute('data-lang', newLang)
        localStorage.setItem('language', newLang)
        
        // อัพเดต cookies
        document.cookie = `locale=${newLang};path=/;max-age=31536000`
        document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`
      }
      
      document.addEventListener('toggle-language', handleLanguageToggle as EventListener)
      
      return () => {
        document.removeEventListener('toggle-language', handleLanguageToggle as EventListener)
      }
    } catch (error) {
      console.error('Error in FrontendClientScripts:', error)
    }
  }, [])
  
  // ถ้ายังไม่ได้ mount บน client ให้คืนค่า null หรือ fragment ว่างเปล่า
  if (!mounted) {
    return null;
  }
  
  return (
    <>
      {/* เอาส่วน Script strategy="beforeInteractive" ออกเพื่อแก้ไขปัญหา hydration mismatch */}
      
      <style jsx global>{`
        /* ซ่อนทุกอย่างที่เกี่ยวกับ Payload */
        nav.payload-nav,
        header.payload-header,
        .payload-header,
        .payload-nav,
        .admin-bar,
        div[class*="payload-"],
        footer.payload-footer,
        .payload-footer {
          display: none !important;
        }
        
        /* ซ่อน AdminBar */
        .admin-bar {
          display: none !important;
        }
        
        /* ซ่อน Header ของ Payload */
        header:has(.payload-logo), 
        header:has([alt="Payload Logo"]) {
          display: none !important;
        }
      `}</style>
    </>
  )
} 