import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Providers } from '@/lib/providers'

export const metadata: Metadata = {
  title: 'Castello Coffee – نظام إدارة الرواتب',
  description: 'منصة إدارة الرواتب والموارد البشرية التنفيذية لمقاهي كاستيلو',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body suppressHydrationWarning className="bg-castello-smoke">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

