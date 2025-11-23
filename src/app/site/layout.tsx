import Navigation from '@/components/site/navigation'
import React from 'react'
import { ThemeProvider } from '@/providers/theme-provider'
import ModalProvider from '@/providers/modal-provider'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnarToaster } from '@/components/ui/sonner'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ModalProvider>
        <main className="h-full">
          <Navigation />
          {children}
          <Toaster />
          <SonnarToaster position="bottom-left" />
        </main>
      </ModalProvider>
    </ThemeProvider>
  )
}

export default layout
