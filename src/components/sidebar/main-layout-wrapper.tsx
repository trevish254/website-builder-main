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
                "transition-all duration-200 ease-out flex flex-col h-full",
                isPanelCollapsed ? "md:pl-[80px]" : "md:pl-[280px]"
            )}
        >
            {children}
        </div>
    )
}

export default MainLayoutWrapper
