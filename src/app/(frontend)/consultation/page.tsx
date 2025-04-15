'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export default function ConsultationPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const menuRef = useRef(null);
  
  // ฟังก์ชันตรวจสอบภาษาปัจจุบัน
  const getCurrentLanguage = () => {
    return currentLang;
  };
  
  useEffect(() => {
    setIsLoaded(true);
    
    // ดึงภาษาจาก localStorage
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('language') || 'en';
      setCurrentLang(storedLang);
      document.documentElement.setAttribute('data-lang', storedLang);
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
      consultationTitle: 'ขอคำปรึกษาออนไลน์ฟรี',
      consultationDesc: 'กรอกข้อมูลด้านล่างเพื่อรับคำปรึกษาเกี่ยวกับการติดตั้งระบบโซลาร์เซลล์สำหรับบ้านหรือธุรกิจของคุณ',
      nameLabel: 'ชื่อ',
      namePlaceholder: 'กรุณากรอกชื่อของคุณ',
      emailLabel: 'อีเมล',
      emailPlaceholder: 'กรุณากรอกอีเมลของคุณ',
      phoneLabel: 'เบอร์โทรศัพท์',
      phonePlaceholder: 'กรุณากรอกเบอร์โทรศัพท์ของคุณ',
      typeLabel: 'ประเภทที่อยู่อาศัย',
      typeHome: 'บ้าน',
      typeBusiness: 'ธุรกิจ',
      messageLabel: 'ข้อความ',
      messagePlaceholder: 'กรุณากรอกรายละเอียดเพิ่มเติม (ตัวอย่าง: ขนาดของระบบที่ต้องการ, ที่อยู่, เวลาที่สะดวกรับสาย)',
      submitButton: 'ส่งข้อมูล',
      backToHomeButton: 'กลับไปหน้าหลัก',
      submissionSuccess: 'ขอบคุณสำหรับข้อมูล! เราจะติดต่อกลับโดยเร็วที่สุด',
      submissionError: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
      menu: 'เมนู',
      changeLanguage: 'เปลี่ยนภาษา: TH/EN',
      homePage: 'หน้าหลัก',
      simulator: 'จำลองการติดตั้ง',
      shop: 'ร้านค้า',
      trackSystem: 'ติดตามระบบ',
      aboutUs: 'เกี่ยวกับเรา',
      contactUs: 'ติดต่อเรา',
      login: 'เข้าสู่ระบบ',
      freeConsultation: 'ขอคำปรึกษาฟรี',
      allRightsReserved: 'สงวนลิขสิทธิ์'
    },
    en: {
      consultationTitle: 'Free Online Consultation',
      consultationDesc: 'Fill out the form below to get a consultation about solar installation for your home or business',
      nameLabel: 'Name',
      namePlaceholder: 'Enter your name',
      emailLabel: 'Email',
      emailPlaceholder: 'Enter your email',
      phoneLabel: 'Phone',
      phonePlaceholder: 'Enter your phone number',
      typeLabel: 'Property Type',
      typeHome: 'Home',
      typeBusiness: 'Business',
      messageLabel: 'Message',
      messagePlaceholder: 'Enter additional details (e.g., system size required, address, preferred call time)',
      submitButton: 'Submit',
      backToHomeButton: 'Back to Home',
      submissionSuccess: 'Thank you for your information! We will contact you as soon as possible.',
      submissionError: 'An error occurred. Please try again.',
      menu: 'Menu',
      changeLanguage: 'Change Language: EN/TH',
      homePage: 'Home',
      simulator: 'Installation Simulator',
      shop: 'Shop',
      trackSystem: 'Track System',
      aboutUs: 'About Us',
      contactUs: 'Contact Us',
      login: 'Login',
      freeConsultation: 'Free Consultation',
      allRightsReserved: 'All rights reserved'
    }
  };
  
  // ช่วยการแปลข้อความ
  const tr = (key) => {
    const lang = getCurrentLanguage();
    return translations[lang]?.[key] || translations.en[key];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // สำหรับจำลองการส่งข้อมูล
    setFormSubmitted(true);
    
    // ในโปรเจ็คจริงจะต้องมีการส่งข้อมูลไปยัง API
    console.log('Form submitted');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="sticky top-0 left-0 w-full z-50 bg-white shadow-sm">
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

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center py-8 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          {formSubmitted ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2" suppressHydrationWarning>
                {tr('submissionSuccess')}
              </h2>
              <Link 
                href="/"
                className="mt-6 inline-block w-full py-3 bg-[#0078FF] text-white text-center font-medium rounded-md"
                suppressHydrationWarning
              >
                {tr('backToHomeButton')}
              </Link>
            </div>
          ) : (
            <div>
              <div className="bg-[#01121f] text-white p-6">
                <h1 className="text-2xl font-bold mb-2" suppressHydrationWarning>
                  {tr('consultationTitle')}
                </h1>
                <p className="text-blue-100" suppressHydrationWarning>
                  {tr('consultationDesc')}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label 
                    htmlFor="name" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                    suppressHydrationWarning
                  >
                    {tr('nameLabel')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder={tr('namePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                    suppressHydrationWarning
                  >
                    {tr('emailLabel')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder={tr('emailPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="phone" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                    suppressHydrationWarning
                  >
                    {tr('phoneLabel')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder={tr('phonePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label 
                    className="block text-sm font-medium text-gray-700 mb-1"
                    suppressHydrationWarning
                  >
                    {tr('typeLabel')}
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        name="propertyType" 
                        value="home" 
                        defaultChecked 
                        className="h-4 w-4 text-blue-600"
                      />
                      <span 
                        className="ml-2 text-sm text-gray-700"
                        suppressHydrationWarning
                      >
                        {tr('typeHome')}
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        name="propertyType" 
                        value="business" 
                        className="h-4 w-4 text-blue-600"
                      />
                      <span 
                        className="ml-2 text-sm text-gray-700"
                        suppressHydrationWarning
                      >
                        {tr('typeBusiness')}
                      </span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                    suppressHydrationWarning
                  >
                    {tr('messageLabel')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder={tr('messagePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0078FF] text-white font-medium rounded-md"
                  suppressHydrationWarning
                >
                  {tr('submitButton')}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p suppressHydrationWarning>SOLARLAA. {tr('allRightsReserved')} © 2025</p>
        </div>
      </footer>
    </div>
  )
} 