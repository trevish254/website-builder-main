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
            {/* Precision Concave Corner Filler - Fixed at intersection */}
            <div
                className={cn(
                    "fixed top-16 w-[32px] h-[32px] z-[70] pointer-events-none transition-all duration-300 ease-out",
                    isPanelCollapsed ? "left-[60px]" : "left-[60px] md:left-[300px]"
                )}
                style={{
                    background: 'linear-gradient(to bottom right, #f97316, #e11d48)',
                    WebkitMaskImage: 'radial-gradient(circle at 32px 32px, transparent 32px, black 32px)',
                    maskImage: 'radial-gradient(circle at 32px 32px, transparent 32px, black 32px)'
                }}
            />

            {/* Scrollable content area */}
            <div className="flex-1 relative z-10 bg-gray-50 dark:bg-zinc-950">
                {children}
            </div>
        </div>
    )
}

export default MainLayoutWrapper
