import QuickStart from '@/components/global/quick-start'
import { getAuthUserDetails } from '@/lib/queries'
import React from 'react'

type Props = {
  params: {
    agencyId: string
  }
}

const LaunchPadPage = async ({ params }: Props) => {
  const user = await getAuthUserDetails()

  return (
    <div className="flex flex-col gap-4">
      <QuickStart
        userName={user?.name}
        userImage={user?.avatarUrl}
        agencyIcon={user?.Agency?.agencyLogo}
      />
    </div>
  )
}

export default LaunchPadPage
