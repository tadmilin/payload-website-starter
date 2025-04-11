'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/providers/LanguageProvider/context'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslation } from '@/utils/TranslationContext'

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale } = useLanguage();
  const { t } = useTranslation();

  // ตรวจจับการเลื่อนหน้าจอเพื่อเปลี่ยนสี nav bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-sm shadow-lg' : 'bg-gradient-to-r from-black/40 to-transparent backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* โลโก้ */}
          <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500">
            <Link href="/" className="flex items-center">
              <span className="mr-2">☀️</span>
              <span className="tracking-tight hover:scale-105 transition-transform">SolarLaa</span>
            </Link>
          </div>
          
          {/* เมนู */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white font-medium hover:text-yellow-400 transition-colors">
              {t('home')}
            </Link>
            <Link href="/simulator" className="text-white font-medium hover:text-yellow-400 transition-colors">
              {t('simulator')}
            </Link>
            <Link href="/shop" className="text-white font-medium hover:text-yellow-400 transition-colors">
              {t('shop')}
            </Link>
            <Link href="/monitor" className="text-white font-medium hover:text-yellow-400 transition-colors">
              {t('monitor')}
            </Link>
            <div className="pl-6 border-l border-white/30">
              <Link href="/login" className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-2 px-4 rounded-full transition-colors mr-4">
                {t('login')}
              </Link>
              <span className="text-white/70">|</span>
              <LanguageSwitcher className="ml-4" />
            </div>
          </div>
          
          {/* เมนูโมบาย */}
          <div className="md:hidden">
            <button 
              className="text-white bg-yellow-500/20 p-2 rounded-full hover:bg-yellow-500/30 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* เมนูมือถือ */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-lg mt-4 p-4 rounded-xl border border-yellow-500/20 shadow-lg">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-white font-medium hover:text-yellow-400 transition-colors">
                {t('home')}
              </Link>
              <Link href="/simulator" className="text-white font-medium hover:text-yellow-400 transition-colors">
                {t('simulator')}
              </Link>
              <Link href="/shop" className="text-white font-medium hover:text-yellow-400 transition-colors">
                {t('shop')}
              </Link>
              <Link href="/monitor" className="text-white font-medium hover:text-yellow-400 transition-colors">
                {t('monitor')}
              </Link>
              <div className="pt-4 border-t border-white/30 flex items-center justify-between">
                <Link href="/login" className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-2 px-4 rounded-full transition-colors">
                  {t('login')}
                </Link>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 