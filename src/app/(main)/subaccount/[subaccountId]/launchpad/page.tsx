import QuickStart from '@/components/global/quick-start'
import { getAuthUserDetails } from '@/lib/queries'
import React from 'react'

type Props = {
  params: {
    subaccountId: string
  }
}

const LaunchPad = async ({ params }: Props) => {
  const user = await getAuthUserDetails()

  return (
    <div className="flex flex-col gap-4">
      <QuickStart userName={user?.name} />
    </div>
  )
}

export default LaunchPad
