import Unauthorized from '@/components/unauthorized'
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  searchParams: { state: string; code: string }
}

const SubAccountMainPage = async ({ searchParams }: Props) => {
  console.log('Loading subaccount main page for testing')
  
  // Bypass authentication for testing - redirect to test subaccount
  const testSubaccountId = 'test-sub-1'
  
  if (searchParams.state) {
    const statePath = searchParams.state.split('___')[0]
    const stateSubaccountId = searchParams.state.split('___')[1] || testSubaccountId
    return redirect(
      `/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`
    )
  }

  // Redirect to test subaccount for testing
  return redirect(`/subaccount/${testSubaccountId}`)
}

export default SubAccountMainPage
