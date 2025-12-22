import BlurPage from '@/components/global/blur-page'
import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import {
  getNotificationAndUser,
  verifyAndAcceptInvitation,
  getAuthUserDetails,
} from '@/lib/queries'
import { getUser } from '@/lib/supabase/server'
import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
  params: { agencyId: string }
}

import { SidebarProvider } from '@/providers/sidebar-provider'
import MainLayoutWrapper from '@/components/sidebar/main-layout-wrapper'

const layout = async ({ children, params }: Props) => {
  const user = await getUser()
  if (!user) return redirect('/agency/sign-in')

  let [userDetails, notifications] = await Promise.all([
    getAuthUserDetails(),
    getNotificationAndUser(params.agencyId),
  ])

  if (!userDetails) {
    return redirect('/agency/sign-in')
  }

  // Check for invited access and override user details for context
  const invitedAgency = userDetails.InvitedAgencies?.find(
    (agency: any) => agency.id === params.agencyId
  )

  if (invitedAgency) {
    // If accessing an invited agency, use the role from the invitation
    // and pretend we are in that agency for the UI context
    userDetails = {
      ...userDetails,
      agencyId: invitedAgency.id,
      role: invitedAgency.role || userDetails.role, // Fallback to existing role if not found (shouldn't happen)
    }
  }

  // Check if user has access to this agency
  // User has access if:
  // 1. Their agencyId matches (they own/are assigned to this agency)
  // 2. They have an accepted invitation to this agency (InvitedAgencies)
  const hasDirectAccess = userDetails.agencyId === params.agencyId
  // We already checked invited access above, so if invitedAgency exists, we have access
  const hasAccess = hasDirectAccess || !!invitedAgency

  if (!hasAccess) {
    // Only show unauthorized if they don't have access through either method
    if (userDetails.role !== 'AGENCY_OWNER' && userDetails.role !== 'AGENCY_ADMIN') {
      return <Unauthorized />
    }
    return redirect('/')
  }

  // Redirect Subaccount Users to their subaccount
  if (
    userDetails.role === 'SUBACCOUNT_USER' ||
    userDetails.role === 'SUBACCOUNT_GUEST'
  ) {
    // If this is an invited user, we need to fetch their permissions for THIS agency
    let permissions = userDetails.Permissions

    console.log('🔍 Checking subaccount access for user:', user.email)
    console.log('🔍 Is invited agency?', !!invitedAgency)
    console.log('🔍 User role:', userDetails.role)

    if (invitedAgency) {
      // Fetch permissions for the invited agency
      console.log('🔍 Fetching permissions for invited user...')
      const { data: invitedPermissions } = await supabase
        .from('Permissions')
        .select('*')
        .eq('email', user.email)

      console.log('🔍 Invited permissions found:', invitedPermissions)
      permissions = invitedPermissions || []
    } else {
      console.log('🔍 Using home agency permissions:', permissions)
    }

    const firstSubaccountWithAccess = permissions.find(
      (p: any) => p.access === true
    )

    console.log('🔍 First subaccount with access:', firstSubaccountWithAccess)

    if (firstSubaccountWithAccess) {
      console.log('✅ Redirecting to subaccount:', firstSubaccountWithAccess.subAccountId)
      return redirect(`/subaccount/${firstSubaccountWithAccess.subAccountId}`)
    } else {
      console.log('❌ No subaccount access found - showing Unauthorized')
      return <Unauthorized />
    }
  }

  let allNoti: any = []
  if (notifications && Array.isArray(notifications)) {
    allNoti = notifications
  } else {
    allNoti = []
  }

  // Get role from userDetails
  const userRole = (userDetails as any)?.role || undefined

  // Get agency details for Navbar
  let agencyDetails: any = null
  if (invitedAgency) {
    agencyDetails = invitedAgency
  } else if (userDetails.Agency && userDetails.Agency.id === params.agencyId) {
    agencyDetails = userDetails.Agency
  }

  const agencyLogo = agencyDetails?.agencyLogo || '/assets/chapabiz-logo.png'
  const agencyName = agencyDetails?.name || 'Agency'

  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden">
        <InfoBar
          notifications={allNoti}
          role={userRole}
          subAccountId={params.agencyId}
          agencyId={params.agencyId}
          agencyLogo={agencyLogo}
          agencyName={agencyName}
        />
        <Sidebar
          id={params.agencyId}
          type="agency"
          defaultUser={userDetails}
        />
        <MainLayoutWrapper>
          <div className="relative">
            <BlurPage>{children}</BlurPage>
          </div>
        </MainLayoutWrapper>
      </div>
    </SidebarProvider>
  )
}

export default layout
