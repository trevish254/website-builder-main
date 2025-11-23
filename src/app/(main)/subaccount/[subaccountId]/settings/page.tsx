import SubAccountDetails from '@/components/forms/subaccount-details'
import UserDetails from '@/components/forms/user-details'
import BlurPage from '@/components/global/blur-page'
import { supabase } from '@/lib/supabase'
import { getUser } from '@/lib/supabase/server'
import React from 'react'

type Props = {
  params: { subaccountId: string }
}

const SubaccountSettingPage = async ({ params }: Props) => {
  const authUser = await getUser()
  if (!authUser) return

  const { data: userDetails } = await supabase
    .from('User')
    .select('*')
    .eq('email', authUser.emailAddresses[0].emailAddress)
    .single()

  if (!userDetails) return

  const { data: subAccount } = await supabase
    .from('SubAccount')
    .select('*')
    .eq('id', params.subaccountId)
    .single()

  if (!subAccount) return

  const { data: agencyDetails } = await supabase
    .from('Agency')
    .select(`
      *,
      SubAccount (*)
    `)
    .eq('id', subAccount.agencyId)
    .single()

  if (!agencyDetails) return
  const subAccounts = agencyDetails.SubAccount

  return (
    <BlurPage>
      <div className="flex lg:!flex-row flex-col gap-4">
        <SubAccountDetails
          agencyDetails={agencyDetails}
          details={subAccount}
          userId={userDetails.id}
          userName={userDetails.name}
        />
        <UserDetails
          type="subaccount"
          id={params.subaccountId}
          subAccounts={subAccounts}
          userData={userDetails}
        />
      </div>
    </BlurPage>
  )
}

export default SubaccountSettingPage
