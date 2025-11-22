'use client'

import { useSidebar } from '@/providers/sidebar-provider'
import { cn } from '@/lib/utils'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const MainLayoutWrapper = ({ children }: Props) => {
    const { isCollapsed } = useSidebar()

    return (
        <div
            className={cn(
                'transition-all duration-300 ease-in-out',
                isCollapsed ? 'md:pl-[70px]' : 'md:pl-[300px]'
            )}
        >
            {children}
        </div>
    )
}

export default MainLayoutWrapper
