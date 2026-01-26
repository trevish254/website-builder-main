import BlurPage from '@/components/global/blur-page'
import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/sidebar'
import MainLayoutWrapper from '@/components/sidebar/main-layout-wrapper'
import { getAuthUserDetails, getNotificationAndUser } from '@/lib/queries'
import { SidebarProvider } from '@/providers/sidebar-provider'
import { redirect } from 'next/navigation'
import React from 'react'
import { getUserDashboards } from '@/lib/dashboard-queries'

type Props = {
    children: React.ReactNode
}

const DashboardsLayout = async ({ children }: Props) => {
    const user = await getAuthUserDetails()
    if (!user) return redirect('/agency/sign-in')

    // Determine context for Sidebar and InfoBar
    // Case 1: User has an associated Agency (Agency Owner/Admin)
    // Case 2: User has Subaccount Permissions (Subaccount User/Guest)

    let type: 'agency' | 'subaccount' = 'agency'
    let id = user.agencyId

    if (!id && user.Permissions && user.Permissions.length > 0) {
        type = 'subaccount'
        id = user.Permissions[0].subAccountId
    }

    if (!id) {
        // Fallback if no agency or subaccount access found
        return redirect('/agency')
    }

    const agencyId = type === 'agency' ? id : (user.Agency?.id || user.Permissions?.[0]?.SubAccount?.agencyId)

    const notifications = await getNotificationAndUser(agencyId || id)
    const allNoti = Array.isArray(notifications) ? notifications : []

    const agencyDetails = user.Agency || user.Permissions?.[0]?.SubAccount?.Agency
    const agencyLogo = agencyDetails?.agencyLogo || '/assets/chapabiz-logo.png'
    const agencyName = agencyDetails?.name || 'Agency'

    const dashboards = await getUserDashboards(user.id)

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-white dark:bg-black">
                <InfoBar
                    notifications={allNoti}
                    role={user.role}
                    subAccountId={type === 'subaccount' ? id : undefined}
                    agencyLogo={agencyLogo}
                    agencyName={agencyName}
                    userData={user}
                />
                <Sidebar
                    id={id}
                    type={type}
                    defaultUser={user}
                    dashboards={dashboards}
                />
                <MainLayoutWrapper>
                    <div className="relative">
                        <BlurPage>{children}</BlurPage>
                    </div>
                </MainLayoutWrapper>
            </div>
        </SidebarProvider>
    )
}

export default DashboardsLayout
