'use client'

import React, { createContext, useContext, useState } from 'react'

type SidebarContextType = {
    hoveredMenuItem: string | null
    setHoveredMenuItem: (id: string | null) => void
    activeCategory: string | null
    setActiveCategory: (category: string | null) => void
    isPanelCollapsed: boolean
    setIsPanelCollapsed: (collapsed: boolean) => void
    panelTop: number | null
    setPanelTop: (top: number | null) => void
}

const SidebarContext = createContext<SidebarContextType>({
    hoveredMenuItem: null,
    setHoveredMenuItem: () => { },
    activeCategory: null,
    setActiveCategory: () => { },
    isPanelCollapsed: false,
    setIsPanelCollapsed: () => { },
    panelTop: null,
    setPanelTop: () => { }
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
    const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
    const [panelTop, setPanelTop] = useState<number | null>(null)

    return (
        <SidebarContext.Provider value={{
            hoveredMenuItem,
            setHoveredMenuItem,
            activeCategory,
            setActiveCategory,
            isPanelCollapsed,
            setIsPanelCollapsed,
            panelTop,
            setPanelTop
        }}>
            {children}
        </SidebarContext.Provider>
    )
}
