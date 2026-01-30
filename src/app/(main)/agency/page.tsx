import AgencyDetails from '@/components/forms/agency-details'
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { getUser } from '@/lib/supabase/server'
import { Plan } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async ({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string }
}) => {
  const authUser = await getUser()
  if (!authUser) return redirect('/agency/sign-in')

  // Check for pending invitation and accept it if found
  const agencyId = await verifyAndAcceptInvitation()

  let userDetails = await getAuthUserDetails()

  // If invitation was accepted, redirect to that agency launchpad
  if (agencyId) {
    return redirect(`/agency/${agencyId}/launchpad`)
  }

  // If user doesn't exist in database, show agency creation form
  if (!userDetails) {
    return (
      <div className="flex justify-center items-center mt-4">
        <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
          <h1 className="text-4xl">Create Your Agency</h1>
          <AgencyDetails
            data={{}}
            type="create"
          />
        </div>
      </div>
    )
  }

  // Handle invitation acceptance
  if (searchParams.state) {
    const statePath = searchParams.state.split('___')[0]
    const stateAgencyId = searchParams.state.split('___')[1]
    if (!stateAgencyId) return <div>Not authorized</div>
    return redirect(
      `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
    )
  }

  // NEW: If user has accepted invitations, redirect to the first one's launchpad
  if ((userDetails as any).InvitedAgencies?.length > 0) {
    return redirect(`/agency/${(userDetails as any).InvitedAgencies[0].id}/launchpad`)
  }

  // Redirect to the user's agency launchpad
  if (userDetails.agencyId) {
    return redirect(`/agency/${userDetails.agencyId}/launchpad`)
  }

  // If user has subaccount permissions, redirect to the first one's launchpad
  if (userDetails.Permissions && userDetails.Permissions.length > 0) {
    const firstSubaccountWithAccess = userDetails.Permissions.find(
      (p: any) => p.access === true
    )
    if (firstSubaccountWithAccess) {
      return redirect(`/subaccount/${firstSubaccountWithAccess.subAccountId}/launchpad`)
    }
  }

  // If user has no agency, show creation form
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
        <h1 className="text-4xl">Create Your Agency</h1>
        <AgencyDetails
          data={{}}
          type="create"
        />
      </div>
    </div>
  )
}

export default Page
