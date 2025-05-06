'use client';

import { useEffect } from 'react';

/**
 * คอมโพเนนต์นี้ทำหน้าที่ตรวจสอบและติดตั้งภาษาจาก URL และ localStorage
 * โดยจะทำงานเมื่อโหลดเพจและเมื่อมีการเปลี่ยนภาษา
 */
export default function LanguageDetector() {
  useEffect(() => {
    try {
      // ดึงภาษาจาก localStorage (ถ้ามี)
      const savedLang = localStorage.getItem('language') || 'en';

      // ตั้งค่าภาษาให้กับ HTML document
      document.documentElement.lang = savedLang;
      document.documentElement.setAttribute('data-lang', savedLang);

      // อัพเดต Cookies สำหรับระบบอื่นๆ
      document.cookie = `locale=${savedLang};path=/;max-age=31536000`;
      document.cookie = `NEXT_LOCALE=${savedLang};path=/;max-age=31536000`;

      // ฟังก์ชันตรวจสอบการเปลี่ยนภาษา
      const handleLanguageChange = (event: Event | StorageEvent) => {
        if (event instanceof StorageEvent && event.key === 'language') {
          const newLang = event.newValue || 'th';
          document.documentElement.lang = newLang;
          document.documentElement.setAttribute('data-lang', newLang);
          document.cookie = `locale=${newLang};path=/;max-age=31536000`;
          document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`;
          console.log('Language changed from storage event:', newLang);
        }
      };

      // ฟังก์ชันรับเหตุการณ์ toggle-language
      const handleToggleEvent = (event: CustomEvent) => {
        const newLang = event.detail?.language || (savedLang === 'th' ? 'en' : 'th');
        console.log('Language toggle event received:', newLang);

        // อัพเดต localStorage
        localStorage.setItem('language', newLang);

        // อัพเดต HTML attributes
        document.documentElement.lang = newLang;
        document.documentElement.setAttribute('data-lang', newLang);

        // อัพเดต cookies
        document.cookie = `locale=${newLang};path=/;max-age=31536000`;
        document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`;
      };

      // เพิ่ม Event Listeners
      window.addEventListener('storage', handleLanguageChange);
      document.addEventListener('toggle-language', handleToggleEvent as EventListener);

      // ลบ Event Listeners เมื่อคอมโพเนนต์ถูกทำลาย
      return () => {
        window.removeEventListener('storage', handleLanguageChange);
        document.removeEventListener('toggle-language', handleToggleEvent as EventListener);
      };
    } catch (error) {
      console.error('Error in LanguageDetector:', error);
    }
  }, []);

  // คอมโพเนนต์นี้ไม่แสดงผลใดๆ เป็นเพียงการทำงานเบื้องหลัง
  return null;
}
