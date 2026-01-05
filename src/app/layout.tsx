import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'


const font = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chapabiz',
  description: 'All in one Agency Solution',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={`${font.className} overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}
