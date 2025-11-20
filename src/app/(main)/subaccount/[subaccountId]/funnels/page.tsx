import { getFunnels } from '@/lib/queries'
import React from 'react'
import FunnelsDataTable from './data-table'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import FunnelForm from '@/components/forms/funnel-form'
import BlurPage from '@/components/global/blur-page'
import RefreshButton from './refresh-button'

const Funnels = async ({ params }: { params: { subaccountId: string } }) => {
  console.log('🔍 Loading funnels for subaccount:', params.subaccountId)
  const funnels = await getFunnels(params.subaccountId)
  console.log('🔍 Fetched funnels:', funnels)
  
  if (!funnels) {
    console.log('❌ No funnels found or error occurred')
    return (
      <BlurPage>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">No Funnels Found</h2>
          <p className="text-muted-foreground mb-4">
            Create your first funnel to get started
          </p>
          <FunnelsDataTable
            actionButtonText={
              <>
                <Plus size={15} />
                Create Funnel
              </>
            }
            modalChildren={
              <FunnelForm subAccountId={params.subaccountId}></FunnelForm>
            }
            filterValue="name"
            columns={columns}
            data={[]}
          />
        </div>
      </BlurPage>
    )
  }

  return (
    <BlurPage>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Funnels</h1>
          <p className="text-muted-foreground">
            Manage your sales funnels and conversion pages
          </p>
        </div>
        <RefreshButton />
      </div>
      <FunnelsDataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        modalChildren={
          <FunnelForm subAccountId={params.subaccountId}></FunnelForm>
        }
        filterValue="name"
        columns={columns}
        data={funnels}
      />
    </BlurPage>
  )
}

export default Funnels
