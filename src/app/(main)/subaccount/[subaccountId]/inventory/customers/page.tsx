import BlurPage from '@/components/global/blur-page'
import { getCustomersWithStats, getRevenueAnalyticsData, getSubaccountDetails } from '@/lib/queries'
import React from 'react'
import CustomersClient from './_components/customers-client'

type Props = {
    params: { subaccountId: string }
}

const CustomersPage = async ({ params }: Props) => {
    const [customers, analytics, subaccount] = await Promise.all([
        getCustomersWithStats(params.subaccountId),
        getRevenueAnalyticsData(params.subaccountId),
        getSubaccountDetails(params.subaccountId)
    ])

    return (
        <BlurPage>
            <CustomersClient
                customers={customers || []}
                subaccountId={params.subaccountId}
                analytics={analytics}
                subaccount={subaccount}
            />
        </BlurPage>
    )
}

export default CustomersPage
