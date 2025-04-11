'use client'

import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface CustomTransProps {
  i18nKey: string
  values?: Record<string, any>
  children?: ReactNode
  ns?: string
}

export const CustomTrans: React.FC<CustomTransProps> = ({ 
  i18nKey, 
  values, 
  children, 
  ns
}) => {
  const { t } = useTranslation(ns)
  
  return <>{t(i18nKey, values) || children}</>
} 