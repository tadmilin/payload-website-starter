'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

export default function ContactUsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { t } = useTranslation();
  
  useEffect(() => {
    setIsLoaded(true);
    
    // ตั้งค่าภาษาเริ่มต้นเป็น TH
    if (typeof window !== 'undefined' && !localStorage.getItem('language')) {
      localStorage.setItem('language', 'th');
      document.documentElement.lang = 'th';
      document.documentElement.setAttribute('data-lang', 'th');
    }
    
    // ปิดเมนูเมื่อคลิกนอกพื้นที่เมนู
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageToggle = () => {
    const currentLang = localStorage.getItem('language') || 'th';
    const newLang = currentLang === 'en' ? 'th' : 'en';
    
    // บันทึกลงใน localStorage
    localStorage.setItem('language', newLang);
    
    // อัพเดต DOM
    document.documentElement.lang = newLang;
    document.documentElement.setAttribute('data-lang', newLang);
    
    // สร้างและส่ง Custom Event
    const event = new CustomEvent('toggle-language', { 
      detail: { language: newLang } 
    });
    document.dispatchEvent(event);
    
    // อัพเดต cookies
    document.cookie = `locale=${newLang};path=/;max-age=31536000`;
    document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`;
    
    console.log('เปลี่ยนภาษาเป็น:', newLang);
    
    // ปิดเมนู
    setIsMenuOpen(false);
    
    // รีโหลดหน้าหลังจากส่ง event สักครู่ (เพื่อให้คอมโพเนนต์อื่นได้รับ event ก่อน)
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="px-4 py-3 flex justify-between items-center">
          {/* โลโก้ */}
          <div className="text-black font-bold">
            <Link href="/" className="flex items-center">
              <span className="text-lg mr-1">☀️</span>
              <span className="text-sm tracking-wider">SOLARLAA</span>
            </Link>
          </div>
          
          {/* ปุ่ม Menu */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={toggleMenu}
              className="px-5 py-1.5 bg-[#233544] text-white text-xs font-medium rounded-sm"
              suppressHydrationWarning
            >
              Menu
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#233544] rounded-sm shadow-lg z-50">
                <Link 
                  href="/"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  หน้าหลัก
                </Link>
                <Link 
                  href="/simulator"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  จำลองการติดตั้ง
                </Link>
                <Link 
                  href="/shop"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ร้านค้า
                </Link>
                <Link 
                  href="/ติดตามระบบ"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ติดตามระบบ
                </Link>
                <Link 
                  href="/สำหรับบ้าน"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  สำหรับบ้าน
                </Link>
                <Link 
                  href="/สำหรับธุรกิจ"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  สำหรับธุรกิจ
                </Link>
                <Link 
                  href="/about-us"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  เกี่ยวกับเรา
                </Link>
                <Link 
                  href="/contact-us"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700 bg-[#344554]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ติดต่อเรา
                </Link>
                <Link 
                  href="/login"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link 
                  href="/ขอคำปรึกษาฟรี"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ขอคำปรึกษาฟรี
                </Link>
                <div className="px-4 py-2 text-xs text-white/70 border-t border-gray-700">
                  <button 
                    className="text-sm text-white hover:text-yellow-400 transition-colors font-medium"
                    onClick={handleLanguageToggle}
                  >
                    เปลี่ยนภาษา: TH/EN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* หน้าติดต่อเรา */}
      <div className="container mx-auto px-4 pt-20 pb-12">
        {/* ส่วนหัว */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">ติดต่อเรา</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">มีคำถามเกี่ยวกับระบบโซลาร์เซลล์หรือต้องการข้อมูลเพิ่มเติม? ทีมงานของเรายินดีให้คำปรึกษาและช่วยเหลือคุณ</p>
        </div>
        
        {/* ข้อมูลการติดต่อ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">ข้อมูลติดต่อ</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">โทรศัพท์</h3>
                  <p className="text-gray-600">02-123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">อีเมล</h3>
                  <p className="text-gray-600">info@solarlaa.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">ที่อยู่</h3>
                  <p className="text-gray-600">123 อาคารโซลาร์ ชั้น 15, ถนนสีลม, กรุงเทพฯ 10500</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">เวลาทำการ</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-medium">วันจันทร์ - วันศุกร์</span>
                <span>8:30 - 17:30 น.</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-medium">วันเสาร์</span>
                <span>9:00 - 15:00 น.</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">วันอาทิตย์และวันหยุดนักขัตฤกษ์</span>
                <span>ปิดทำการ</span>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium text-gray-800 mb-2">ช่องทางโซเชียลมีเดีย</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-blue-600 text-white p-2 rounded-full">FB</a>
                <a href="#" className="bg-blue-400 text-white p-2 rounded-full">TW</a>
                <a href="#" className="bg-pink-600 text-white p-2 rounded-full">IG</a>
                <a href="#" className="bg-red-600 text-white p-2 rounded-full">YT</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#01121f] text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">© 2024 SOLARLAA</p>
          <div className="mt-2">
            <Link 
              href="/ขอคำปรึกษาฟรี"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              ขอคำปรึกษาฟรี
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
} 