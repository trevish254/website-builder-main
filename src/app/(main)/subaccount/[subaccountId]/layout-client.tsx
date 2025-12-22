'use client'

import InfoBar from '@/components/global/infobar'
import MainLayoutWrapper from '@/components/sidebar/main-layout-wrapper'
import { SidebarProvider } from '@/providers/sidebar-provider'
import { usePathname } from 'next/navigation'
import React from 'react'

type Props = {
    children: React.ReactNode
    sidebar: React.ReactNode
    subaccountId: string
    userDetails: any
    subaccountDetails: any
}

const SubaccountLayoutClient = ({
    children,
    sidebar,
    subaccountId,
    userDetails,
    notifications,
    subaccountDetails,
}: Props) => {
    const pathname = usePathname()
    // Check for both legacy grapejs route and new editor route
    const isGrapeJsEditor = pathname.includes('/editor') || pathname.includes('/grapejs')

    if (isGrapeJsEditor) {
        return <div className="h-screen w-full relative overflow-hidden">{children}</div>
    }

    // Determine logo to show (Subaccount logo or Agency logo fallback)
    const logo = subaccountDetails?.subAccountLogo || userDetails?.Agency?.agencyLogo || '/assets/chapabiz-logo.png'
    const name = subaccountDetails?.name || 'Subaccount'

    return (
        <SidebarProvider>
            <div className="h-screen overflow-hidden">
                <InfoBar
                    notifications={notifications}
                    role={(userDetails?.role || 'AGENCY_OWNER') as any}
                    subAccountId={subaccountId}
                    agencyId={subaccountDetails?.agencyId}
                    agencyLogo={logo}
                    agencyName={name}
                />
                {sidebar}

                <MainLayoutWrapper>
                    <div className="relative flex-1 overflow-hidden">{children}</div>
                </MainLayoutWrapper>
            </div>
        </SidebarProvider>
    )
}

export default SubaccountLayoutClient
