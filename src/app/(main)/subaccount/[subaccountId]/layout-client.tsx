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
    notifications: any[]
}

const SubaccountLayoutClient = ({
    children,
    sidebar,
    subaccountId,
    userDetails,
    notifications,
}: Props) => {
    const pathname = usePathname()
    // Check for both legacy grapejs route and new editor route
    const isGrapeJsEditor = pathname.includes('/editor') || pathname.includes('/grapejs')

    if (isGrapeJsEditor) {
        return <div className="h-screen w-full relative overflow-hidden">{children}</div>
    }

    return (
        <SidebarProvider>
            <div className="h-screen overflow-hidden">
                {sidebar}

                <MainLayoutWrapper>
                    <InfoBar
                        notifications={notifications}
                        role={(userDetails?.role || 'AGENCY_OWNER') as Role}
                        subAccountId={subaccountId}
                    />
                    <div className="relative flex-1 overflow-hidden">{children}</div>
                </MainLayoutWrapper>
            </div>
        </SidebarProvider>
    )
}

export default SubaccountLayoutClient
