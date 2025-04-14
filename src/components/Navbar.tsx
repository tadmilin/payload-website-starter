'use client'

import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/providers/LanguageProvider/context'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslation } from '@/utils/TranslationContext'

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale } = useLanguage();
  const { t } = useTranslation();
  const menuRef = useRef(null);

  // ปิดเมนูเมื่อคลิกนอกพื้นที่เมนู
  useEffect(() => {
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

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
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
          >
            Menu
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#233544] rounded-sm shadow-lg py-1 z-50">
              <Link 
                href="/home" 
                className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home')}
              </Link>
              <Link 
                href="/simulator" 
                className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('simulator')}
              </Link>
              <Link 
                href="/shop" 
                className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('shop')}
              </Link>
              <Link 
                href="/monitor" 
                className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('monitor')}
              </Link>
              <div className="border-t border-[#455565] my-1"></div>
              <Link 
                href="/for-home" 
                className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                onClick={() => setIsMenuOpen(false)}
              >
                สำหรับบ้าน
              </Link>
              <Link 
                href="/for-business" 
                className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                onClick={() => setIsMenuOpen(false)}
              >
                สำหรับธุรกิจ
              </Link>
              <Link 
                href="/about-us" 
                className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                onClick={() => setIsMenuOpen(false)}
              >
                เกี่ยวกับเรา
              </Link>
              <Link 
                href="/contact" 
                className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                onClick={() => setIsMenuOpen(false)}
              >
                ติดต่อเรา
              </Link>
              <div className="border-t border-[#455565] my-1"></div>
              <Link 
                href="/login" 
                className="block px-4 py-2 text-sm text-white hover:bg-[#344554]"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('login')}
              </Link>
              <Link 
                href="/consultation" 
                className="block px-4 py-2 text-sm text-white hover:bg-[#344554] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                ขอคำปรึกษาฟรี
              </Link>
              <div className="border-t border-[#455565] my-1"></div>
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-sm text-white/70">ภาษา:</span>
                <LanguageSwitcher />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 