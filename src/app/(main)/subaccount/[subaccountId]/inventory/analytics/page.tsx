import React from 'react'
import AnalyticsDashboard from './_components/analytics-dashboard'
import { getRevenueAnalyticsData } from '@/lib/queries'
import BlurPage from '@/components/global/blur-page'

type Props = {
    params: { subaccountId: string }
}

const AnalyticsPage = async ({ params }: Props) => {
    const data = await getRevenueAnalyticsData(params.subaccountId)

    return (
        <BlurPage>
            <div className="flex-1 overflow-y-auto h-full">
                <AnalyticsDashboard
                    subaccountId={params.subaccountId}
                    data={data}
                />
            </div>
        </BlurPage>
    )
}

export default AnalyticsPage

