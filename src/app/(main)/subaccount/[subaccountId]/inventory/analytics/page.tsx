import React from 'react'
import AnalyticsDashboard from './_components/analytics-dashboard'

type Props = {
    params: { subaccountId: string }
}

const AnalyticsPage = ({ params }: Props) => {
    return (
        <div className="flex-1 overflow-y-auto h-full">
            <AnalyticsDashboard subaccountId={params.subaccountId} />
        </div>
    )
}

export default AnalyticsPage
