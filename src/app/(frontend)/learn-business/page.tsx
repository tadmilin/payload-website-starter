'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function LearnBusinessPage() {
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
      solarForBusiness: 'โซลาร์เซลล์สำหรับธุรกิจ',
      solarForBusinessDesc: 'ระบบโซลาร์เซลล์เพื่อธุรกิจที่ช่วยลดต้นทุนพลังงาน เพิ่มผลกำไร และสร้างภาพลักษณ์ที่ดีด้านความยั่งยืน',
      whyBusinessSolar: 'ทำไมธุรกิจควรเลือกใช้โซลาร์เซลล์?',
      businessBenefitsTitle: 'ประโยชน์สำหรับธุรกิจ',
      benefit1: 'ลดต้นทุนพลังงาน',
      benefit1Desc: 'ลดค่าใช้จ่ายด้านพลังงานระยะยาวและปกป้องธุรกิจจากราคาไฟฟ้าที่เพิ่มขึ้นในอนาคต',
      benefit2: 'ภาษีและสิทธิประโยชน์',
      benefit2Desc: 'ได้รับการลดหย่อนภาษีและสิทธิประโยชน์ทางการเงินสำหรับการลงทุนด้านพลังงานทดแทน',
      benefit3: 'ภาพลักษณ์ที่ยั่งยืน',
      benefit3Desc: 'เสริมสร้างภาพลักษณ์องค์กรที่รับผิดชอบต่อสิ่งแวดล้อมและดึงดูดลูกค้าที่ใส่ใจเรื่องความยั่งยืน',
      commercialSolutions: 'โซลูชันเชิงพาณิชย์',
      solution1: 'ระบบโซลาร์เซลล์บนหลังคา',
      solution1Desc: 'ใช้พื้นที่หลังคาที่ไม่ได้ใช้ประโยชน์ให้ผลิตพลังงานสะอาด',
      solution2: 'โซลาร์ฟาร์ม',
      solution2Desc: 'ระบบโซลาร์เซลล์ขนาดใหญ่บนพื้นดินสำหรับองค์กรที่ต้องการพลังงานจำนวนมาก',
      solution3: 'โซลาร์ลอยน้ำ',
      solution3Desc: 'ระบบโซลาร์เซลล์ลอยน้ำเหมาะสำหรับธุรกิจที่มีพื้นที่น้ำขนาดใหญ่',
      ourProcess: 'กระบวนการทำงานของเรา',
      process1: 'วิเคราะห์ความต้องการ',
      process1Desc: 'ประเมินการใช้พลังงานและพื้นที่ติดตั้งเพื่อออกแบบระบบที่เหมาะสม',
      process2: 'ออกแบบระบบ',
      process2Desc: 'ออกแบบระบบโซลาร์เซลล์ที่ตอบโจทย์ความต้องการของธุรกิจคุณ',
      process3: 'ติดตั้งและดูแลรักษา',
      process3Desc: 'ติดตั้งและให้บริการดูแลรักษาระบบโดยทีมผู้เชี่ยวชาญ',
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
      solarForBusiness: 'Solar Solutions for Business',
      solarForBusinessDesc: 'Commercial solar systems that reduce energy costs, increase profits, and enhance your sustainability image',
      whyBusinessSolar: 'Why Businesses Should Choose Solar',
      businessBenefitsTitle: 'Business Benefits',
      benefit1: 'Reduce Energy Costs',
      benefit1Desc: 'Lower long-term energy expenses and protect your business from future electricity price increases',
      benefit2: 'Tax Benefits & Incentives',
      benefit2Desc: 'Take advantage of tax breaks and financial incentives for renewable energy investments',
      benefit3: 'Sustainable Image',
      benefit3Desc: 'Enhance your corporate image as an environmentally responsible organization and attract sustainability-conscious customers',
      commercialSolutions: 'Commercial Solutions',
      solution1: 'Rooftop Solar',
      solution1Desc: 'Utilize unused roof space to generate clean energy',
      solution2: 'Solar Farms',
      solution2Desc: 'Large ground-mounted solar systems for organizations with high energy needs',
      solution3: 'Floating Solar',
      solution3Desc: 'Floating solar systems for businesses with large water surfaces',
      ourProcess: 'Our Process',
      process1: 'Needs Analysis',
      process1Desc: 'Assess your energy usage and installation space to design an appropriate system',
      process2: 'System Design',
      process2Desc: 'Design a solar system that meets your business requirements',
      process3: 'Installation & Maintenance',
      process3Desc: 'Professional installation and maintenance services by our expert team',
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
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" suppressHydrationWarning>{tr('solarForBusiness')}</h1>
              <div className="h-1 w-24 bg-yellow-400 mb-8"></div>
              <p className="text-blue-100 max-w-2xl text-lg" suppressHydrationWarning>{tr('solarForBusinessDesc')}</p>
            </div>
            
            <div className="flex justify-center">
              <Image
                src="/images/3.png"
                alt="Solar Business"
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
              <h2 className="text-3xl font-bold mb-8 text-center" suppressHydrationWarning>{tr('businessBenefitsTitle')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2" suppressHydrationWarning>{tr('benefit1')}</h3>
                  <p className="text-gray-600" suppressHydrationWarning>{tr('benefit1Desc')}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2" suppressHydrationWarning>{tr('benefit2')}</h3>
                  <p className="text-gray-600" suppressHydrationWarning>{tr('benefit2Desc')}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2" suppressHydrationWarning>{tr('benefit3')}</h3>
                  <p className="text-gray-600" suppressHydrationWarning>{tr('benefit3Desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commercial Solutions */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center" suppressHydrationWarning>{tr('commercialSolutions')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4" suppressHydrationWarning>{tr('solution1')}</h3>
                  <p className="text-gray-600 mb-4" suppressHydrationWarning>{tr('solution1Desc')}</p>
                  <div className="h-40 bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full relative">
                      <Image
                        src="/images/3.png"
                        alt="Rooftop Solar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4" suppressHydrationWarning>{tr('solution2')}</h3>
                  <p className="text-gray-600 mb-4" suppressHydrationWarning>{tr('solution2Desc')}</p>
                  <div className="h-40 bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full relative">
                      <Image
                        src="/images/1.png"
                        alt="Solar Farm"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4" suppressHydrationWarning>{tr('solution3')}</h3>
                  <p className="text-gray-600 mb-4" suppressHydrationWarning>{tr('solution3Desc')}</p>
                  <div className="h-40 bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full relative">
                      <Image
                        src="/images/4.png"
                        alt="Floating Solar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Process */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center" suppressHydrationWarning>{tr('ourProcess')}</h2>
              
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/3 mb-6 md:mb-0">
                    <div className="bg-blue-900 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">1</div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2" suppressHydrationWarning>{tr('process1')}</h3>
                    <p className="text-gray-600" suppressHydrationWarning>{tr('process1Desc')}</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/3 mb-6 md:mb-0">
                    <div className="bg-blue-900 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">2</div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2" suppressHydrationWarning>{tr('process2')}</h3>
                    <p className="text-gray-600" suppressHydrationWarning>{tr('process2Desc')}</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/3 mb-6 md:mb-0">
                    <div className="bg-blue-900 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">3</div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2" suppressHydrationWarning>{tr('process3')}</h3>
                    <p className="text-gray-600" suppressHydrationWarning>{tr('process3Desc')}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
                  <Link href="/order-business" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors" suppressHydrationWarning>
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