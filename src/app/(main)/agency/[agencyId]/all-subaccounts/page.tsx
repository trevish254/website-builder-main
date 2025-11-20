import { getAuthUserDetails } from '@/lib/queries'
import { SubAccount } from '@/lib/database.types'
import SubAccountListPanel from './_components/subaccount-list-panel'
import SubAccountDetailsPanel from './_components/subaccount-details-panel'
import { Suspense } from 'react'

type Props = {
  params: { agencyId: string }
  searchParams: { subaccountId?: string }
}

const AllSubaccountsPage = async ({ params, searchParams }: Props) => {
  console.log('🎯 AllSubaccountsPage rendered!')
  console.log('📋 Params:', params)
  console.log('📋 SearchParams:', searchParams)
  
  const user = await getAuthUserDetails()
  if (!user) return null

  const subaccounts = (user as any).Agency?.SubAccount || []
  const selectedSubaccountId = searchParams.subaccountId
  
  console.log('📋 Subaccounts:', subaccounts.length)
  console.log('📋 Selected Subaccount ID:', selectedSubaccountId)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Panel - Subaccount List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <SubAccountListPanel 
            subaccounts={subaccounts}
            agencyId={params.agencyId}
            selectedSubaccountId={selectedSubaccountId}
          />
        </Suspense>
      </div>

      {/* Right Panel - Subaccount Details */}
      <div className="flex-1 bg-white dark:bg-gray-800">
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <SubAccountDetailsPanel 
            subaccountId={selectedSubaccountId}
            agencyId={params.agencyId}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default AllSubaccountsPage