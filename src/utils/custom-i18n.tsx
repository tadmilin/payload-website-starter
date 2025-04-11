'use client'

import React from 'react'
import { useTranslation as originalUseTranslation } from 'react-i18next'

// ที่เราต้องครอบฟังก์ชัน useTranslation เพราะอาจมีปัญหาเรื่อง hooks
export function useTranslation(ns?: string | string[]) {
  try {
    return originalUseTranslation(ns)
  } catch (error) {
    console.error('Error in useTranslation:', error)
    // ส่งคืนค่าเริ่มต้นเพื่อป้องกันแอพพลิเคชันพัง
    return {
      t: (key: string) => key,
      i18n: {
        language: 'th',
        changeLanguage: () => Promise.resolve(),
      },
    }
  }
} 