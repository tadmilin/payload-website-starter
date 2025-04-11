'use client'

import * as React from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const TestI18n: React.FC = () => {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    console.log('Current language:', i18n.language)
  }, [i18n])

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <p className="text-lg">Current language: {i18n.language}</p>
      <p>Translation test: {t('home')}</p>
    </div>
  )
} 