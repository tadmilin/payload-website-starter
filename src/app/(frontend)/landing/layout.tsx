'use client'

import React from 'react'
import '../globals.css'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          nav.payload-nav,
          footer.payload-footer {
            display: none !important;
          }
        `
      }} />
      {children}
    </>
  )
} 