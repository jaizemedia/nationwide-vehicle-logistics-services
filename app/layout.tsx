import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Continental Vehicle Logistics Services | Safe & Reliable Transport',
  description: 'Professional vehicle movement and logistics support company. Trade plate movements, bulk delivery, vehicle inspections, and customer handover services.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/light-mode-logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/dark-mode-logo.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/4.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
