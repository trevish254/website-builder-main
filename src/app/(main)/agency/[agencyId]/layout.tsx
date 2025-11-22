import BlurPage from '@/components/global/blur-page'
import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import {
  getNotificationAndUser,
  verifyAndAcceptInvitation,
  getAuthUserDetails,
} from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
  params: { agencyId: string }
}

import { SidebarProvider } from '@/providers/sidebar-provider'
import MainLayoutWrapper from '@/components/sidebar/main-layout-wrapper'

const layout = async ({ children, params }: Props) => {
  const user = await currentUser()
  if (!user) return redirect('/agency/sign-in')

  const [userDetails, notifications] = await Promise.all([
    getAuthUserDetails(),
    getNotificationAndUser(params.agencyId),
  ])

  if (!userDetails) {
    return redirect('/agency/sign-in')
  }

  // Check if user has access to this agency
  if (
    userDetails.agencyId !== params.agencyId &&
    userDetails.role !== 'AGENCY_OWNER' &&
    userDetails.role !== 'AGENCY_ADMIN'
  ) {
    return <Unauthorized />
  }

  let allNoti: any = []
  if (notifications && Array.isArray(notifications)) {
    allNoti = notifications
  } else {
    allNoti = []
  }

  // Get role from userDetails
  const userRole = (userDetails as any)?.role || undefined

  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden">
        <Sidebar
          id={params.agencyId}
          type="agency"
          defaultUser={userDetails}
        />
        <MainLayoutWrapper>
          <InfoBar
            notifications={allNoti}
            role={userRole}
          />
          <div className="relative">
            <BlurPage>{children}</BlurPage>
          </div>
        </MainLayoutWrapper>
      </div>
    </SidebarProvider>
  )
}

export default layout
