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
import SubaccountLayoutClient from './layout-client'

const SubaccountLayout = async ({ children, params }: Props) => {
  const user = await getUser()
  if (!user) return redirect('/agency/sign-in')

  const userDetails = await getAuthUserDetails()
  if (!userDetails) return redirect('/agency')

  let subaccounts = ((userDetails as any).Agency?.SubAccount || []) as Array<{ id: string; agencyId: string }>

  // Also check permissions for subaccounts (for invited users)
  if ((userDetails as any).Permissions) {
    const permittedSubaccounts = (userDetails as any).Permissions
      .filter((p: any) => p.access && p.SubAccount)
      .map((p: any) => p.SubAccount)
    subaccounts = [...subaccounts, ...permittedSubaccounts]
  }

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
    <SubaccountLayoutClient
      subaccountId={params.subaccountId}
      userDetails={userDetails}
      notifications={notifications}
      sidebar={
        <Sidebar
          id={params.subaccountId}
          type="subaccount"
          defaultUser={userDetails}
        />
      }
    >
      {children}
    </SubaccountLayoutClient>
  )
}

export default SubaccountLayout
