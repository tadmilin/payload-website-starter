'use client'

import React from 'react'
import type { ReactNode } from 'react'
import i18next from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { useLanguage } from '@/providers/LanguageProvider/context'
import { locales, defaultLocale } from '@/utils/minimal-i18n'

interface I18nClientProviderProps {
  children: ReactNode
}

// สร้าง i18next instance เพียงครั้งเดียว
i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend((language: string, namespace: string) => 
      import(`../../public/locales/${language}/${namespace}.json`)
    )
  )
  .init({
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    supportedLngs: locales,
    defaultNS: 'common',
    fallbackNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export function I18nClientProvider({ children }: I18nClientProviderProps) {
  const { locale } = useLanguage()

  React.useEffect(() => {
    if (locale && i18next.language !== locale) {
      i18next.changeLanguage(locale)
    }
  }, [locale])

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
} 