import type { Metadata } from 'next';
import { Providers } from '@/providers';
import { getServerSideURL } from '@/utilities/getURL';
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#233544" />
        <meta httpEquiv="Content-Language" content="en" />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <Script id="set-language" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var savedLang = localStorage.getItem('language') || 'en';
                document.documentElement.setAttribute('data-lang', savedLang);
                document.documentElement.lang = savedLang;
              } catch (e) {
                console.error('Error setting language:', e);
              }
            })();
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
};
