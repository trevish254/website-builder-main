
import React from 'react'
import { ReportBuilderClient } from './_components/report-builder-client'

interface PageProps {
    params: {
        agencyId: string
        reportId: string
    }
}

const Page = ({ params }: PageProps) => {
    return (
        <div className="h-full w-full bg-background overflow-hidden flex flex-col">
            <ReportBuilderClient agencyId={params.agencyId} reportId={params.reportId} />
        </div>
    )
}

export default Page
