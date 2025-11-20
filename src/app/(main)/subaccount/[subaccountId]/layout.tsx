import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import {
  getAuthUserDetails,
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
  params: { subaccountId: string }
}

const SubaccountLayout = async ({ children, params }: Props) => {
  const user = await currentUser()
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
    <div className="h-screen overflow-hidden">
      <Sidebar
        id={params.subaccountId}
        type="subaccount"
        defaultUser={userDetails}
      />

      <div className="md:pl-[300px]">
        <InfoBar
          notifications={notifications}
          role={((userDetails as any).role || 'AGENCY_OWNER') as Role}
          subAccountId={params.subaccountId as string}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  )
}

export default SubaccountLayout
