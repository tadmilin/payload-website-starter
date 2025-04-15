'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function OrderHomePage() {
  const [address, setAddress] = useState('');
  const [electricBill, setElectricBill] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const menuRef = useRef(null);
  const router = useRouter();

  const translations = {
    th: {
      menu: 'เมนู',
      homePage: 'หน้าหลัก',
      simulator: 'จำลองการติดตั้ง',
      shop: 'ร้านค้า',
      trackSystem: 'ติดตามระบบ',
      aboutUs: 'เกี่ยวกับเรา',
      contactUs: 'ติดต่อเรา',
      login: 'เข้าสู่ระบบ',
      freeConsultation: 'ขอคำปรึกษาฟรี',
      changeLanguage: 'เปลี่ยนภาษา: TH/EN',
      freeEstimate: 'ประเมินราคาโซลาร์ฟรี',
      enterAddress: 'กรอกที่อยู่และค่าไฟฟ้า เราจะคำนวณราคาเบื้องต้น — ฟรี, รวดเร็ว, ไม่มีแรงกดดัน',
      homeAddress: 'ที่อยู่บ้าน',
      homeAddressPlaceholder: 'กรอกที่อยู่บ้านของคุณ',
      electricBill: 'ค่าไฟเฉลี่ย',
      month: 'เดือน',
      electricBillPlaceholder: 'กรอกค่าไฟต่อเดือนโดยประมาณ',
      continue: 'ดำเนินการต่อ'
    },
    en: {
      menu: 'Menu',
      homePage: 'Home',
      simulator: 'Installation Simulator',
      shop: 'Shop',
      trackSystem: 'Track System',
      aboutUs: 'About Us',
      contactUs: 'Contact Us',
      login: 'Login',
      freeConsultation: 'Free Consultation',
      changeLanguage: 'Change Language: EN/TH',
      freeEstimate: 'Free Solar Estimate',
      enterAddress: 'Enter your address and electric bill. We\'ll calculate a rough cost — free, fast, no pressure',
      homeAddress: 'Home Address',
      homeAddressPlaceholder: 'Enter your home address',
      electricBill: 'Average Electric Bill',
      month: 'month',
      electricBillPlaceholder: 'Enter your monthly electric bill',
      continue: 'Continue'
    }
  };
  
  const tr = (key) => {
    return translations[currentLang]?.[key] || translations.en[key];
  };

  useEffect(() => {
    const initLang = 'en';
    localStorage.setItem('language', initLang);
    document.documentElement.lang = initLang;
    document.documentElement.setAttribute('data-lang', initLang);
    setCurrentLang(initLang);
    
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
    const newLang = currentLang === 'en' ? 'th' : 'en';
    
    localStorage.setItem('language', newLang);
    
    document.documentElement.lang = newLang;
    document.documentElement.setAttribute('data-lang', newLang);
    
    setCurrentLang(newLang);
    
    document.cookie = `locale=${newLang};path=/;max-age=31536000`;
    document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`;
    
    console.log('เปลี่ยนภาษาเป็น:', newLang);
    
    setIsMenuOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/order-summary');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="text-black font-bold">
            <Link href="/" className="flex items-center">
              <span className="text-lg mr-1">☀️</span>
              <span className="text-sm tracking-wider">SOLARLAA</span>
            </Link>
          </div>
          
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
                  suppressHydrationWarning
                >
                  {tr('homePage')}
                </Link>
                <Link 
                  href="/simulator"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                  suppressHydrationWarning
                >
                  {tr('simulator')}
                </Link>
                <Link 
                  href="/shop"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                  suppressHydrationWarning
                >
                  {tr('shop')}
                </Link>
                <Link 
                  href="/track-system"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                  suppressHydrationWarning
                >
                  {tr('trackSystem')}
                </Link>
                <Link 
                  href="/about-us"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                  suppressHydrationWarning
                >
                  {tr('aboutUs')}
                </Link>
                <Link 
                  href="/contact-us"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                  suppressHydrationWarning
                >
                  {tr('contactUs')}
                </Link>
                <Link 
                  href="/login"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554] border-b border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                  suppressHydrationWarning
                >
                  {tr('login')}
                </Link>
                <Link 
                  href="/ขอคำปรึกษาฟรี"
                  className="block px-4 py-3 text-sm text-white hover:bg-[#344554]"
                  onClick={() => setIsMenuOpen(false)}
                  suppressHydrationWarning
                >
                  {tr('freeConsultation')}
                </Link>
                <div className="px-4 py-2 text-xs text-white/70 border-t border-gray-700">
                  <button 
                    className="text-sm text-white hover:text-yellow-400 transition-colors font-medium"
                    onClick={handleLanguageToggle}
                    suppressHydrationWarning
                  >
                    {tr('changeLanguage')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row pt-[60px]">
        <div className="hidden md:block md:w-1/2 lg:w-3/5 relative" style={{ height: 'calc(100vh - 60px)' }}>
          <Image 
            src="/images/5.png" 
            alt="Solar House" 
            fill 
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        <div className="w-full md:w-1/2 lg:w-2/5 max-w-md mx-auto md:mx-0 px-6 md:px-8 py-6 flex flex-col justify-center" style={{ height: 'calc(100vh - 60px)' }}>
          <div className="relative w-full h-80 md:hidden mb-6">
            <Image 
              src="/images/5.png" 
              alt="Solar House" 
              fill 
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          <h1 className="text-2xl font-semibold text-gray-800 mb-2" suppressHydrationWarning>{tr('freeEstimate')}</h1>
          <p className="text-gray-600 text-sm mb-6" suppressHydrationWarning>
            {tr('enterAddress')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="homeAddress" className="block text-sm font-medium text-gray-700 mb-1" suppressHydrationWarning>
                {tr('homeAddress')}
              </label>
              <input
                type="text"
                id="homeAddress"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={tr('homeAddressPlaceholder')}
                suppressHydrationWarning
              />
            </div>

            <div>
              <label htmlFor="electricBill" className="block text-sm font-medium text-gray-700 mb-1" suppressHydrationWarning>
                {tr('electricBill')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="electricBill"
                  value={electricBill}
                  onChange={(e) => setElectricBill(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-16"
                  placeholder={tr('electricBillPlaceholder')}
                  suppressHydrationWarning
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 text-sm" suppressHydrationWarning>
                  /{tr('month')}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              suppressHydrationWarning
            >
              {tr('continue')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 