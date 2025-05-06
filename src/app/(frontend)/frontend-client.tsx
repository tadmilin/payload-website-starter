'use client';

import React from 'react';
import Script from 'next/script';

export default function FrontendClientScripts() {
  return (
    <>
      <Script
        id="clarity-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID || ''}");
          `,
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || ''}`}
      />
      <Script
        id="google-analytics-setup"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || ''}');
          `,
        }}
      />
    </>
  );
}

// Custom hook for handling language
export function useLanguage() {
  const getCurrentLang = () => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('language') || 'en';
      } catch (e) {
        return 'en';
      }
    }
    return 'en';
  };

  const setLanguage = (lang: string) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('language', lang);
        document.documentElement.setAttribute('data-lang', lang);
        document.documentElement.lang = lang;

        // Set cookies for Next.js
        document.cookie = `locale=${lang};path=/;max-age=31536000`;
        document.cookie = `NEXT_LOCALE=${lang};path=/;max-age=31536000`;
      } catch (e) {
        console.error('Failed to set language:', e);
      }
    }
  };

  return {
    currentLang: getCurrentLang(),
    setLanguage,
  };
}
