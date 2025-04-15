'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function OrderSummaryPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en'); // เริ่มต้นด้วย en เสมอ
  const menuRef = useRef(null);

  useEffect(() => {
    // ตั้งค่าภาษาเริ่มต้นเป็น EN ทุกครั้ง
    const initLang = 'en';
    localStorage.setItem('language', initLang);
    document.documentElement.lang = initLang;
    document.documentElement.setAttribute('data-lang', initLang);
    setCurrentLang(initLang);
    
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
    const newLang = currentLang === 'en' ? 'th' : 'en';
    
    // บันทึกลงใน localStorage
    localStorage.setItem('language', newLang);
    
    // อัพเดต DOM
    document.documentElement.lang = newLang;
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
      back: 'ย้อนกลับ',
      recommendedSystem: 'ระบบที่แนะนำ',
      kitNeeded: 'ประมาณการณ์: ต้องการ 1 ชุด',
      edit: 'แก้ไข',
      saveEstimated: 'ประหยัดประมาณ 2,000 บาท/เดือน',
      monthlyBill: 'จากค่าไฟฟ้ารายเดือนของคุณ',
      bahtSaved: 'ประหยัดได้ 2,000 บาท',
      withSolarlaa: 'ด้วย SOLARLAA',
      currentBill: 'ค่าไฟปัจจุบัน',
      perMonth: 'บาท/เดือน',
      total: 'รวมทั้งสิ้น',
      baht: 'บาท',
      paybackPeriod: 'ระยะเวลาคืนทุน: เพียง 5 ปี',
      noHiddenFees: 'ไม่มีค่าใช้จ่ายแอบแฝง รวมการให้คำปรึกษาฟรี',
      viewOrderSummary: 'ดูสรุปคำสั่งซื้อ',
      continueToView: 'ดำเนินการต่อเพื่อดูสรุปราคาและสั่งซื้อระบบของคุณ',
      continueToOrderSummary: 'ดำเนินการต่อไปยังสรุปคำสั่งซื้อ',
      save: 'บันทึก'
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
      back: 'Back',
      recommendedSystem: 'Recommended System',
      kitNeeded: 'Estimated: 1 kit needed',
      edit: 'Edit',
      saveEstimated: 'Save Est. 2,000 baht/month',
      monthlyBill: 'On Your Monthly Electric Bill',
      bahtSaved: '2,000 baht saved',
      withSolarlaa: 'With SOLARLAA',
      currentBill: 'Current bill',
      perMonth: 'baht/month',
      total: 'Total',
      baht: 'baht',
      paybackPeriod: 'Payback Period: Just 5 years',
      noHiddenFees: 'No hidden fees. Free consultation included',
      viewOrderSummary: 'View order Summary',
      continueToView: 'Continue to view pricing summary and order your system',
      continueToOrderSummary: 'Continue to Order Summary',
      save: 'Save'
    }
  };
  
  // ช่วยการแปลข้อความ
  const tr = (key) => {
    return translations[currentLang]?.[key] || translations.en[key];
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex justify-between items-center max-w-6xl mx-auto">
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

      {/* Content */}
      <div className="pt-16 pb-6 px-4 sm:px-6 md:px-8 max-w-md mx-auto w-full">
        {/* Back Button */}
        <div className="mb-4">
          <Link href="/order-home" className="text-gray-500 text-sm flex items-center" suppressHydrationWarning>
            <span>&#8592;</span>
            <span className="ml-1">{tr('back')}</span>
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5" suppressHydrationWarning>{tr('recommendedSystem')}</h1>

        {/* Solar Panel Info */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-gray-800 font-medium">SOLARLAA Kit M10w</div>
            <div className="text-gray-500 text-sm" suppressHydrationWarning>{tr('kitNeeded')}</div>
          </div>
          <div className="w-16 h-16 relative">
            <Image
              src="/images/5.png"
              alt="Solar Panel"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 640px) 64px, 64px"
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex justify-between items-center mb-5">
          <div className="text-sm text-gray-600">
            278/12 Ekkamai Complex,<br />
            Sukhumvit 63 10110
          </div>
          <button className="text-blue-500 text-sm font-medium" suppressHydrationWarning>
            {tr('edit')}
          </button>
        </div>

        <div className="h-px bg-gray-200 my-5"></div>

        {/* Savings Info */}
        <div className="mb-2">
          <div className="text-gray-800 font-medium" suppressHydrationWarning>{tr('saveEstimated')}</div>
          <div className="text-gray-500 text-sm" suppressHydrationWarning>{tr('monthlyBill')}</div>
        </div>
        
        {/* Chart */}
        <div className="my-5">
          <div className="text-center text-xs text-gray-500 mb-2" suppressHydrationWarning>{tr('bahtSaved')}</div>
          <div className="flex items-end h-28 sm:h-32 mb-2">
            <div className="w-1/2 flex justify-center">
              <div className="w-16 sm:w-24 bg-blue-500 h-24 sm:h-28"></div>
            </div>
            <div className="w-1/2 flex justify-center">
              <div className="w-16 sm:w-24 bg-gray-200 h-20 sm:h-24"></div>
            </div>
          </div>
          <div className="flex text-xs text-gray-500">
            <div className="w-1/2 text-center">
              <div suppressHydrationWarning>{tr('withSolarlaa')}</div>
            </div>
            <div className="w-1/2 text-center">
              <div suppressHydrationWarning>{tr('currentBill')}</div>
              <div suppressHydrationWarning>5,000 {tr('perMonth')}</div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-5"></div>

        {/* Total and Payback */}
        <div className="mb-5">
          <div className="flex justify-between mb-2">
            <div className="font-bold text-gray-800" suppressHydrationWarning>{tr('total')}</div>
            <div className="font-bold text-gray-800" suppressHydrationWarning>140,000 {tr('baht')}</div>
          </div>
          <div className="text-sm text-gray-600" suppressHydrationWarning>{tr('paybackPeriod')}</div>
          <div className="text-sm text-gray-600" suppressHydrationWarning>{tr('noHiddenFees')}</div>
        </div>

        {/* View order summary */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2" suppressHydrationWarning>{tr('viewOrderSummary')}</h2>
          <p className="text-sm text-gray-600" suppressHydrationWarning>
            {tr('continueToView')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-6">
          <Link href="/order-final" className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 text-center rounded-md" suppressHydrationWarning>
            {tr('continueToOrderSummary')}
          </Link>
          <button className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 text-center rounded-md" suppressHydrationWarning>
            {tr('save')}
          </button>
        </div>
      </div>
    </div>
  )
} 