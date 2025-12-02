import Casestudies from '@/components/ui/case-studies'
import React from 'react'

type Props = {
  params: {
    agencyId: string
  }
  searchParams: { code: string }
}

const LaunchPadPage = async ({ params, searchParams }: Props) => {
  return <Casestudies />
}

export default LaunchPadPage
