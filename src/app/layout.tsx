import './globals.css'
import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import "@uploadthing/react/styles.css"
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider"


const font = Inter({ subsets: ['latin'] })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })

export const metadata: Metadata = {
  title: 'Chapabiz',
  description: 'All in one Agency Solution',
  icons: {
    icon: '/icon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
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
      <body className={`${font.className} ${orbitron.variable} overflow-x-hidden`}>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
