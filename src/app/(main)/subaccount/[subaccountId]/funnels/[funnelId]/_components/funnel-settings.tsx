import React from 'react'

import { Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'

import FunnelForm from '@/components/forms/funnel-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import FunnelProductsTable from './funnel-products-table'

type Funnel = Database['public']['Tables']['Funnel']['Row']

interface FunnelSettingsProps {
  subaccountId: string
  defaultData: Funnel
}

const FunnelSettings: React.FC<FunnelSettingsProps> = async ({
  subaccountId,
  defaultData,
}) => {
  const { data: subaccountDetails, error } = await supabase
    .from('SubAccount')
    .select('*')
    .eq('id', subaccountId)
    .single()

  if (error || !subaccountDetails) {
    console.error('Error fetching subaccount details:', error)
    return null
  }

  // Note: Payment integration would need to be implemented separately
  // For now, we skip the Stripe product fetching
  const products: any[] = []

  return (
    <div className="flex gap-4 flex-col xl:!flex-row">
      <Card className="flex-1 flex-shrink">
        <CardHeader>
          <CardTitle>Funnel Products</CardTitle>
          <CardDescription>
            Select the products and services you wish to sell on this funnel.
            You can sell one time and recurring products too.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <>
            {products.length > 0 ? (
              <FunnelProductsTable
                defaultData={defaultData}
                products={products}
              />
            ) : (
              <p className="text-muted-foreground">
                Connect your payment account to sell products.
              </p>
            )}
          </>
        </CardContent>
      </Card>

      <FunnelForm
        subAccountId={subaccountId}
        defaultData={defaultData}
      />
    </div>
  )
}

export default FunnelSettings
