'use client'

// Override React hooks to prevent import error
import React from 'react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// ตั้งค่า i18next ตั้งแต่แรกเพื่อป้องกัน warning
i18n.use(initReactI18next).init({
  lng: 'th',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

if (typeof window !== 'undefined') {
  window.React = React
  window.__REACT_PROVIDED__ = true
  window.i18n = i18n
}
