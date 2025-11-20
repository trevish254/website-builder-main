import Navigation from '@/components/site/navigation'
import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { ThemeProvider } from '@/providers/theme-provider'
import ModalProvider from '@/providers/modal-provider'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnarToaster } from '@/components/ui/sonner'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
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
    </ClerkProvider>
  )
}

export default layout
