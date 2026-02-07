import BlurPage from '@/components/global/blur-page'
import { supabase } from '@/lib/supabase'
import { getAuthUserDetails } from '@/lib/queries'
import QuickStart from '@/components/global/quick-start'
import React from 'react'

type Props = {
  params: { subaccountId: string }
  searchParams: {
    code: string
  }
}

const SubaccountPageId = async ({ params, searchParams }: Props) => {
  const user = await getAuthUserDetails()

  const { data: subaccountDetails } = await supabase
    .from('SubAccount')
    .select('*')
    .eq('id', params.subaccountId)
    .single()

  if (!subaccountDetails) return

  return (
    <BlurPage>
      <div className="flex flex-col gap-4">
        <QuickStart
          userName={user?.name}
          userImage={user?.avatarUrl}
          agencyIcon={subaccountDetails.subAccountLogo}
        />
      </div>
    </BlurPage>
  )
}

export default SubaccountPageId