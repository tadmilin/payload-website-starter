import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { LanguageProvider } from './LanguageProvider/context'
import { I18nClientProvider } from '@/components/I18nClientProvider'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <I18nClientProvider>
          <HeaderThemeProvider>{children}</HeaderThemeProvider>
        </I18nClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
