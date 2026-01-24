import React from 'react'
import { ThemeProvider } from '@/providers/theme-provider'
import ModalProvider from '@/providers/modal-provider'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnarToaster } from '@/components/ui/sonner'
import VideoCallInvitationListener from '@/components/global/video-call-invitation-listener'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ModalProvider>
        <VideoCallInvitationListener />
        {children}
        <Toaster />
        <SonnarToaster position="bottom-left" />
      </ModalProvider>
    </ThemeProvider>
  )
}

export default Layout
