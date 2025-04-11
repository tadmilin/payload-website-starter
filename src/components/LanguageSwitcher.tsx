'use client'

import * as React from 'react'
import { useLanguage } from '@/providers/LanguageProvider/context'
import { useTranslation } from '@/utils/TranslationContext'

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { locale, toggleLocale } = useLanguage()
  const { toggleLocale: toggleTranslation } = useTranslation()

  const handleToggle = () => {
    toggleLocale()
    // เปลี่ยนภาษาของ translation provider ด้วย
    toggleTranslation()
  }

  return (
    <button 
      onClick={handleToggle} 
      className={`text-white hover:text-yellow-400 transition-colors font-medium ${className}`}
      aria-label={locale === 'th' ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
    >
      {locale === 'th' ? 'TH/EN' : 'EN/TH'}
    </button>
  )
} 