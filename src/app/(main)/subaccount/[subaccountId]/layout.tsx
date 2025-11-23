import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import {
  getAuthUserDetails,
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from '@/lib/queries'
import { getUser } from '@/lib/supabase/server'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
  params: { subaccountId: string }
}

import { SidebarProvider } from '@/providers/sidebar-provider'
import MainLayoutWrapper from '@/components/sidebar/main-layout-wrapper'

const SubaccountLayout = async ({ children, params }: Props) => {
  const user = await getUser()
  if (!user) return redirect('/agency/sign-in')

  const userDetails = await getAuthUserDetails()
  if (!userDetails) return redirect('/agency')

  const subaccounts = ((userDetails as any).Agency?.SubAccount || []) as Array<{ id: string; agencyId: string }>
  const subaccount = subaccounts.find((s) => s.id === params.subaccountId)
  if (!subaccount) {
    return <Unauthorized />
  }

  let notifications: any = []
  try {
    const allNotifications = await getNotificationAndUser(subaccount.agencyId)
    notifications = allNotifications || []
  } catch (error) {
    notifications = []
  }

  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden">
        <Sidebar
          id={params.subaccountId}
          type="subaccount"
          defaultUser={userDetails}
        />

        <MainLayoutWrapper>
          <InfoBar
            notifications={notifications}
            role={((userDetails as any).role || 'AGENCY_OWNER') as Role}
            subAccountId={params.subaccountId as string}
          />
          <div className="relative">{children}</div>
        </MainLayoutWrapper>
      </div>
    </SidebarProvider>
  )
}

export default SubaccountLayout
