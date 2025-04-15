'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function LearnHomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const menuRef = useRef(null);
  
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
      
      // เนื้อหาเฉพาะหน้านี้
      solarForHome: 'โซลาร์เซลล์สำหรับบ้าน',
      solarForHomeDesc: 'ระบบโซลาร์เซลล์ที่ออกแบบมาโดยเฉพาะสำหรับบ้านพักอาศัย ช่วยประหยัดค่าไฟฟ้าและเป็นมิตรกับสิ่งแวดล้อม',
      whySolar: 'ทำไมต้องใช้โซลาร์เซลล์ที่บ้าน?',
      benefitsTitle: 'ประโยชน์ของระบบโซลาร์เซลล์สำหรับบ้าน',
      benefit1: 'ประหยัดค่าไฟฟ้า',
      benefit1Desc: 'ลดค่าไฟฟ้าได้สูงสุดถึง 80% ด้วยพลังงานสะอาดจากแสงอาทิตย์',
      benefit2: 'เป็นมิตรกับสิ่งแวดล้อม',
      benefit2Desc: 'ลดการปล่อยคาร์บอนไดออกไซด์ ช่วยลดภาวะโลกร้อน',
      benefit3: 'ผลตอบแทนระยะยาว',
      benefit3Desc: 'คืนทุนภายใน 5-7 ปี และมีอายุการใช้งานยาวนานกว่า 25 ปี',
      howItWorks: 'วิธีการทำงานของระบบโซลาร์เซลล์',
      step1: 'แผงโซลาร์เซลล์',
      step1Desc: 'เปลี่ยนแสงอาทิตย์เป็นพลังงานไฟฟ้ากระแสตรง (DC)',
      step2: 'อินเวอร์เตอร์',
      step2Desc: 'แปลงพลังงานไฟฟ้ากระแสตรงเป็นกระแสสลับ (AC) ที่ใช้ในบ้าน',
      step3: 'ระบบจัดการพลังงาน',
      step3Desc: 'ควบคุมการไหลของพลังงานระหว่างแผงโซลาร์, แบตเตอรี่ และบ้าน',
      whatWeOffer: 'บริการของเรา',
      service1: 'ออกแบบระบบโซลาร์เซลล์',
      service1Desc: 'ออกแบบระบบโซลาร์เซลล์ที่เหมาะสมกับบ้านและความต้องการใช้ไฟฟ้าของคุณ',
      service2: 'ติดตั้งโดยทีมงานมืออาชีพ',
      service2Desc: 'ทีมงานผู้เชี่ยวชาญติดตั้งระบบอย่างมีคุณภาพและปลอดภัย',
      service3: 'บริการหลังการขาย',
      service3Desc: 'ดูแลและบำรุงรักษาระบบตลอดอายุการใช้งาน',
      orderNow: 'สั่งซื้อเดี๋ยวนี้',
      getFreeConsultation: 'ขอคำปรึกษาฟรี',
      copyright: '© 2024 SOLARLAA. All rights reserved.'
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
      
      // Content specific to this page
      solarForHome: 'Solar Solutions for Home',
      solarForHomeDesc: 'Solar systems designed specifically for residential homes, helping you save on electricity bills and be environmentally friendly',
      whySolar: 'Why Choose Solar for Your Home?',
      benefitsTitle: 'Benefits of Home Solar Systems',
      benefit1: 'Save on Electricity Bills',
      benefit1Desc: 'Reduce your electricity bills by up to 80% with clean energy from the sun',
      benefit2: 'Environmentally Friendly',
      benefit2Desc: 'Reduce carbon dioxide emissions and help combat global warming',
      benefit3: 'Long-term Returns',
      benefit3Desc: 'Return on investment within 5-7 years with a lifespan of over 25 years',
      howItWorks: 'How Solar Systems Work',
      step1: 'Solar Panels',
      step1Desc: 'Convert sunlight into direct current (DC) electricity',
      step2: 'Inverter',
      step2Desc: 'Convert DC electricity to alternating current (AC) for home use',
      step3: 'Energy Management System',
      step3Desc: 'Control energy flow between solar panels, batteries, and your home',
      whatWeOffer: 'Our Services',
      service1: 'Solar System Design',
      service1Desc: 'Design solar systems tailored to your home and electricity needs',
      service2: 'Professional Installation',
      service2Desc: 'Expert team installs your system with quality and safety in mind',
      service3: 'After-Sales Service',
      service3Desc: 'Maintain and service your system throughout its lifetime',
      orderNow: 'Order Now',
      getFreeConsultation: 'Get Free Consultation',
      copyright: '© 2024 SOLARLAA. All rights reserved.'
    }
  };
  
  const tr = (key) => {
    return translations[currentLang]?.[key] || translations.en[key];
  };
  
  useEffect(() => {
    setIsLoaded(true);
    
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

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
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

      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-900 to-[#01121f] py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" suppressHydrationWarning>{tr('solarForHome')}</h1>
              <div className="h-1 w-24 bg-yellow-400 mb-8"></div>
              <p className="text-blue-100 max-w-2xl text-lg" suppressHydrationWarning>{tr('solarForHomeDesc')}</p>
            </div>
            
            <div className="flex justify-center">
              <Image
                src="/images/2.png"
                alt="Solar Home"
                width={800}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
        </section>

        {/* Benefits Section */}
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center" suppressHydrationWarning>{tr('benefitsTitle')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2" suppressHydrationWarning>{tr('benefit1')}</h3>
                  <p className="text-gray-600" suppressHydrationWarning>{tr('benefit1Desc')}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2" suppressHydrationWarning>{tr('benefit2')}</h3>
                  <p className="text-gray-600" suppressHydrationWarning>{tr('benefit2Desc')}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2" suppressHydrationWarning>{tr('benefit3')}</h3>
                  <p className="text-gray-600" suppressHydrationWarning>{tr('benefit3Desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center" suppressHydrationWarning>{tr('howItWorks')}</h2>
              
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/3 mb-6 md:mb-0">
                    <div className="bg-blue-900 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">1</div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2" suppressHydrationWarning>{tr('step1')}</h3>
                    <p className="text-gray-600" suppressHydrationWarning>{tr('step1Desc')}</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/3 mb-6 md:mb-0">
                    <div className="bg-blue-900 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">2</div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2" suppressHydrationWarning>{tr('step2')}</h3>
                    <p className="text-gray-600" suppressHydrationWarning>{tr('step2Desc')}</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/3 mb-6 md:mb-0">
                    <div className="bg-blue-900 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">3</div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2" suppressHydrationWarning>{tr('step3')}</h3>
                    <p className="text-gray-600" suppressHydrationWarning>{tr('step3Desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center" suppressHydrationWarning>{tr('whatWeOffer')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4" suppressHydrationWarning>{tr('service1')}</h3>
                  <p className="text-gray-600 mb-4" suppressHydrationWarning>{tr('service1Desc')}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4" suppressHydrationWarning>{tr('service2')}</h3>
                  <p className="text-gray-600 mb-4" suppressHydrationWarning>{tr('service2Desc')}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4" suppressHydrationWarning>{tr('service3')}</h3>
                  <p className="text-gray-600 mb-4" suppressHydrationWarning>{tr('service3Desc')}</p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
                  <Link href="/order-home" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors" suppressHydrationWarning>
                    {tr('orderNow')}
                  </Link>
                  <Link href="/consultation" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-8 rounded-lg transition-colors" suppressHydrationWarning>
                    {tr('getFreeConsultation')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="bg-slate-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600" suppressHydrationWarning>
            <p>{tr('copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 