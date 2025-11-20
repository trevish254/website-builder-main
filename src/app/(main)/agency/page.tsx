import AgencyDetails from '@/components/forms/agency-details'
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { Plan } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async ({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string }
}) => {
  const authUser = await currentUser()
  if (!authUser) return redirect('/agency/sign-in')

  // Check for pending invitation and accept it if found
  const agencyId = await verifyAndAcceptInvitation()
  
  let userDetails = await getAuthUserDetails()
  
  // If invitation was accepted, redirect to agency dashboard
  if (agencyId && !userDetails?.agencyId) {
    return redirect(`/agency/${agencyId}`)
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

  // Redirect to the user's agency
  if (userDetails.agencyId) {
    return redirect(`/agency/${userDetails.agencyId}`)
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
