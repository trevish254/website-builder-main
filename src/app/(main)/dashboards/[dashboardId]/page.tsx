import { getAuthUserDetails } from '@/lib/queries'
import { getDashboardById } from '@/lib/dashboard-queries'
import { redirect } from 'next/navigation'
import DashboardClient from './_components/dashboard-client'

type Props = {
    params: { dashboardId: string }
}

const DashboardPage = async ({ params }: Props) => {
    const user = await getAuthUserDetails()

    if (!user) {
        redirect('/agency/sign-in')
    }

    const dashboard = await getDashboardById(params.dashboardId)

    if (!dashboard) {
        redirect('/dashboards')
    }

    // Check permissions
    const isOwner = dashboard.userId === user.id
    const isShared = dashboard.DashboardShare?.some(
        (share: any) => share.sharedWithUserId === user.id
    )

    if (dashboard.isPrivate && !isOwner && !isShared) {
        redirect('/dashboards')
        return null
    }

    return (
        <DashboardClient
            dashboard={dashboard}
            userId={user.id}
            isOwner={isOwner}
        />
    )
}

export default DashboardPage
