import { getAuthUserDetails } from '@/lib/queries'
import { getUserDashboards } from '@/lib/dashboard-queries'
import { redirect } from 'next/navigation'
import DashboardManagementClient from './_components/dashboard-management-client'
import { Suspense } from 'react'

type Props = {
    searchParams: { filter?: string; view?: string }
}

const DashboardsPage = async ({ searchParams }: Props) => {
    const user = await getAuthUserDetails()

    if (!user) {
        redirect('/agency/sign-in')
    }

    const filter = (searchParams.filter as 'all' | 'my' | 'assigned' | 'private' | 'favorites') || 'all'
    const dashboards = await getUserDashboards(user.id, filter)

    return (
        <Suspense fallback={null}>
            <DashboardManagementClient
                dashboards={dashboards}
                userId={user.id}
                initialFilter={filter}
                initialView={(searchParams.view as 'grid' | 'list') || 'grid'}
            />
        </Suspense>
    )
}

export default DashboardsPage
