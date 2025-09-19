import type { Metadata } from 'next';
import { Lato, Merriweather } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
});

export const metadata: Metadata = {
  title: 'Ikigai Career Discovery',
  description:
    "Discover your purpose through the intersection of what you love, what you're good at, what you can be paid for, and what the world needs.",
  verification: {
    google: '0BEX4Rw0MLK2KXMICB-yE2_pBXjUTOJ8gz32oytKRZU',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2291373051749863"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${lato.variable} ${merriweather.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
