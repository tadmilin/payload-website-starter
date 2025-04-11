'use client'

import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface TranslationWrapperProps {
  i18nKey: string;
  values?: Record<string, any>;
  children?: ReactNode;
}

export const TranslationWrapper: React.FC<TranslationWrapperProps> = ({ i18nKey, values, children }) => {
  const { t } = useTranslation()
  
  return <>{t(i18nKey, values) || children}</>
} 