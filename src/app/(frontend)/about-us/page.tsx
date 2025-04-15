'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

export default function AboutUsPage() {
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
    const currentLang = localStorage.getItem('language') || 'en';
    const newLang = currentLang === 'en' ? 'th' : 'en';
    localStorage.setItem('language', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.setAttribute('data-lang', newLang);
    document.dispatchEvent(
      new CustomEvent('toggle-language', { detail: { language: newLang } })
    );
    window.location.reload();
    setIsMenuOpen(false);
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
                  href="http://localhost:3001/shop"
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
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700 bg-[#344554]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  เกี่ยวกับเรา
                </Link>
                <Link 
                  href="/contact-us"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
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

      {/* Main Content */}
      <div className="pt-16">
        {/* แผนที่การใช้งาน SOLARLAA - รูปแบบใหม่ */}
        <section className="relative bg-gradient-to-r from-blue-900 to-[#01121f] py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">เครือข่ายพลังงานสะอาด<br/>ทั่วประเทศไทย</h1>
              <div className="h-1 w-24 bg-yellow-400 mb-8"></div>
              <p className="text-blue-100 max-w-2xl text-lg">SOLARLAA สร้างเครือข่ายพลังงานสะอาดครอบคลุมทุกภูมิภาค มุ่งมั่นขยายการใช้งานอย่างต่อเนื่องเพื่ออนาคตที่ยั่งยืน</p>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 md:p-2">
                  <div className="relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/70 z-10"></div>
                    <Image
                      src="/images/map-background.jpg"
                      alt="แผนที่ประเทศไทย"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    
                    {/* จุดตัวอย่างที่เด่นชัด - แบบใหม่ */}
                    <div className="absolute top-[40%] left-[45%] z-20 animate-pulse">
                      <div className="relative">
                        <div className="bg-yellow-400 text-black font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg">82</div>
                        <div className="absolute -bottom-1 -right-1 w-20 bg-white text-xs rounded-full px-2 py-0.5 shadow-md text-center">กรุงเทพฯ</div>
                      </div>
                    </div>
                    
                    <div className="absolute top-[30%] left-[30%] z-20">
                      <div className="relative">
                        <div className="bg-yellow-400 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg">31</div>
                        <div className="absolute -bottom-1 -right-1 w-20 bg-white text-xs rounded-full px-2 py-0.5 shadow-md text-center">นครสวรรค์</div>
                      </div>
                    </div>

                    <div className="absolute top-[15%] right-[30%] z-20">
                      <div className="relative">
                        <div className="bg-yellow-400 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg">21</div>
                        <div className="absolute -bottom-1 -right-1 w-16 bg-white text-xs rounded-full px-2 py-0.5 shadow-md text-center">อุดรธานี</div>
                      </div>
                    </div>

                    <div className="absolute bottom-[20%] left-[30%] z-20">
                      <div className="relative">
                        <div className="bg-yellow-400 text-black font-bold rounded-full w-9 h-9 flex items-center justify-center shadow-lg">16</div>
                        <div className="absolute -bottom-1 -right-1 w-16 bg-white text-xs rounded-full px-2 py-0.5 shadow-md text-center">ภูเก็ต</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-5/12">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                    <div className="text-6xl md:text-7xl font-extrabold text-yellow-400">579</div>
                    <div className="mt-3 text-blue-100 text-lg">เขต/อำเภอ<br/>ทั่วประเทศไทย</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                    <div className="text-6xl md:text-7xl font-extrabold text-yellow-400">5k+</div>
                    <div className="mt-3 text-blue-100 text-lg">ระบบ<br/>ที่ติดตั้งแล้ว</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                    <div className="text-6xl md:text-7xl font-extrabold text-yellow-400">12k</div>
                    <div className="mt-3 text-blue-100 text-lg">ตันคาร์บอน<br/>ที่ลดได้ต่อปี</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                    <div className="text-4xl font-bold text-white flex items-center justify-center h-full">
                      <Link href="/consultation" className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 transition-all duration-300 text-black px-5 py-3 rounded-lg inline-block">
                        เริ่มต้น<br/>กับเรา
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 text-center lg:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">ครอบคลุมทั่วประเทศไทย</h2>
                  <p className="text-blue-100">เราภูมิใจที่ได้ติดตั้งระบบโซลาร์เซลล์ให้ลูกค้ากว่า 10,000 ครัวเรือนและธุรกิจทั่วประเทศ ด้วยทีมงานคุณภาพและบริการหลังการขายที่เป็นเลิศ</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
        </section>

        {/* เรื่องราวของเรา */}
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center text-[#01121f]">เรื่องราวของเรา</h2>
              <div className="space-y-6 text-gray-700">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full mr-4 flex items-center justify-center text-black font-bold">1</div>
                    <h3 className="text-xl font-semibold">การเริ่มต้น</h3>
                  </div>
                  <p>SOLARLAA ก่อตั้งขึ้นในปี 2018 ด้วยวิสัยทัศน์ที่จะทำให้พลังงานแสงอาทิตย์เป็นทางเลือกหลักสำหรับทุกบ้านและธุรกิจในประเทศไทย</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full mr-4 flex items-center justify-center text-black font-bold">2</div>
                    <h3 className="text-xl font-semibold">การเติบโต</h3>
                  </div>
                  <p>เริ่มต้นจากทีมวิศวกรเล็กๆ ที่มีความหลงใหลในพลังงานทดแทน พวกเราเติบโตอย่างรวดเร็วกลายเป็นหนึ่งในผู้นำด้านการติดตั้งและจำหน่ายระบบพลังงานแสงอาทิตย์</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full mr-4 flex items-center justify-center text-black font-bold">3</div>
                    <h3 className="text-xl font-semibold">ความสำเร็จ</h3>
                  </div>
                  <p>ตลอดระยะเวลาที่ผ่านมา เราได้ติดตั้งระบบโซลาร์เซลล์ไปแล้วมากกว่า 5,000 ระบบทั่วประเทศ ช่วยให้ลูกค้าประหยัดค่าไฟฟ้าและลดการปล่อยคาร์บอนไดออกไซด์รวมกว่า 12,000 ตันต่อปี</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ระบบที่ติดตั้งและสถิติ */}
        <section className="bg-[#01121f] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">สถิติการติดตั้งระบบของเรา</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#122535] p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold mb-2 text-yellow-400">5,000+</div>
                  <div className="text-lg text-gray-300">ระบบที่ติดตั้ง</div>
                </div>
                
                <div className="bg-[#122535] p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold mb-2 text-yellow-400">12,000</div>
                  <div className="text-lg text-gray-300">ตันคาร์บอนที่ลดได้ต่อปี</div>
                </div>
                
                <div className="bg-[#122535] p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold mb-2 text-yellow-400">579</div>
                  <div className="text-lg text-gray-300">เขต/อำเภอทั่วประเทศ</div>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <Link href="/consultation" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-8 rounded-lg transition-colors">
                  ขอคำปรึกษาฟรี
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p>© 2024 SOLARLAA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 