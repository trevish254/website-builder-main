'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type SidebarContextType = {
    isCollapsed: boolean
    toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType>({
    isCollapsed: false,
    toggleSidebar: () => { },
})

export const useSidebar = () => {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return context
}

export const SidebarProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const saved = localStorage.getItem('sidebar-collapsed')
        if (saved) {
            setIsCollapsed(JSON.parse(saved))
        }
    }, [])

    const toggleSidebar = () => {
        setIsCollapsed((prev) => {
            const newState = !prev
            localStorage.setItem('sidebar-collapsed', JSON.stringify(newState))
            return newState
        })
    }

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    )
}
