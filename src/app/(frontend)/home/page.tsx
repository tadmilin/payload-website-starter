'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en'); // เริ่มต้นด้วย en เสมอ
  const menuRef = useRef(null);
  const { t } = useTranslation();
  
  // ฟังก์ชันตรวจสอบภาษาปัจจุบัน
  const getCurrentLanguage = () => {
    return currentLang;
  };
  
  useEffect(() => {
    setIsLoaded(true);
    
    // ตั้งค่าภาษาเริ่มต้นเป็น EN ทุกครั้ง
    const initLang = 'en';
    localStorage.setItem('language', initLang);
    document.documentElement.setAttribute('data-lang', initLang);
    setCurrentLang(initLang);
    
    // เพิ่ม script tag ที่ตั้งค่าภาษาเริ่มต้น
    const script = document.createElement('script');
    script.innerHTML = `
      document.documentElement.setAttribute('data-lang', 'en');
      localStorage.setItem('language', 'en');
    `;
    script.async = true;
    document.head.appendChild(script);
    
    // ปิดเมนูเมื่อคลิกนอกพื้นที่เมนู
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.head.removeChild(script);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLanguageToggle = () => {
    const newLang = currentLang === 'en' ? 'th' : 'en';
    
    // บันทึกลงใน localStorage
    localStorage.setItem('language', newLang);
    
    // อัพเดต DOM
    document.documentElement.setAttribute('data-lang', newLang);
    
    // อัพเดต state
    setCurrentLang(newLang);
    
    // อัพเดต cookies
    document.cookie = `locale=${newLang};path=/;max-age=31536000`;
    document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`;
    
    console.log('เปลี่ยนภาษาเป็น:', newLang);
    
    // ปิดเมนู
    setIsMenuOpen(false);
  };
  
  // แปลข้อความตามภาษาที่เลือก
  const translations = {
    th: {
      solarMadeSimple: 'โซลาร์เซลล์ที่เข้าใจง่าย',
      fastCalculation: 'คำนวณรวดเร็ว ติดตั้งไร้รอยต่อ',
      freeOnlineConsultation: 'ขอคำปรึกษาออนไลน์ฟรี',
      forYourHome: 'สำหรับบ้านของคุณ',
      scheduleConsultation: 'นัดหมายรับคำปรึกษาฟรีออนไลน์',
      orderNow: 'สั่งซื้อเดี๋ยวนี้',
      learnMore: 'เรียนรู้เพิ่มเติม',
      forBusinessTitle: 'สำหรับธุรกิจ',
      weAre: 'เราคือ',
      solarlaa: 'SOLARLAA',
      trustedBy: 'ผู้ให้บริการโซลาร์เซลล์ที่ไว้วางใจโดย 579+ ชุมชนทั่วประเทศไทย',
      getToKnowUs: 'รู้จักเรามากขึ้น',
      aboutUsButton: 'เกี่ยวกับเรา',
      menu: 'เมนู',
      changeLanguage: 'เปลี่ยนภาษา: TH/EN',
      homePage: 'หน้าหลัก',
      simulator: 'จำลองการติดตั้ง',
      shop: 'ร้านค้า',
      trackSystem: 'ติดตามระบบ',
      forHome: 'สำหรับบ้าน',
      forBusiness: 'สำหรับธุรกิจ',
      aboutUs: 'เกี่ยวกับเรา',
      contactUs: 'ติดต่อเรา',
      login: 'เข้าสู่ระบบ',
      freeConsultation: 'ขอคำปรึกษาฟรี',
      allRightsReserved: 'สงวนลิขสิทธิ์',
      scheduleConsultationToday: 'นัดหมายรับคำปรึกษาฟรีวันนี้'
    },
    en: {
      solarMadeSimple: 'Solar made simple',
      fastCalculation: 'Fast calculation, seamless installation',
      freeOnlineConsultation: 'Free Online Consultation',
      forYourHome: 'For Your Home',
      scheduleConsultation: 'Schedule a Free Online Consultation',
      orderNow: 'Order Now',
      learnMore: 'Learn more',
      forBusinessTitle: 'For Business',
      weAre: 'We are',
      solarlaa: 'SOLARLAA',
      trustedBy: 'Trusted by 579+ communities across Thailand',
      getToKnowUs: 'Get to know us',
      aboutUsButton: 'About Us',
      menu: 'Menu',
      changeLanguage: 'Change Language: EN/TH',
      homePage: 'Home',
      simulator: 'Installation Simulator',
      shop: 'Shop',
      trackSystem: 'Track System',
      forHome: 'For Home',
      forBusiness: 'For Business',
      aboutUs: 'About Us',
      contactUs: 'Contact Us',
      login: 'Login',
      freeConsultation: 'Free Consultation',
      allRightsReserved: 'All rights reserved',
      scheduleConsultationToday: 'Schedule a Free Consultation Today'
    }
  };
  
  // ช่วยการแปลข้อความ
  const tr = (key) => {
    const lang = getCurrentLanguage();
    return translations[lang]?.[key] || translations.en[key];
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#01121f] text-white overflow-hidden">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="px-4 py-3 flex justify-between items-center">
          {/* โลโก้ */}
          <div className="text-white font-bold">
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
              {tr('menu')}
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#233544] rounded-sm shadow-lg z-50">
                <Link 
                  href="/"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tr('homePage')}
                </Link>
                <Link 
                  href="/simulator"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tr('simulator')}
                </Link>
                <Link 
                  href="/shop"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tr('shop')}
                </Link>
                <Link 
                  href="/track-system"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tr('trackSystem')}
                </Link>
                <Link 
                  href="/about-us"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tr('aboutUs')}
                </Link>
                <Link 
                  href="/contact-us"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tr('contactUs')}
                </Link>
                <Link 
                  href="/login"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tr('login')}
                </Link>
                <Link 
                  href="/consultation"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tr('freeConsultation')}
                </Link>
                <div className="px-4 py-2 text-xs text-white/70 border-t border-gray-700">
                  <button 
                    className="text-sm text-white hover:text-yellow-400 transition-colors font-medium"
                    onClick={handleLanguageToggle}
                  >
                    {tr('changeLanguage')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - 4 equal sections stacked vertically */}
      <div className="flex flex-col">
        {/* Hero Section - Solar made simple */}
        <section className={`relative h-screen w-full transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(1,18,31,0.6)), url('/images/1.png')",
              backgroundPosition: "center",
              backgroundSize: "cover"
            }}
          ></div>

          <div className="relative z-10 h-full flex flex-col items-center justify-between text-center px-6">
            <div className="mt-32">
              <h1 
                className={`font-semibold mb-2 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ width: '390px', height: '48px', fontSize: '40px', lineHeight: '1.2' }}
                suppressHydrationWarning
              >
                {tr('solarMadeSimple')}
              </h1>
              <p 
                className={`text-white/90 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ width: '390px', height: '22px', fontSize: '18px', lineHeight: '1.2' }}
                suppressHydrationWarning
              >
                {tr('fastCalculation')}
              </p>
            </div>
        
            <div className="w-full mb-8">
              <Link 
                href="/consultation" 
                className="inline-block w-full py-3 bg-[#0078FF] text-white text-center font-medium rounded-md"
                suppressHydrationWarning
              >
                {tr('freeOnlineConsultation')}
              </Link>
            </div>
          </div>
        </section>

        {/* For Your Home Section */}
        <section className={`relative h-screen w-full transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('/images/2.png')",
              backgroundPosition: "center bottom",
              backgroundSize: "cover"
            }}
          ></div>

          <div className="relative z-10 h-full flex flex-col items-center justify-between text-center px-6">
            <div className="mt-32">
              <h2 
                className="font-semibold mb-2"
                style={{ width: '390px', height: '48px', fontSize: '40px', lineHeight: '1.2' }}
                suppressHydrationWarning
              >
                {tr('forYourHome')}
              </h2>
              <p 
                className="text-white/90"
                style={{ width: '390px', height: '22px', fontSize: '18px', lineHeight: '1.2' }}
                suppressHydrationWarning
              >
                {tr('scheduleConsultation')}
              </p>
            </div>
            
            <div className="w-full mb-8">
              <div className="flex space-x-4 w-full">
                <Link 
                  href="/order-home" 
                  className="flex-1 py-3 bg-[#0078FF] text-white text-center font-medium rounded-md"
                  suppressHydrationWarning
                >
                  {tr('orderNow')}
                </Link>
                <Link 
                  href="/learn-home" 
                  className="flex-1 py-3 bg-white text-gray-900 text-center font-medium rounded-md"
                  suppressHydrationWarning
                >
                  {tr('learnMore')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* For Business Section */}
        <section className={`relative h-screen w-full transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('/images/3.png')",
              backgroundPosition: "center bottom",
              backgroundSize: "cover"
            }}
          ></div>

          <div className="relative z-10 h-full flex flex-col items-center justify-between text-center px-6">
            <div className="mt-32">
              <h2 
                className="font-semibold mb-2"
                style={{ width: '390px', height: '48px', fontSize: '40px', lineHeight: '1.2' }}
                suppressHydrationWarning
              >
                {tr('forBusinessTitle')}
              </h2>
            </div>
            
            <div className="w-full mb-8">
              <div className="flex space-x-4 w-full">
                <Link 
                  href="/order-business" 
                  className="flex-1 py-3 bg-[#0078FF] text-white text-center font-medium rounded-md"
                  suppressHydrationWarning
                >
                  {tr('orderNow')}
                </Link>
                <Link 
                  href="/learn-business" 
                  className="flex-1 py-3 bg-white text-gray-900 text-center font-medium rounded-md"
                  suppressHydrationWarning
                >
                  {tr('learnMore')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* We are SOLARLAA Section */}
        <section className={`relative h-screen w-full transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('/images/4.png')",
              backgroundPosition: "center bottom",
              backgroundSize: "cover"
            }}
          ></div>

          <div className="relative z-10 h-full flex flex-col items-center justify-between text-center px-6">
            <div className="mt-32">
              <h2 
                className="font-semibold mb-1"
                style={{ width: '390px', height: '88px', fontSize: '40px', lineHeight: '1.2' }}
                suppressHydrationWarning
              >
                <span suppressHydrationWarning>{tr('weAre')}</span><br />
                <span suppressHydrationWarning>{tr('solarlaa')}</span>
              </h2>
              <div style={{ height: '4px' }}></div>
              <p 
                className="text-white/90"
                style={{ width: '390px', height: '22px', fontSize: '18px', lineHeight: '1.2' }}
                suppressHydrationWarning
              >
                {tr('trustedBy')}
              </p>
            </div>
            
            <div className="w-full mb-8">
              <Link 
                href="/about-us" 
                className="block w-full py-3 bg-white text-gray-900 text-center font-medium rounded-md"
                suppressHydrationWarning
              >
                {tr('getToKnowUs')}
              </Link>
            </div>
          </div>
        </section>
      </div>
          
      {/* Footer */}
      <footer className={`text-center text-white/70 text-xs py-4 border-t border-white/10 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} mt-auto`}>
        <p className="mb-4" suppressHydrationWarning>SOLARLAA. {tr('allRightsReserved')} © 2025</p>
        <div className="px-6">
          <Link 
            href="/consultation" 
            className="block w-full py-3 bg-[#0078FF] text-white text-center font-medium rounded-md"
            suppressHydrationWarning
          >
            {tr('scheduleConsultationToday')}
          </Link>
        </div>
      </footer>
    </div>
  )
}