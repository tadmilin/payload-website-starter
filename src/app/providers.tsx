'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// ใช้ dynamic import เพื่อแก้ปัญหา hydration error
const LanguageDetectorComponent = dynamic(
  () => import('../components/LanguageDetector').then(mod => mod.default),
  { ssr: false }
)

const DefaultLanguageSetterComponent = dynamic(
  () => import('../components/DefaultLanguageSetter').then(mod => mod.default),
  { ssr: false }
)

export function ClientProviders() {
  return (
    <>
      <DefaultLanguageSetterComponent />
      <LanguageDetectorComponent />
    </>
  )
} 