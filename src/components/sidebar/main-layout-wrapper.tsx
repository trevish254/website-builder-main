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
                "transition-all duration-300 ease-out flex flex-col min-h-screen pt-16 relative bg-white dark:bg-zinc-950",
                isPanelCollapsed ? "pl-[76px]" : "pl-[76px] md:pl-[316px]"
            )}
        >
            {/* Corner filler removed as it clashes with rounded edges */}

            {/* Scrollable content area */}
            <div className="flex-1 relative z-10 bg-gray-50 dark:bg-zinc-950">
                {children}
            </div>
        </div>
    )
}

export default MainLayoutWrapper
