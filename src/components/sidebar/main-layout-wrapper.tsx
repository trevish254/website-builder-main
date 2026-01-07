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
                "transition-all duration-300 ease-out flex flex-col h-full pt-0",
                // On mobile: always just icon dock width
                // On desktop: icon dock (50px) + submenu panel (240px) when expanded
                isPanelCollapsed ? "pl-[50px]" : "pl-[50px] md:pl-[290px]"
            )}
        >
            {children}
        </div>
    )
}

export default MainLayoutWrapper
