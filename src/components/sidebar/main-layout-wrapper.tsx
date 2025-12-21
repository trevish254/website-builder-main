'use client'

import React from 'react'

import { useSidebar } from '@/providers/sidebar-provider'
import { cn } from '@/lib/utils'

type Props = {
    children: React.ReactNode
}

const MainLayoutWrapper = ({ children }: Props) => {
    const { isPanelCollapsed } = useSidebar()

    return (
        <div
            className={cn(
                "transition-all duration-200 ease-out flex flex-col h-full pt-[50px]",
                isPanelCollapsed ? "pl-[50px] md:pl-[60px]" : "pl-[50px] md:pl-[260px]"
            )}
        >
            {children}
        </div>
    )
}

export default MainLayoutWrapper
