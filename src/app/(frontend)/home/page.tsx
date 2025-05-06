'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('');
  const [userName, setUserName] = useState('');
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef(null);
  const { t } = useTranslation();

  const getCurrentLanguage = () => {
    return currentLang || 'en';
  };

  useEffect(() => {
    setMounted(true);
    let initLang;
    try {
      initLang = localStorage.getItem('language') || 'en';
    } catch (e) {
      initLang = 'en';
    }
    document.documentElement.setAttribute('data-lang', initLang);
    document.documentElement.lang = initLang;
    setCurrentLang(initLang);

    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
      }
    } catch (e) {
      console.error('ไม่สามารถอ่านข้อมูลผู้ใช้ได้:', e);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
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
    try {
      localStorage.setItem('language', newLang);
    } catch (e) {
      console.error('Failed to save language to localStorage:', e);
    }
    document.documentElement.setAttribute('data-lang', newLang);
    setCurrentLang(newLang);
    document.cookie = `locale=${newLang};path=/;max-age=31536000`;
    document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`;
    const event = new CustomEvent('toggle-language', { detail: { language: newLang } });
    document.dispatchEvent(event);
    setIsMenuOpen(false);
  };

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
      aboutUs: 'เกี่ยวกับเรา',
      contactUs: 'ติดต่อเรา',
      login: 'เข้าสู่ระบบ',
      freeConsultation: 'ขอคำปรึกษาฟรี',
      allRightsReserved: 'สงวนลิขสิทธิ์',
      scheduleConsultationToday: 'นัดหมายรับคำปรึกษาฟรีวันนี้',
      admin: 'ผู้ดูแลระบบ',
      logout: 'ออกจากระบบ',
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
      aboutUs: 'About Us',
      contactUs: 'Contact Us',
      login: 'Login',
      freeConsultation: 'Free Consultation',
      allRightsReserved: 'All rights reserved',
      scheduleConsultationToday: 'Schedule a Free Consultation Today',
      admin: 'Admin',
      logout: 'Logout',
    },
  };

  const tr = (key) => {
    const lang = getCurrentLanguage();
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <main
      className="flex flex-col min-h-screen bg-[#01121f] text-white overflow-hidden"
      suppressHydrationWarning
    >
      <div className="fixed top-0 left-0 w-full z-50" suppressHydrationWarning>
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="text-white font-bold">
            <Link href="/" className="flex items-center">
              <span className="text-lg mr-1">☀️</span>
              <span className="text-sm tracking-wider">SOLARLAA</span>
            </Link>
          </div>
          <div className="flex items-center">
            {mounted && userName && (
              <Link href="/profile" passHref>
                <div className="mr-3 text-sm text-white/90 bg-[#233544] px-3 py-1.5 rounded-sm cursor-pointer hover:bg-[#344554] transition-colors">
                  {userName}
                </div>
              </Link>
            )}
            <div className="relative" ref={menuRef}>
              <button
                onClick={toggleMenu}
                className="px-5 py-1.5 bg-[#233544] text-white text-xs font-medium rounded-sm"
                suppressHydrationWarning
              >
                {tr('menu')}
              </button>

              {mounted && isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#233544] rounded-sm shadow-lg z-50 py-1">
                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tr('homePage')}
                  </Link>
                  <Link
                    href="/simulator"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tr('simulator')}
                  </Link>
                  <Link
                    href="/shop"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tr('shop')}
                  </Link>
                  <Link
                    href="/track-system"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tr('trackSystem')}
                  </Link>
                  <div className="border-t border-[#455565] my-1 mx-2"></div>
                  <Link
                    href="/about-us"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tr('aboutUs')}
                  </Link>
                  <Link
                    href="/contact-us"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tr('contactUs')}
                  </Link>
                  <Link
                    href="/consultation"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tr('freeConsultation')}
                  </Link>
                  <div className="border-t border-[#455565] my-1 mx-2"></div>
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tr('admin')}
                  </Link>
                  <div className="border-t border-[#455565] my-1 mx-2"></div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#344554]"
                    onClick={handleLanguageToggle}
                  >
                    {tr('changeLanguage')}
                  </button>

                  {userName ? (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#344554]"
                      onClick={() => {
                        try {
                          localStorage.removeItem('user');
                          localStorage.removeItem('payloadToken');
                        } catch (e) {
                          console.error('Failed removing items from localStorage:', e);
                        }
                        setUserName('');
                        setIsMenuOpen(false);
                        window.location.reload();
                      }}
                    >
                      {tr('logout')}
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {tr('login')}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <section className="relative h-screen w-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(1,18,31,0.6)), url('/images/1.png')",
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          ></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-between text-center px-6">
            <div className="mt-32">
              <h1
                className="font-semibold mb-2"
                style={{ width: '390px', height: '48px', fontSize: '40px', lineHeight: '1.2' }}
              >
                {tr('solarMadeSimple')}
              </h1>
              <p
                className="text-white/90"
                style={{ width: '390px', height: '22px', fontSize: '18px', lineHeight: '1.2' }}
              >
                {tr('fastCalculation')}
              </p>
            </div>
            <div className="w-full mb-8">
              <Link
                href="/consultation"
                className="inline-block w-full py-3 bg-[#0078FF] text-white text-center font-medium rounded-md"
              >
                {tr('freeOnlineConsultation')}
              </Link>
            </div>
          </div>
        </section>

        <section className="relative h-screen w-full">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('/images/2.png')",
              backgroundPosition: 'center bottom',
              backgroundSize: 'cover',
            }}
          ></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-between text-center px-6">
            <div className="mt-32">
              <h2
                className="font-semibold mb-2"
                style={{ width: '390px', height: '48px', fontSize: '40px', lineHeight: '1.2' }}
              >
                {tr('forYourHome')}
              </h2>
              <p
                className="text-white/90"
                style={{ width: '390px', height: '22px', fontSize: '18px', lineHeight: '1.2' }}
              >
                {tr('scheduleConsultation')}
              </p>
            </div>
            <div className="w-full mb-8">
              <div className="flex space-x-4 w-full">
                <Link
                  href="/order-home"
                  className="flex-1 py-3 bg-[#0078FF] text-white text-center font-medium rounded-md"
                >
                  {tr('orderNow')}
                </Link>
                <Link
                  href="/learn-home"
                  className="flex-1 py-3 bg-white text-gray-900 text-center font-medium rounded-md"
                >
                  {tr('learnMore')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative h-screen w-full">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('/images/3.png')",
              backgroundPosition: 'center bottom',
              backgroundSize: 'cover',
            }}
          ></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-between text-center px-6">
            <div className="mt-32">
              <h2
                className="font-semibold mb-2"
                style={{ width: '390px', height: '48px', fontSize: '40px', lineHeight: '1.2' }}
              >
                {tr('forBusinessTitle')}
              </h2>
            </div>
            <div className="w-full mb-8">
              <div className="flex space-x-4 w-full">
                <Link
                  href="/order-business"
                  className="flex-1 py-3 bg-[#0078FF] text-white text-center font-medium rounded-md"
                >
                  {tr('orderNow')}
                </Link>
                <Link
                  href="/learn-business"
                  className="flex-1 py-3 bg-white text-gray-900 text-center font-medium rounded-md"
                >
                  {tr('learnMore')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative h-screen w-full">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('/images/4.png')",
              backgroundPosition: 'center bottom',
              backgroundSize: 'cover',
            }}
          ></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-between text-center px-6">
            <div className="mt-32">
              <h2
                className="font-semibold mb-1"
                style={{ width: '390px', height: '88px', fontSize: '40px', lineHeight: '1.2' }}
              >
                <span>{tr('weAre')}</span>
                <br />
                <span>{tr('solarlaa')}</span>
              </h2>
              <div style={{ height: '4px' }}></div>
              <p
                className="text-white/90"
                style={{ width: '390px', height: '22px', fontSize: '18px', lineHeight: '1.2' }}
              >
                {tr('trustedBy')}
              </p>
            </div>
            <div className="w-full mb-8">
              <Link
                href="/about-us"
                className="block w-full py-3 bg-white text-gray-900 text-center font-medium rounded-md"
              >
                {tr('getToKnowUs')}
              </Link>
            </div>
          </div>
        </section>
      </div>

      <footer className="text-center text-white/70 text-xs py-4 border-t border-white/10 mt-auto">
        <p className="mb-4">SOLARLAA. {tr('allRightsReserved')} © 2025</p>
        <div className="px-6">
          <Link
            href="/consultation"
            className="block w-full py-3 bg-[#0078FF] text-white text-center font-medium rounded-md"
          >
            {tr('scheduleConsultationToday')}
          </Link>
        </div>
      </footer>
    </main>
  );
}
