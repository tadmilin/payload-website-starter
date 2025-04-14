'use client'

import React from 'react'
import '../globals.css'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* ซ่อนทุกอย่างที่เกี่ยวกับ Payload */
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