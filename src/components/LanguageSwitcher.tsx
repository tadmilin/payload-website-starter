'use client'

import React from 'react'
import { useLanguage } from '@/providers/LanguageProvider/context'

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { locale, toggleLocale } = useLanguage()

  return (
    <button 
      onClick={toggleLocale} 
      className={`text-white hover:text-yellow-400 transition-colors font-medium ${className}`}
      aria-label={locale === 'th' ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
    >
      {locale === 'th' ? 'TH/EN' : 'EN/TH'}
    </button>
  )
} 