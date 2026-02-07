import BlurPage from '@/components/global/blur-page'
import { supabase } from '@/lib/supabase'
import { getOrderStats, getProducts, getContacts } from '@/lib/queries'
import React from 'react'
import ProductDashboardClient from '../../_components/product-dashboard-client'

type Props = {
    params: { subaccountId: string }
    searchParams: {
        code: string
    }
}

const ProductDashboardPage = async ({ params, searchParams }: Props) => {
    const { data: subaccountDetails } = await supabase
        .from('SubAccount')
        .select('*')
        .eq('id', params.subaccountId)
        .single()

    if (!subaccountDetails) return

    // Fetch all necessary data for the new dashboard
    const orderStats = await getOrderStats(params.subaccountId)
    const { data: products } = await getProducts(params.subaccountId, { limit: 5 })
    const contacts = await getContacts(params.subaccountId)

    // Calculate total revenue from orderStats.orders
    const totalRevenue = orderStats.orders?.reduce((acc, order) => acc + (order.totalPrice || 0), 0) || 0

    return (
        <BlurPage>
            <ProductDashboardClient
                subaccountId={params.subaccountId}
                subaccountDetails={subaccountDetails}
                orderStats={orderStats}
                products={products || []}
                contacts={contacts || []}
                totalRevenue={totalRevenue}
            />
        </BlurPage>
    )
}

export default ProductDashboardPage
