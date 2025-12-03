import AgencyDetails from '@/components/forms/agency-details'
import UserDetails from '@/components/forms/user-details'
import Unauthorized from '@/components/unauthorized'
import { getAuthUserDetails } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { getUser } from '@/lib/supabase/server'
import React from 'react'

type Props = {
  params: { agencyId: string }
}

const SettingsPage = async ({ params }: Props) => {
  console.log('Loading agency settings page for', params.agencyId)

  try {
    // Fetch current user details
    const authUser = await getUser()
    if (!authUser) {
      return null
    }

    // Ensure the signed-in user is authorized for this agency
    const userDetails = await getAuthUserDetails()
    if (!userDetails) return null

    // Check if user has access (either owns it or was invited)
    const hasDirectAccess = (userDetails as any).agencyId === params.agencyId
    const invitedAgency = (userDetails as any).InvitedAgencies?.find(
      (agency: any) => agency.id === params.agencyId
    )

    if (!hasDirectAccess && !invitedAgency) {
      return <Unauthorized />
    }

    // Fetch agency details from database
    const { data: agencyData, error: agencyError } = await supabase
      .from('Agency')
      .select('*')
      .eq('id', params.agencyId)
      .single()

    if (agencyError) {
      return <Unauthorized />
    }

    // Fetch subaccounts for this agency
    const { data: subAccountsData, error: subAccountsError } = await supabase
      .from('SubAccount')
      .select('id, name')
      .eq('agencyId', params.agencyId)

    const subAccounts = subAccountsData || []

    if (subAccountsError) {
      console.error('Error fetching subaccounts:', subAccountsError)
    }

    // Determine the correct role based on context
    let contextRole = userDetails.role || 'AGENCY_OWNER'
    if (invitedAgency) {
      contextRole = invitedAgency.role || contextRole
    }

    const userData = userDetails ? {
      id: userDetails.id,
      name: userDetails.name || `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim(),
      email: userDetails.email || authUser.email || '',
      avatarUrl: userDetails.avatarUrl || authUser.imageUrl || '',
      role: contextRole
    } : {
      id: authUser.id,
      name: `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || 'User',
      email: authUser.email || '',
      avatarUrl: authUser.imageUrl || '',
      role: 'AGENCY_OWNER'
    }

    console.log('✅ Fetched agency data:', agencyData?.name)
    console.log('✅ Fetched user data:', userData.name)
    console.log('✅ Fetched subaccounts:', subAccounts.length)

    return (
      <div className="flex lg:!flex-row flex-col gap-4">
        <AgencyDetails data={agencyData} />
        <UserDetails
          type="agency"
          id={params.agencyId}
          subAccounts={subAccounts}
          userData={userData}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading settings page:', error)

    // Fallback UI in case of errors
    const authUser = await getUser()

    return (
      <div className="flex flex-col gap-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Settings</h2>
          <p className="text-muted-foreground">
            Unable to load agency settings. Please check your database connection.
          </p>
        </div>
        {authUser && (
          <div className="p-4 border rounded-lg">
            <h3 className="text-md font-semibold mb-2">Current User</h3>
            <p>Email: {authUser.emailAddresses[0]?.emailAddress || 'N/A'}</p>
            <p>Name: {`${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || 'N/A'}</p>
          </div>
        )}
      </div>
    )
  }
}

export default SettingsPage
