'use client'

import React from 'react'
import Script from 'next/script'

export default function FrontendClientScripts() {
  return (
    <>
      <Script id="language-script" strategy="beforeInteractive">
        {`
          try {
            var savedLang = localStorage.getItem('language');
            if (!savedLang) {
              localStorage.setItem('language', 'th');
            }
            document.documentElement.lang = savedLang || 'th';
            document.documentElement.setAttribute('data-lang', savedLang || 'th');
          } catch (e) {}
        `}
      </Script>
      
      <style jsx global>{`
        /* ซ่อนทุกอย่างที่เกี่ยวกับ Payload */
        nav.payload-nav,
        header.payload-header,
        .payload-header,
        .payload-nav,
        .admin-bar,
        div[class*="payload-"],
        footer.payload-footer,
        .payload-footer {
          display: none !important;
        }
        
        /* ซ่อน AdminBar */
        .admin-bar {
          display: none !important;
        }
        
        /* ซ่อน Header ของ Payload */
        header:has(.payload-logo), 
        header:has([alt="Payload Logo"]) {
          display: none !important;
        }
      `}</style>
    </>
  )
} 