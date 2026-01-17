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
                "transition-all duration-300 ease-out flex flex-col min-h-screen pt-16 bg-gradient-to-br from-orange-500 to-rose-600 relative",
                isPanelCollapsed ? "pl-[60px]" : "pl-[60px] md:pl-[300px]"
            )}
        >
            {/* Glassy Corner Intersection Effect - Fixed Positioning for scroll persistence */}
            <div className="fixed top-16 left-0 right-0 bottom-0 pointer-events-none z-0">
                <div className={cn(
                    "absolute top-0 w-20 h-20 backdrop-blur-3xl bg-white/20 transition-all duration-300 ease-out",
                    isPanelCollapsed ? "left-[60px]" : "left-[60px] md:left-[300px]"
                )} />
            </div>

            <div className="flex-1 bg-gray-50 dark:bg-zinc-950 rounded-tl-[32px] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] overflow-hidden relative z-10 flex flex-col">
                {children}
            </div>
        </div>
    )
}

export default MainLayoutWrapper
