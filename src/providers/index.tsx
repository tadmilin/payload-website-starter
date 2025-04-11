import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { LanguageProvider } from './LanguageProvider/context'
import { TranslationProvider } from '@/utils/TranslationContext'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TranslationProvider>
          <HeaderThemeProvider>{children}</HeaderThemeProvider>
        </TranslationProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
